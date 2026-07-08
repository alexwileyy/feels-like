"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Scene, TimeOfDay } from "@/lib/conditions";

export interface Overrides {
  scene: Scene | null;
  windy: boolean;
  tod: TimeOfDay | null;
}

const SCENES: { scene: Scene; glyph: string; label: string }[] = [
  { scene: "hot", glyph: "sun", label: "Hot" },
  { scene: "mild", glyph: "suncloud", label: "Mild" },
  { scene: "rain", glyph: "rain", label: "Rain" },
  { scene: "cold", glyph: "leaf", label: "Cold" },
  { scene: "freezing", glyph: "snowflake", label: "Freezing" },
];

const TODS: TimeOfDay[] = ["dawn", "day", "dusk", "night"];

// Hidden presenter controls, toggled with the "d" key. Lets us walk the room
// through every weather state regardless of what the sky is actually doing.
export default function DemoPanel({
  open,
  overrides,
  onChange,
}: {
  open: boolean;
  overrides: Overrides;
  onChange: (o: Overrides) => void;
}) {
  const chip = (active: boolean) =>
    `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-transform active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 ${
      active ? "bg-neutral-900 text-white shadow-lg" : "bg-black/5 text-neutral-800"
    }`;

  const icon = (name: string) => (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={`/glyphs/${name}.png`} alt="" className="h-4.5 w-4.5" />
  );

  const cycleTod = () => {
    const next = overrides.tod === null ? 0 : (TODS.indexOf(overrides.tod) + 1) % TODS.length;
    onChange({ ...overrides, tod: TODS[next] });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-3 bottom-3 z-50"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <div
            className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-black/5 p-3"
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 12px 40px rgb(0 0 0 / 0.15)",
            }}
          >
            {SCENES.map(({ scene, glyph, label }) => (
              <button
                key={scene}
                className={chip(overrides.scene === scene)}
                onClick={() => onChange({ ...overrides, scene })}
              >
                {icon(glyph)} {label}
              </button>
            ))}
            <button
              className={chip(overrides.windy)}
              onClick={() => onChange({ ...overrides, windy: !overrides.windy })}
            >
              {icon("wind")} Wind
            </button>
            <button className={chip(overrides.tod !== null)} onClick={cycleTod}>
              {icon("moon")} {overrides.tod ?? "time"}
            </button>
            <button
              className={chip(false)}
              onClick={() => onChange({ scene: null, windy: false, tod: null })}
            >
              {icon("antenna")} Live
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
