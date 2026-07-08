"use client";

export default function CalibrationSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="w-full">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="thermo"
        aria-label="How does this temperature feel to you?"
      />
      <div className="mt-2 flex justify-between text-xs font-semibold text-neutral-400">
        <span>Freezing</span>
        <span>Boiling</span>
      </div>
    </div>
  );
}
