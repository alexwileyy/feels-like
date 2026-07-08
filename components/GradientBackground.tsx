"use client";

import { motion } from "motion/react";
import type { TimeOfDay } from "@/lib/conditions";
import type { Palette } from "@/lib/palettes";

// White (or, at night, deep dark) canvas with three soft radial washes that
// wander slowly (CSS keyframes) and cross-fade colour when the palette
// changes. Time of day acts as lighting: washed-out at dawn, fully vivid in
// the day, softened at dusk, glowing embers on dark at night.
const wash = (color: string) =>
  `radial-gradient(closest-side, ${color} 0%, rgba(255,255,255,0) 72%)`;
const washNight = (color: string) =>
  `radial-gradient(closest-side, ${color} 0%, rgba(0,0,0,0) 72%)`;

const TOD_OPACITY: Record<TimeOfDay, number> = {
  dawn: 0.5,
  day: 0.8,
  dusk: 0.6,
  night: 0.6,
};

const BLOBS = [
  { cls: "blob-a", size: "95vmax", pos: { top: "-30%", left: "-25%" } },
  { cls: "blob-b", size: "80vmax", pos: { bottom: "-28%", right: "-30%" } },
  { cls: "blob-c", size: "70vmax", pos: { top: "28%", left: "18%" } },
] as const;

export default function GradientBackground({
  palette,
  tod = "day",
}: {
  palette: Palette;
  tod?: TimeOfDay;
}) {
  const night = tod === "night";

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden"
      animate={{ backgroundColor: night ? "#12151d" : "#ffffff" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={b.cls}
          className={`blob ${b.cls}`}
          style={{ width: b.size, height: b.size, ...b.pos }}
          animate={{
            background: night ? washNight(palette.blobs[i]) : wash(palette.blobs[i]),
            opacity: TOD_OPACITY[tod],
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}
