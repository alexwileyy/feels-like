"use client";

import { AnimatePresence, motion } from "motion/react";
import type { FeelingWord } from "@/lib/calibration";

export default function Headline({
  word,
  feelsLike,
  actual,
}: {
  word: FeelingWord;
  feelsLike: number;
  actual: number;
}) {
  const showActual = Math.abs(Math.round(actual) - Math.round(feelsLike)) >= 1;

  return (
    <div className="flex flex-col items-center gap-3">
      <AnimatePresence mode="popLayout">
        <motion.h2
          key={word}
          className={`font-bold tracking-tight ${word.length > 5 ? "text-6xl" : "text-7xl"}`}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -14, transition: { duration: 0.18 } }}
        >
          {word.split("").map((letter, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 26, scale: 0.5 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    delay: i * 0.05,
                    type: "spring",
                    stiffness: 420,
                    damping: 22,
                  },
                },
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h2>
      </AnimatePresence>

      <div className="rounded-full bg-neutral-900/[0.06] px-5 py-2 text-lg font-semibold">
        feels like {Math.round(feelsLike)}°
      </div>
      {showActual && (
        <p className="text-sm font-medium text-neutral-400">
          the thermometer claims {Math.round(actual)}°
        </p>
      )}
    </div>
  );
}
