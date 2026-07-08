"use client";

import { motion, useReducedMotion } from "motion/react";

// Waveform-style temperature slider: a row of bars tinted cold-to-hot; the
// bars nearest the selection swell into a taller cluster. A transparent
// native range input on top drives the value, so dragging, tapping,
// keyboard arrows, and screen readers all work for free.
const N = 33;
const STOPS = [
  [127, 184, 240], // icy blue
  [168, 216, 200], // cool green
  [255, 217, 138], // warm amber
  [255, 157, 107], // hot orange
  [255, 107, 107], // boiling red
];

function colorAt(t: number): string {
  const seg = t * (STOPS.length - 1);
  const i = Math.min(Math.floor(seg), STOPS.length - 2);
  const f = seg - i;
  const [r, g, b] = STOPS[i].map((c, ch) => Math.round(c + (STOPS[i + 1][ch] - c) * f));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function CalibrationSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const pos = (value / 100) * (N - 1);

  return (
    <div className="w-full">
      <div className="relative h-20 w-full touch-none">
        <div className="flex h-full items-center justify-between px-1">
          {Array.from({ length: N }, (_, i) => {
            const d = Math.abs(i - pos);
            const bump = Math.exp(-(d * d) / 9);
            const height = 12 + bump * 52;
            return (
              <motion.span
                key={i}
                className="w-1 rounded-full"
                style={{ backgroundColor: colorAt(i / (N - 1)) }}
                animate={{ height, opacity: 0.3 + bump * 0.7 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 600, damping: 32 }
                }
              />
            );
          })}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="How does this temperature feel to you?"
          className="thermo absolute inset-0 h-full w-full cursor-grab opacity-0 active:cursor-grabbing"
        />
      </div>
      <div className="mt-1 flex justify-between text-xs font-semibold text-neutral-400">
        <span>Freezing</span>
        <span>Boiling</span>
      </div>
    </div>
  );
}
