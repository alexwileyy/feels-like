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

// Dashboard tile - the reusable pattern for the grid below the breakdown:
// eyebrow (glyph + caption) over a big value, on glass.
function Tile({ glyph, label, value }: { glyph: string; label: string; value: string }) {
  return (
    <div className="glass rounded-3xl p-4">
      <div className="flex items-center gap-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/glyphs/${glyph}.png`} alt="" className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wide text-neutral-400">
          {label}
        </span>
      </div>
      <p className="pt-1.5 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

export default function DayList({
  hours,
  report,
  sun,
}: {
  hours: RailHour[];
  report: SummaryInput;
  sun: { rise: string; set: string };
}) {
  if (hours.length === 0) return null;
  const notes = annotateHours(hours);

  return (
    <div className="mx-auto w-full max-w-md px-6 pb-10 pt-8">
      <JosieReport input={report} />

      <div className="glass rounded-3xl px-5">
        <ul className="divide-y divide-neutral-100">
          {hours.map((h, i) => (
            <motion.li
              key={h.label}
              className="flex items-center gap-3 py-3.5"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: Math.min(i * 0.03, 0.3), type: "spring", stiffness: 300, damping: 26 }}
            >
              <span className="w-11 text-sm font-semibold text-neutral-400">{h.label}</span>
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

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Tile glyph="sunrise" label="Sunrise" value={sun.rise} />
        <Tile glyph="sunset" label="Sunset" value={sun.set} />
      </div>
    </div>
  );
}
