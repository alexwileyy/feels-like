"use client";

const STOPS: { below: number; label: string; emoji: string }[] = [
  { below: 20, label: "Freezing", emoji: "🥶" },
  { below: 40, label: "Chilly", emoji: "🧣" },
  { below: 60, label: "Just right", emoji: "🙂" },
  { below: 80, label: "Toasty", emoji: "🥵" },
  { below: 101, label: "Boiling", emoji: "🔥" },
];

export default function CalibrationSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const stop = STOPS.find((s) => value < s.below)!;

  return (
    <div className="w-full">
      <p className="mb-4 text-center font-display text-2xl font-semibold">
        {stop.emoji} {stop.label}
      </p>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="thermo"
        aria-label="How does this temperature feel to you?"
      />
      <div className="mt-2 flex justify-between text-xs font-bold opacity-60">
        <span>Freezing</span>
        <span>Boiling</span>
      </div>
    </div>
  );
}
