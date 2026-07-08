// Removes Gemini's fake checkerboard "transparency" from character renders.
//
// Reads originals from assets-src/characters/, writes true-alpha 1024px PNGs
// to public/characters/. Never modifies the source files.
//
// Approach: the checkerboard is a regular grid of two flat greys. We detect
// the two colours, the square size, and the grid phase, then a pixel is
// background only if it matches the grey PREDICTED for its own grid cell.
// This distinguishes snow/clouds/white clothing from the light checker grey,
// and catches enclosed checkerboard holes without any flood fill.
//
// Usage: node scripts/remove-checkerboard.mjs
import { chromium } from "playwright";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const SRC = new URL("../assets-src/characters/", import.meta.url).pathname;
const OUT = new URL("../public/characters/", import.meta.url).pathname;

const files = readdirSync(SRC).filter((f) => f.endsWith(".png"));
if (files.length === 0) {
  console.log("No PNGs in assets-src/characters/ yet.");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();

for (const file of files) {
  const b64 = readFileSync(path.join(SRC, file)).toString("base64");
  const out = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const W = img.width, H = img.height;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const im = g.getImageData(0, 0, W, H);
    const d = im.data;
    const px = (x, y) => {
      const i = (y * W + x) * 4;
      return [d[i], d[i + 1], d[i + 2]];
    };
    const dist = (a, b) =>
      Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));

    // 1. Two dominant flat colours along the top edge = the checker greys.
    const counts = new Map();
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < W; x++) {
        const [r, gg, b] = px(x, y);
        const k = `${r >> 2},${gg >> 2},${b >> 2}`;
        counts.set(k, (counts.get(k) || 0) + 1);
      }
    const [A, B] = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([k]) => k.split(",").map((v) => (Number(v) << 2) + 2));

    // 2. Square size + phase from colour flips along the top row.
    const rowColor = (x) => (dist(px(x, 2), A) < dist(px(x, 2), B) ? 0 : 1);
    const flips = [];
    let prev = rowColor(0);
    for (let x = 1; x < W; x++) {
      const cur = rowColor(x);
      if (cur !== prev) flips.push(x);
      prev = cur;
    }
    const gaps = flips.slice(1).map((v, i) => v - flips[i]);
    gaps.sort((a, b) => a - b);
    const size = gaps[Math.floor(gaps.length / 2)]; // median gap = square size
    const phaseX = flips[0] % size;
    // vertical phase via a column scan
    const colColor = (y) => (dist(px(2, y), A) < dist(px(2, y), B) ? 0 : 1);
    let phaseY = 0;
    let prevC = colColor(0);
    for (let y = 1; y < H; y++) {
      if (colColor(y) !== prevC) { phaseY = y % size; break; }
    }
    const parityAt0 = rowColor(Math.floor(phaseX + size / 2)) ^ 1; // parity of cell 0 after phase
    const predicted = (x, y) => {
      const cx = Math.floor((x - phaseX + size) / size);
      const cy = Math.floor((y - phaseY + size) / size);
      return ((cx + cy) % 2 === parityAt0 ? 1 : 0) ? B : A;
    };

    // 3. Mask: pixel is background iff close to its OWN cell's predicted grey.
    const TOL = 22;
    const mask = new Uint8Array(W * H);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const p = predicted(x, y);
        if (
          Math.abs(d[i] - p[0]) <= TOL &&
          Math.abs(d[i + 1] - p[1]) <= TOL &&
          Math.abs(d[i + 2] - p[2]) <= TOL
        )
          mask[y * W + x] = 1;
      }

    // 4. Cell-vote cleanup: a cell that is ~all background infects stray
    // holdouts (antialiasing inside checker); a cell with few bg pixels
    // returns them to the subject (protects subject pixels that happened
    // to match a grey).
    const cellsX = Math.ceil((W + size) / size), cellsY = Math.ceil((H + size) / size);
    for (let cy = 0; cy < cellsY; cy++)
      for (let cx = 0; cx < cellsX; cx++) {
        const x0 = cx * size + phaseX - size, y0 = cy * size + phaseY - size;
        let bg = 0, total = 0;
        for (let y = Math.max(0, y0); y < Math.min(H, y0 + size); y++)
          for (let x = Math.max(0, x0); x < Math.min(W, x0 + size); x++) {
            total++;
            if (mask[y * W + x]) bg++;
          }
        if (!total) continue;
        const frac = bg / total;
        const set = frac > 0.92 ? 1 : frac < 0.25 ? 0 : null;
        if (set === null) continue;
        for (let y = Math.max(0, y0); y < Math.min(H, y0 + size); y++)
          for (let x = Math.max(0, x0); x < Math.min(W, x0 + size); x++)
            mask[y * W + x] = set;
      }

    // 5. Drop the Gemini sparkle watermark: small opaque components whose
    // centroid falls in the bottom-right quadrant margin.
    const comp = new Int32Array(W * H).fill(-1);
    let n = 0;
    for (let p = 0; p < W * H; p++) {
      if (mask[p] || comp[p] !== -1) continue;
      const stack = [p];
      comp[p] = n;
      let size2 = 0, sx = 0, sy = 0;
      const members = [];
      while (stack.length) {
        const s = stack.pop();
        members.push(s);
        size2++;
        sx += s % W;
        sy += (s / W) | 0;
        const x = s % W;
        for (const q of [s - 1, s + 1, s - W, s + W]) {
          if (q < 0 || q >= W * H || mask[q] || comp[q] !== -1) continue;
          if (Math.abs((q % W) - x) > 1) continue;
          comp[q] = n;
          stack.push(q);
        }
      }
      const cx = sx / size2, cy = sy / size2;
      if (size2 < 12000 && cx > W * 0.78 && cy > H * 0.7)
        for (const m of members) mask[m] = 1;
      n++;
    }

    // 6. Apply mask + soften the 1px boundary ring.
    for (let p = 0; p < W * H; p++) {
      if (mask[p]) { d[p * 4 + 3] = 0; continue; }
      const x = p % W, y = (p / W) | 0;
      const nearBg =
        (x > 0 && mask[p - 1]) || (x < W - 1 && mask[p + 1]) ||
        (y > 0 && mask[p - W]) || (y < H - 1 && mask[p + W]);
      if (nearBg) d[p * 4 + 3] = 150;
    }
    g.putImageData(im, 0, 0);

    const c2 = document.createElement("canvas");
    c2.width = 1024; c2.height = 1024;
    c2.getContext("2d").drawImage(c, 0, 0, 1024, 1024);
    return { url: c2.toDataURL("image/png"), A, B, size };
  }, b64);

  writeFileSync(path.join(OUT, file), Buffer.from(out.url.split(",")[1], "base64"));
  console.log(file, `greys ${out.A}/${out.B}, square ${out.size}px -> public/characters/${file}`);
}
await browser.close();
