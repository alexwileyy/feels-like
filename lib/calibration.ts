// Josie's personal thermostat: maps a feels-like temperature to how SHE
// experiences it, based on ratings she gives during onboarding.

export type FeelingWord = "FREEZING" | "COLD" | "MILD" | "WARM" | "HOT";

// Temperatures shown during onboarding, coldest to hottest.
export const SAMPLE_TEMPS = [5, 12, 18, 24, 30];

// One 0-100 rating (Freezing -> Boiling) per sample temp.
export type Ratings = number[];

// Sensible UK profile used when onboarding is skipped.
export const DEFAULT_RATINGS: Ratings = [10, 30, 50, 70, 90];

export function feelingScore(tempC: number, ratings: Ratings = DEFAULT_RATINGS): number {
  // Sorting enforces monotonicity: warmer temps never score colder.
  const r = [...ratings].sort((a, b) => a - b);

  if (tempC <= SAMPLE_TEMPS[0]) return r[0];
  if (tempC >= SAMPLE_TEMPS[SAMPLE_TEMPS.length - 1]) return r[r.length - 1];

  for (let i = 0; i < SAMPLE_TEMPS.length - 1; i++) {
    const [t0, t1] = [SAMPLE_TEMPS[i], SAMPLE_TEMPS[i + 1]];
    if (tempC <= t1) {
      const frac = (tempC - t0) / (t1 - t0);
      return r[i] + frac * (r[i + 1] - r[i]);
    }
  }
  return r[r.length - 1];
}

export function feelingWord(score: number): FeelingWord {
  if (score < 20) return "FREEZING";
  if (score < 40) return "COLD";
  if (score < 60) return "MILD";
  if (score < 80) return "WARM";
  return "HOT";
}

export function wordForTemp(tempC: number, ratings: Ratings = DEFAULT_RATINGS): FeelingWord {
  return feelingWord(feelingScore(tempC, ratings));
}
