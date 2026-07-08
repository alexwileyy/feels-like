"use client";

import { AnimatePresence, motion } from "motion/react";

export interface Stats {
  actual: number;
  windKmh: number;
  rainPct: number;
}

const STAT_META = [
  { key: "actual", glyph: "thermometer", label: "actual" },
  { key: "wind", glyph: "wind", label: "wind" },
  { key: "rain", glyph: "rain", label: "rain" },
] as const;

export default function SupportCard({ text, stats }: { text: string; stats: Stats }) {
  const values: Record<(typeof STAT_META)[number]["key"], string> = {
    actual: `${Math.round(stats.actual)}°`,
    wind: `${Math.round(stats.windKmh)} km/h`,
    rain: `${Math.round(stats.rainPct)}%`,
  };

  return (
    <div className="glass w-full rounded-3xl px-6 py-4">
      <div className="relative flex min-h-12 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={text}
            className="text-center text-base font-semibold leading-snug text-neutral-700"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-around border-t border-neutral-900/5 pt-3">
        {STAT_META.map(({ key, glyph, label }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/glyphs/${glyph}.png`} alt="" className="h-7 w-7 drop-shadow-sm" />
            <span className="text-sm font-bold">{values[key]}</span>
            <span className="text-xs font-semibold text-neutral-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
