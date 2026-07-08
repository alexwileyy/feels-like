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

// step 0 = welcome, 1 = name, 2..6 = one per sample temp, 7 = done
const NAME_STEP = 1;
const FIRST_TEMP_STEP = 2;

export default function Onboarding({
  onDone,
}: {
  onDone: (ratings: Ratings, name: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [ratings, setRatings] = useState<Ratings>([...DEFAULT_RATINGS]);

  // Preload every band character so slider swaps never flash.
  useEffect(() => {
    [...BANDS.map((b) => b.image), "celebration"].forEach((img) => {
      const el = new Image();
      el.src = `/characters/${img}.png`;
    });
  }, []);

  const tempIndex = step - FIRST_TEMP_STEP;
  const totalSteps = SAMPLE_TEMPS.length + 2; // name + temps + finish beat
  const cleanName = name.trim();

  const primaryButton =
    "w-full rounded-full bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/30 transition-transform active:scale-95 disabled:opacity-30";

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
              <h1 className="text-5xl font-bold tracking-tight">Hey there</h1>
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
                onClick={() => onDone([...DEFAULT_RATINGS], "")}
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        )}

        {step === NAME_STEP && (
          <motion.div key="name" className="flex flex-1 flex-col" {...swap}>
            <div className="pt-14 text-center">
              <h1 className="text-4xl font-bold tracking-tight">
                What should we <span className="text-accent">call you</span>?
              </h1>
              <p className="mt-2 text-sm font-medium text-neutral-400">
                Your forecast, your name on it.
              </p>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && cleanName) setStep(FIRST_TEMP_STEP);
                }}
                placeholder="Your name"
                autoFocus
                autoComplete="given-name"
                maxLength={24}
                aria-label="Your name"
                className="w-full rounded-2xl border border-black/5 bg-white px-6 py-5 text-center text-3xl font-bold tracking-tight shadow-[0_8px_30px_rgb(0_0_0/0.08)] outline-none transition placeholder:text-neutral-300 focus:border-accent focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div className="pb-10">
              <button
                className={primaryButton}
                disabled={!cleanName}
                onClick={() => setStep(FIRST_TEMP_STEP)}
              >
                Next
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

        {step === FIRST_TEMP_STEP + SAMPLE_TEMPS.length && (
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
                The forecast now speaks fluent {cleanName || "you"}.
              </p>
            </div>
            <div className="pb-10">
              <button className={primaryButton} onClick={() => onDone(ratings, cleanName)}>
                See today&apos;s forecast
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
