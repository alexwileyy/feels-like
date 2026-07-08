"use client";

import { motion } from "motion/react";
import type { FeelingWord } from "@/lib/calibration";
import { glyphFor } from "@/lib/conditions";

export interface RailHour {
  label: string;
  word: FeelingWord;
  isRaining: boolean;
  feelsLike: number;
}

const OUTFIT: Record<FeelingWord, string> = {
  FREEZING: "Big coat",
  COLD: "Coat on",
  MILD: "Jumper",
  WARM: "T-shirt",
  HOT: "Shorts",
};

export default function DayList({ hours }: { hours: RailHour[] }) {
  if (hours.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-md px-6 pb-16">
      <h3 className="pb-2 pt-4 text-lg font-semibold text-neutral-400">
        The rest of your day
      </h3>
      <ul>
        {hours.map((h, i) => (
          <motion.li
            key={h.label}
            className="flex items-center gap-4 border-b border-neutral-100 py-3"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: Math.min(i * 0.03, 0.3), type: "spring", stiffness: 300, damping: 26 }}
          >
            <span className="w-14 text-sm font-semibold text-neutral-400">{h.label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/glyphs/${glyphFor(h.word, h.isRaining)}.png`}
              alt=""
              className="h-9 w-9 drop-shadow-sm"
            />
            <span className="flex-1 text-base font-semibold">
              {h.isRaining ? "Umbrella up" : OUTFIT[h.word]}
            </span>
            <span className="text-base font-semibold text-neutral-500">
              {Math.round(h.feelsLike)}°
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
