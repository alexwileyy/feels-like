import type { FeelingWord } from "./calibration";

export type Scene = "hot" | "mild" | "rain" | "cold";
export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

export interface ConditionInput {
  word: FeelingWord;
  isRaining: boolean;
  windKmh: number;
}

const WINDY_KMH = 30;

export function sceneFor(word: FeelingWord, isRaining: boolean): Scene {
  if (isRaining) return "rain";
  if (word === "FREEZING" || word === "COLD") return "cold";
  if (word === "HOT") return "hot";
  return "mild";
}

const CLOTHES: Record<FeelingWord, string> = {
  FREEZING: "Big coat, gloves, and no arguments. It's bitter out there.",
  COLD: "Proper coat and gloves weather. Wrap up.",
  MILD: "Jumper weather. Your favourite kind.",
  WARM: "Light layers. A tee should do it.",
  HOT: "Shorts and a vest. Suncream wouldn't hurt either.",
};

export function recommendationFor({ word, isRaining, windKmh }: ConditionInput): string {
  if (isRaining && windKmh >= WINDY_KMH) {
    return "Leave the umbrella at home. It won't survive that wind. Hood up instead.";
  }
  if (isRaining) {
    return `Take the umbrella, it's tipping down. ${CLOTHES[word]}`;
  }
  if ((word === "FREEZING" || word === "COLD") && windKmh >= WINDY_KMH) {
    return `${CLOTHES[word]} The wind cuts right through, so layer up.`;
  }
  return CLOTHES[word];
}

// WMO weather codes: 51-67 drizzle/rain, 80-82 showers, 95-99 thunderstorms.
export function isRainy(weatherCode: number): boolean {
  return (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82) ||
    weatherCode >= 95
  );
}

const WORD_GLYPHS: Record<FeelingWord, string> = {
  FREEZING: "gloves",
  COLD: "coat",
  MILD: "scarf",
  WARM: "tshirt",
  HOT: "shorts",
};

// Glyph name (public/glyphs/<name>.png) for an hour in the outlook rail.
export function glyphFor(word: FeelingWord, isRaining: boolean): string {
  return isRaining ? "umbrella" : WORD_GLYPHS[word];
}

export function timeOfDay(now: Date, sunrise: Date, sunset: Date): TimeOfDay {
  const HOUR = 60 * 60 * 1000;
  const t = now.getTime();
  if (Math.abs(t - sunrise.getTime()) <= HOUR) return "dawn";
  if (Math.abs(t - sunset.getTime()) <= HOUR) return "dusk";
  if (t > sunrise.getTime() && t < sunset.getTime()) return "day";
  return "night";
}
