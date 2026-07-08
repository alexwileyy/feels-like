import type { FeelingWord } from "./calibration";

// Everything Josie's weather report needs, template or LLM alike.
export interface SummaryInput {
  word: FeelingWord;
  feelsLike: number;
  windKmh: number;
  rainPct: number;
  hours: { label: string; word: FeelingWord; isRaining: boolean; feelsLike: number }[];
}

const OPENERS: Record<FeelingWord, string> = {
  FREEZING: "It's properly bitter out there, Josie",
  COLD: "Bit nippy today, Josie",
  MILD: "A lovely mild one today, Josie",
  WARM: "Warming up nicely today, Josie",
  HOT: "It's a scorcher, Josie",
};

// Deterministic summary composed from the day's data. Shown instantly, and
// stands in whenever the AI report is loading or unavailable.
export function templateSummary(s: SummaryInput): string {
  const parts: string[] = [`${OPENERS[s.word]} - feels like ${Math.round(s.feelsLike)}°.`];

  const firstRain = s.hours.find((h) => h.isRaining);
  const temps = s.hours.map((h) => h.feelsLike);
  const trend =
    temps.length > 1 ? temps[temps.length - 1] - temps[0] : 0;

  if (firstRain && s.windKmh >= 30) {
    parts.push(`Rain around ${firstRain.label} with real wind, so hood up and forget the brolly.`);
  } else if (firstRain) {
    parts.push(`Keep the brolly handy, rain shows up around ${firstRain.label}.`);
  } else if (s.rainPct >= 40) {
    parts.push(`There's a ${Math.round(s.rainPct)}% chance of rain, so maybe pack the brolly.`);
  } else if (trend <= -3) {
    parts.push("It turns cooler later, so take a layer for the way home.");
  } else if (trend >= 3) {
    parts.push("It only gets warmer from here, dress for the afternoon not the morning.");
  } else {
    parts.push("Steady as she goes all day, no wardrobe surprises coming.");
  }

  return parts.join(" ");
}
