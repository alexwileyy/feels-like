"use client";

import { motion } from "motion/react";
import type { Palette } from "@/lib/palettes";

// White canvas with three soft radial washes that drift slowly (CSS
// keyframes) and cross-fade colour when the palette changes (motion
// interpolates the matching gradient strings).
const wash = (color: string) =>
  `radial-gradient(closest-side, ${color} 0%, rgba(255,255,255,0) 72%)`;

const BLOBS = [
  { cls: "blob-a", size: "95vmax", pos: { top: "-30%", left: "-25%" } },
  { cls: "blob-b", size: "80vmax", pos: { bottom: "-28%", right: "-30%" } },
  { cls: "blob-c", size: "70vmax", pos: { top: "28%", left: "18%" } },
] as const;

export default function GradientBackground({ palette }: { palette: Palette }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {BLOBS.map((b, i) => (
        <motion.div
          key={b.cls}
          className={`blob ${b.cls}`}
          style={{ width: b.size, height: b.size, opacity: 0.55, ...b.pos }}
          animate={{ background: wash(palette.blobs[i]) }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
