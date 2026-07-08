import { describe, expect, test } from "vitest";
import {
  DEFAULT_RATINGS,
  SAMPLE_TEMPS,
  feelingScore,
  feelingWord,
  wordForTemp,
} from "./calibration";

describe("feelingScore", () => {
  test("returns the exact rating at a sample temperature", () => {
    expect(feelingScore(18, [10, 30, 50, 70, 90])).toBe(50);
  });

  test("interpolates between sample temperatures", () => {
    // halfway between 12C (30) and 18C (50) -> 40
    expect(feelingScore(15, [10, 30, 50, 70, 90])).toBe(40);
  });

  test("clamps below the coldest and above the hottest sample", () => {
    expect(feelingScore(-5, [10, 30, 50, 70, 90])).toBe(10);
    expect(feelingScore(38, [10, 30, 50, 70, 90])).toBe(90);
  });

  test("enforces monotonicity when ratings are out of order", () => {
    // Josie rated 12C as hotter than 18C by mistake; sorted ratings keep
    // warmer temps from scoring colder than cooler temps
    const score12 = feelingScore(12, [10, 60, 40, 70, 90]);
    const score18 = feelingScore(18, [10, 60, 40, 70, 90]);
    expect(score18).toBeGreaterThanOrEqual(score12);
  });

  test("a hot-blooded rating profile shifts words down the scale", () => {
    // Josie runs hot: 24C already feels boiling to her
    const hotBlooded = [20, 45, 65, 85, 100];
    expect(feelingScore(24, hotBlooded)).toBe(85);
    expect(wordForTemp(24, hotBlooded)).toBe("HOT");
    // whereas the default profile calls 24C WARM
    expect(wordForTemp(24, DEFAULT_RATINGS)).toBe("WARM");
  });
});

describe("feelingWord", () => {
  test("maps score bands to words", () => {
    expect(feelingWord(0)).toBe("FREEZING");
    expect(feelingWord(19)).toBe("FREEZING");
    expect(feelingWord(20)).toBe("COLD");
    expect(feelingWord(45)).toBe("MILD");
    expect(feelingWord(65)).toBe("WARM");
    expect(feelingWord(80)).toBe("HOT");
    expect(feelingWord(100)).toBe("HOT");
  });
});

describe("defaults", () => {
  test("sample temps and default ratings line up", () => {
    expect(SAMPLE_TEMPS).toHaveLength(DEFAULT_RATINGS.length);
  });

  test("default profile gives sensible UK words", () => {
    expect(wordForTemp(2)).toBe("FREEZING");
    expect(wordForTemp(9)).toBe("COLD");
    expect(wordForTemp(17)).toBe("MILD");
    expect(wordForTemp(30)).toBe("HOT");
  });
});
