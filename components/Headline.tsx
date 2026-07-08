"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FeelingWord } from "@/lib/calibration";

// Idle "living letters" behaviour per condition. Amplitudes are deliberately
// small - the word should feel the weather, not steal the scene.
export type WordMotion = "heat" | "shiver" | "drip" | "gust" | "calm";

import type { TargetAndTransition } from "motion/react";

const IDLE: Record<WordMotion, (i: number) => TargetAndTransition> = {
  heat: (i) => ({
    y: [0, -4, 0, 2, 0],
    transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 + i * 0.18 },
  }),
  shiver: (i) => ({
    x: [0, -1.5, 1.5, -1, 1, 0],
    transition: { duration: 0.4, repeat: Infinity, repeatDelay: 1.4, delay: 1 + i * 0.05 },
  }),
  drip: (i) => ({
    y: [0, 5, 0],
    transition: { duration: 2.2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut", delay: 1 + i * 0.3 },
  }),
  gust: (i) => ({
    skewX: [0, -8, 4, 0],
    x: [0, 3, -1, 0],
    transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut", delay: 1 + i * 0.07 },
  }),
  calm: (i) => ({
    y: [0, -1.5, 0],
    transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 + i * 0.3 },
  }),
};

// Each feeling word wears its own condition hue.
const WORD_COLORS: Record<FeelingWord, string> = {
  FREEZING: "#4a7fd4",
  COLD: "#6a9bd8",
  MILD: "#55a057",
  WARM: "#e8913a",
  HOT: "#e0512b",
};

export default function Headline({
  word,
  feelsLike,
  wordMotion,
}: {
  word: FeelingWord;
  feelsLike: number;
  wordMotion: WordMotion;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="popLayout">
        <motion.h2
          key={`${word}-${wordMotion}`}
          className={`font-bold leading-none tracking-tight ${
            word.length > 5 ? "text-[min(3.75rem,7dvh)]" : "text-[min(4.5rem,8.5dvh)]"
          }`}
          style={{ color: WORD_COLORS[word] }}
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
              <motion.span
                className="inline-block"
                animate={reduceMotion ? undefined : IDLE[wordMotion](i)}
              >
                {letter}
              </motion.span>
            </motion.span>
          ))}
        </motion.h2>
      </AnimatePresence>

      <p className="text-xl font-semibold text-neutral-500">
        feels like {Math.round(feelsLike)}°
      </p>
    </div>
  );
}
