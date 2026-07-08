"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

// Waveform-style temperature slider: a row of bars tinted cold-to-hot; the
// bars nearest the selection swell taller and more vivid, peaking at the
// centre of the cluster. The whole box is draggable (pointer capture), and
// a visually-hidden native range input keeps keyboard + screen readers.
const N = 33;

// Resting pastel tints and the vivid versions the cluster blends toward.
const MUTED = [
  [127, 184, 240],
  [168, 216, 200],
  [255, 217, 138],
  [255, 157, 107],
  [255, 107, 107],
];
const VIVID = [
  [37, 122, 235],
  [46, 178, 126],
  [255, 172, 27],
  [255, 110, 32],
  [240, 45, 45],
];

function paletteAt(stops: number[][], t: number): number[] {
  const seg = t * (stops.length - 1);
  const i = Math.min(Math.floor(seg), stops.length - 2);
  const f = seg - i;
  return stops[i].map((c, ch) => c + (stops[i + 1][ch] - c) * f);
}

function barColor(t: number, vividness: number): string {
  const muted = paletteAt(MUTED, t);
  const vivid = paletteAt(VIVID, t);
  const [r, g, b] = muted.map((c, ch) => Math.round(c + (vivid[ch] - c) * vividness));
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
  const trackRef = useRef<HTMLDivElement>(null);
  const pos = (value / 100) * (N - 1);

  const setFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onChange(Math.round(t * 100));
  };

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="relative h-20 w-full cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons > 0) setFromClientX(e.clientX);
        }}
      >
        <div className="flex h-full items-center justify-between px-1">
          {Array.from({ length: N }, (_, i) => {
            const d = Math.abs(i - pos);
            const bump = Math.exp(-(d * d) / 9);
            const height = 12 + bump * 52;
            return (
              <motion.span
                key={i}
                className="w-1 rounded-full"
                animate={{
                  height,
                  opacity: 0.35 + bump * 0.65,
                  backgroundColor: barColor(i / (N - 1), bump),
                }}
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
          className="thermo pointer-events-none absolute inset-0 h-full w-full opacity-0"
        />
      </div>
      <div className="mt-1 flex justify-between text-xs font-semibold text-neutral-400">
        <span>Freezing</span>
        <span>Boiling</span>
      </div>
    </div>
  );
}
