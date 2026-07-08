"use client";

import { motion } from "motion/react";
import type { FeelingWord } from "@/lib/calibration";
import { annotateHours, glyphFor, outfitFor } from "@/lib/conditions";
import type { SummaryInput } from "@/lib/summary";
import JosieReport from "./JosieReport";

export interface RailHour {
  label: string;
  word: FeelingWord;
  isRaining: boolean;
  feelsLike: number;
}

export default function DayList({
  hours,
  report,
}: {
  hours: RailHour[];
  report: SummaryInput;
}) {
  if (hours.length === 0) return null;
  const notes = annotateHours(hours);

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col px-6 pt-8">
      <JosieReport input={report} />
      <ul className="min-h-0 flex-1 overflow-y-auto pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hours.map((h, i) => (
          <motion.li
            key={h.label}
            className="flex items-center gap-4 border-b border-neutral-100 py-3.5"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: Math.min(i * 0.03, 0.3), type: "spring", stiffness: 300, damping: 26 }}
          >
            <span className="w-12 text-sm font-semibold text-neutral-400">{h.label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/glyphs/${glyphFor(h.word, h.isRaining)}.png`}
              alt=""
              className="h-9 w-9 drop-shadow-sm"
            />
            <span className="flex-1">
              <span className="block text-base font-semibold">
                {outfitFor(h.word, h.isRaining)}
              </span>
              {notes[i] && (
                <span className="block pt-0.5 text-xs font-semibold text-accent">
                  {notes[i]}
                </span>
              )}
            </span>
            <span className="text-base font-semibold text-neutral-500">
              {Math.round(h.feelsLike)}°
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
