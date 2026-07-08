"use client";

import type { Palette } from "@/lib/palettes";

// Three huge blurred blobs drifting over a sky colour. Colours cross-fade via
// CSS transitions when the palette changes; drift comes from globals.css.
export default function GradientBackground({ palette }: { palette: Palette }) {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: palette.sky }}
    >
      <div
        className="blob blob-a"
        style={{
          backgroundColor: palette.blobs[0],
          width: "75vmax",
          height: "75vmax",
          top: "-25%",
          left: "-20%",
        }}
      />
      <div
        className="blob blob-b"
        style={{
          backgroundColor: palette.blobs[1],
          width: "65vmax",
          height: "65vmax",
          bottom: "-20%",
          right: "-25%",
        }}
      />
      <div
        className="blob blob-c"
        style={{
          backgroundColor: palette.blobs[2],
          width: "55vmax",
          height: "55vmax",
          top: "30%",
          left: "25%",
        }}
      />
    </div>
  );
}
