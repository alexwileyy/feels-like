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

export default function HourlyRail({ hours }: { hours: RailHour[] }) {
  if (hours.length === 0) return null;

  return (
    <section className="w-full pb-10">
      <h3 className="mb-3 px-6 font-display text-lg font-semibold opacity-80">
        The rest of your day
      </h3>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hours.map((h, i) => (
          <motion.div
            key={h.label}
            className="glass flex min-w-[4.5rem] snap-start flex-col items-center gap-1.5 rounded-3xl px-3 py-4"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.4), type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="text-xs font-bold opacity-60">{h.label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/glyphs/${glyphFor(h.word, h.isRaining)}.png`}
              alt={glyphFor(h.word, h.isRaining)}
              className="h-9 w-9 drop-shadow"
            />
            <span className="font-display text-sm font-semibold">
              {Math.round(h.feelsLike)}°
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
