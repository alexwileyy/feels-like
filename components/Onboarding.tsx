"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DEFAULT_RATINGS, SAMPLE_TEMPS, type Ratings } from "@/lib/calibration";
import CalibrationSlider from "./CalibrationSlider";
import GradientBackground from "./GradientBackground";
import { PALETTES } from "@/lib/palettes";

const QUIPS = [
  "Be honest.",
  "Classic British spring.",
  "The great office debate.",
  "Barbecue o'clock?",
  "Rare. But it happens.",
];

// step 0 = welcome, 1..5 = one card per sample temp, 6 = done
export default function Onboarding({ onDone }: { onDone: (r: Ratings) => void }) {
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState<Ratings>([...DEFAULT_RATINGS]);
  const tempIndex = step - 1;

  const card = (children: React.ReactNode, key: string) => (
    <motion.div
      key={key}
      className="glass flex w-full max-w-sm flex-col items-center gap-6 rounded-[2.5rem] px-8 py-10 text-center"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      {children}
    </motion.div>
  );

  const button =
    "rounded-full bg-neutral-900 px-8 py-3.5 font-display text-lg font-semibold text-white shadow-xl transition-transform active:scale-95";

  return (
    <main className="grid min-h-dvh place-items-center px-6 text-neutral-800">
      <GradientBackground palette={PALETTES.mild.day} />
      <AnimatePresence mode="wait">
        {step === 0 &&
          card(
            <>
              <span className="text-5xl">👋</span>
              <h1 className="font-display text-4xl font-bold">Hi, Josie</h1>
              <p className="text-base font-semibold leading-relaxed opacity-80">
                I&apos;m <span className="font-display">Feels</span> - a weather app that
                cares how it feels, not what the thermometer says. First, let&apos;s tune
                me to <em>your</em> thermostat. Five temperatures, no wrong answers.
              </p>
              <button className={button} onClick={() => setStep(1)}>
                Let&apos;s do it
              </button>
              <button
                className="text-sm font-bold underline opacity-50"
                onClick={() => onDone([...DEFAULT_RATINGS])}
              >
                Skip - I&apos;m thermally average
              </button>
            </>,
            "welcome"
          )}

        {tempIndex >= 0 &&
          tempIndex < SAMPLE_TEMPS.length &&
          card(
            <>
              <p className="text-sm font-bold uppercase tracking-widest opacity-50">
                {tempIndex + 1} of {SAMPLE_TEMPS.length} · {QUIPS[tempIndex]}
              </p>
              <p className="font-display text-8xl font-bold">
                {SAMPLE_TEMPS[tempIndex]}°
              </p>
              <p className="text-base font-semibold opacity-70">
                How does {SAMPLE_TEMPS[tempIndex]}° actually feel to you?
              </p>
              <CalibrationSlider
                value={ratings[tempIndex]}
                onChange={(v) =>
                  setRatings((r) => r.map((x, i) => (i === tempIndex ? v : x)))
                }
              />
              <button className={button} onClick={() => setStep(step + 1)}>
                {tempIndex === SAMPLE_TEMPS.length - 1 ? "Finish" : "Next"}
              </button>
            </>,
            `temp-${tempIndex}`
          )}

        {step === SAMPLE_TEMPS.length + 1 &&
          card(
            <>
              <span className="text-5xl">✨</span>
              <h1 className="font-display text-3xl font-bold">
                Perfectly calibrated
              </h1>
              <p className="text-base font-semibold opacity-80">
                From now on, the forecast speaks fluent Josie.
              </p>
              <button className={button} onClick={() => onDone(ratings)}>
                Show me today
              </button>
            </>,
            "done"
          )}
      </AnimatePresence>
    </main>
  );
}
