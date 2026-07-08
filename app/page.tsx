"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { DEFAULT_RATINGS, wordForTemp, type Ratings } from "@/lib/calibration";
import { isRainy, recommendationFor, sceneFor, timeOfDay, type Scene } from "@/lib/conditions";
import { PALETTES } from "@/lib/palettes";
import { fetchWeather, type Weather } from "@/lib/weather";
import Character from "@/components/Character";
import DayList, { type RailHour } from "@/components/DayList";
import DemoPanel, { type Overrides } from "@/components/DemoPanel";
import GradientBackground from "@/components/GradientBackground";
import Greeting from "@/components/Greeting";
import Headline, { type WordMotion } from "@/components/Headline";
import Onboarding from "@/components/Onboarding";
import SupportCard from "@/components/SupportCard";

const RATINGS_KEY = "feels.ratings";

// Representative feels-like temp for each forced demo scene, and how far the
// "lying thermometer" reads from it.
const SCENE_TEMPS: Record<Scene, { feels: number; actualDelta: number }> = {
  hot: { feels: 29, actualDelta: -3 },
  mild: { feels: 17, actualDelta: 2 },
  rain: { feels: 14, actualDelta: 2 },
  cold: { feels: 11, actualDelta: 3 },
  freezing: { feels: 1, actualDelta: 4 },
};

const stagger = {
  hidden: {},
  // delayChildren lets the greeting finish its exit before content arrives
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
};
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 24 },
  },
};

export default function Page() {
  const [ready, setReady] = useState(false);
  const [ratings, setRatings] = useState<Ratings | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [ov, setOv] = useState<Overrides>({ scene: null, windy: false, tod: null });

  useEffect(() => {
    const stored = localStorage.getItem(RATINGS_KEY);
    if (stored) setRatings(JSON.parse(stored));
    setReady(true);
    fetchWeather().then(setWeather);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "d" && !(e.target instanceof HTMLInputElement)) {
        setDemoOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onboarded = ratings !== null;

  useEffect(() => {
    if (!ready || !onboarded) return;
    const t = setTimeout(() => setIntroDone(true), 2300);
    return () => clearTimeout(t);
  }, [ready, onboarded]);

  const view = useMemo(() => {
    if (!weather) return null;
    const now = new Date();
    const r = ratings ?? DEFAULT_RATINGS;

    let feelsLike = weather.feelsLike;
    let actual = weather.actual;
    let isRaining = weather.isRaining || isRainy(weather.weatherCode);
    let windKmh = weather.windKmh;
    if (ov.scene) {
      feelsLike = SCENE_TEMPS[ov.scene].feels;
      actual = feelsLike + SCENE_TEMPS[ov.scene].actualDelta;
      isRaining = ov.scene === "rain";
    }
    if (ov.windy) windKmh = 38;

    const word = wordForTemp(feelsLike, r);
    const scene = ov.scene ?? sceneFor(word, isRaining);
    const tod = ov.tod ?? timeOfDay(now, weather.sunrise, weather.sunset);

    let rail: RailHour[];
    if (ov.scene) {
      // Forced scene: synthesise a coherent day so the list matches the story
      // - rain (if any) falls through the afternoon then clears, temps drift
      // gently rather than flapping across band boundaries.
      rail = Array.from({ length: 10 }, (_, i) => {
        const h = (now.getHours() + i + 1) % 24;
        const t = feelsLike + Math.floor(i / 4);
        return {
          label: `${h}:00`,
          word: wordForTemp(t, r),
          isRaining: isRaining && i < 6,
          feelsLike: t,
        };
      });
    } else {
      rail = weather.hourly
        .filter((h) => h.time.getTime() >= now.getTime())
        .slice(0, 12)
        .map((h) => ({
          label: `${h.time.getHours()}:00`,
          word: wordForTemp(h.feelsLike, r),
          isRaining: isRainy(h.weatherCode) || h.precipProb >= 50,
          feelsLike: h.feelsLike,
        }));
    }

    const wordMotion: WordMotion =
      windKmh >= 30
        ? "gust"
        : scene === "rain"
          ? "drip"
          : scene === "freezing"
            ? "shiver"
            : scene === "hot"
              ? "heat"
              : "calm";

    const rainPct = ov.scene
      ? ov.scene === "rain"
        ? 85
        : 5
      : (weather.hourly.find((h) => h.time.getTime() >= now.getTime())?.precipProb ?? 0);

    return {
      word,
      scene,
      palette: PALETTES[scene][tod],
      rec: recommendationFor({ word, isRaining, windKmh }),
      feelsLike,
      wordMotion,
      stats: { actual, windKmh, rainPct },
      rail,
    };
  }, [weather, ratings, ov]);

  if (!ready) return null;

  if (!onboarded) {
    return (
      <Onboarding
        onDone={(r) => {
          localStorage.setItem(RATINGS_KEY, JSON.stringify(r));
          setRatings(r);
        }}
      />
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <main>
      <GradientBackground palette={view?.palette ?? PALETTES.mild.day} />
      <Greeting text={`${greeting}, Josie`} done={introDone} />

      {introDone && view && (
        <>
          <section className="relative mx-auto flex h-dvh max-w-md flex-col px-6">
            {weather && !weather.live && (
              <span className="absolute right-6 top-8 rounded-full bg-neutral-900/5 px-3 py-1 text-xs font-semibold text-neutral-500">
                demo data
              </span>
            )}

            <motion.div
              className="flex flex-1 flex-col items-center justify-center gap-5 pb-8"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={rise} className="w-full">
                <Character scene={view.scene} />
              </motion.div>
              <motion.div variants={rise}>
                <Headline
                  word={view.word}
                  feelsLike={view.feelsLike}
                  wordMotion={view.wordMotion}
                />
              </motion.div>
              <motion.div variants={rise} className="w-full">
                <SupportCard text={view.rec} stats={view.stats} />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-neutral-300"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              aria-hidden
            >
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path
                  d="M1 1l9 8 9-8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </section>

          <DayList
            hours={view.rail}
            report={{
              word: view.word,
              feelsLike: view.feelsLike,
              windKmh: view.stats.windKmh,
              rainPct: view.stats.rainPct,
              hours: view.rail,
            }}
          />
        </>
      )}

      <DemoPanel open={demoOpen} overrides={ov} onChange={setOv} />
    </main>
  );
}
