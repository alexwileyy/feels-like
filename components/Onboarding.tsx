"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DEFAULT_RATINGS, SAMPLE_TEMPS, type Ratings } from "@/lib/calibration";
import CalibrationSlider from "./CalibrationSlider";
import GradientBackground from "./GradientBackground";
import { PALETTES } from "@/lib/palettes";

// How the slider value maps to a felt band: label + the character who's
// dressed (or melting) for it.
const BANDS = [
  { below: 20, label: "Freezing", image: "freezing" },
  { below: 40, label: "Chilly", image: "cold" },
  { below: 60, label: "Just right", image: "mild" },
  { below: 80, label: "Toasty", image: "hot" },
  { below: 101, label: "Boiling", image: "boiling" },
];

const QUIPS = [
  "Be honest.",
  "Classic British spring.",
  "The great office debate.",
  "Barbecue o'clock?",
  "Rare. But it happens.",
];

const swap = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -18 },
  transition: { type: "spring" as const, stiffness: 300, damping: 28 },
};

// step 0 = welcome, 1..5 = one per sample temp, 6 = done
export default function Onboarding({ onDone }: { onDone: (r: Ratings) => void }) {
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState<Ratings>([...DEFAULT_RATINGS]);

  // Preload every band character so slider swaps never flash.
  useEffect(() => {
    [...BANDS.map((b) => b.image), "celebration"].forEach((name) => {
      const img = new Image();
      img.src = `/characters/${name}.png`;
    });
  }, []);
  const tempIndex = step - 1;
  const totalSteps = SAMPLE_TEMPS.length + 1; // welcome counts toward the beam

  const primaryButton =
    "w-full rounded-full bg-neutral-900 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-transform active:scale-95";

  const band = tempIndex >= 0 ? BANDS.find((b) => ratings[tempIndex] < b.below)! : null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-8">
      <GradientBackground palette={PALETTES.mild.day} />

      {/* progress beam */}
      <div className="fixed inset-x-0 top-0 z-20 h-1.5 bg-neutral-900/5">
        <motion.div
          className="h-full rounded-r-full bg-accent"
          animate={{ width: `${(Math.min(step, totalSteps) / totalSteps) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="welcome" className="flex flex-1 flex-col" {...swap}>
            <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/glyphs/wave.png" alt="" className="h-20 w-20 drop-shadow" />
              <h1 className="text-5xl font-bold tracking-tight">Hey Josie</h1>
              <p className="max-w-xs text-lg font-medium leading-relaxed text-neutral-500">
                Let&apos;s get to know you, and how the weather actually feels to you.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 pb-10">
              <button className={primaryButton} onClick={() => setStep(1)}>
                Let&apos;s do it
              </button>
              <button
                className="text-sm font-semibold text-neutral-400 underline"
                onClick={() => onDone([...DEFAULT_RATINGS])}
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        )}

        {tempIndex >= 0 && tempIndex < SAMPLE_TEMPS.length && (
          <motion.div key={`temp-${tempIndex}`} className="flex flex-1 flex-col" {...swap}>
            <div className="pt-14 text-center">
              <h1 className="text-4xl font-bold tracking-tight">
                How does{" "}
                <span className="font-bold text-accent">{SAMPLE_TEMPS[tempIndex]}°</span>{" "}
                feel to you?
              </h1>
              <p className="mt-2 text-sm font-medium text-neutral-400">{QUIPS[tempIndex]}</p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1">
              <div className="relative aspect-square w-full max-w-[340px]">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={band!.image}
                    src={`/characters/${band!.image}.png`}
                    alt={band!.label}
                    className="absolute inset-0 h-full w-full object-contain drop-shadow-xl"
                    initial={{ scale: 0.75, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.85, opacity: 0, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  />
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={band!.label}
                  className="text-xl font-semibold"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {band!.label}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-6 pb-10">
              <CalibrationSlider
                value={ratings[tempIndex]}
                onChange={(v) =>
                  setRatings((r) => r.map((x, i) => (i === tempIndex ? v : x)))
                }
              />
              <button className={primaryButton} onClick={() => setStep(step + 1)}>
                {tempIndex === SAMPLE_TEMPS.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </motion.div>
        )}

        {step === SAMPLE_TEMPS.length + 1 && (
          <motion.div key="done" className="flex flex-1 flex-col" {...swap}>
            <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/characters/celebration.png"
                alt=""
                className="aspect-square w-full max-w-[340px] object-contain drop-shadow-xl"
                onError={(e) => ((e.target as HTMLImageElement).src = "/characters/mild.png")}
              />
              <h1 className="text-4xl font-bold tracking-tight">You&apos;re all set</h1>
              <p className="max-w-xs text-lg font-medium text-neutral-500">
                The forecast now speaks fluent Josie.
              </p>
            </div>
            <div className="pb-10">
              <button className={primaryButton} onClick={() => onDone(ratings)}>
                Show me what to wear today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
