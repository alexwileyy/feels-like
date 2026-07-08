import { describe, expect, test } from "vitest";
import {
  glyphFor,
  isRainy,
  recommendationFor,
  sceneFor,
  timeOfDay,
} from "./conditions";

describe("sceneFor", () => {
  test("rain wins over temperature", () => {
    expect(sceneFor("HOT", true)).toBe("rain");
    expect(sceneFor("FREEZING", true)).toBe("rain");
  });

  test("maps words to scenes when dry", () => {
    expect(sceneFor("FREEZING", false)).toBe("freezing");
    expect(sceneFor("COLD", false)).toBe("cold");
    expect(sceneFor("MILD", false)).toBe("mild");
    expect(sceneFor("WARM", false)).toBe("mild");
    expect(sceneFor("HOT", false)).toBe("hot");
  });
});

describe("recommendationFor", () => {
  test("flagship rule: windy rain means no umbrella", () => {
    const rec = recommendationFor({ word: "MILD", isRaining: true, windKmh: 35 });
    expect(rec.toLowerCase()).toContain("umbrella");
    expect(rec.toLowerCase()).toContain("hood");
    expect(rec.toLowerCase()).not.toContain("take the umbrella");
  });

  test("calm rain recommends the umbrella", () => {
    const rec = recommendationFor({ word: "MILD", isRaining: true, windKmh: 10 });
    expect(rec.toLowerCase()).toContain("umbrella");
    expect(rec.toLowerCase()).not.toContain("hood");
  });

  test("each feeling word gets clothing advice when dry", () => {
    expect(
      recommendationFor({ word: "HOT", isRaining: false, windKmh: 5 }).toLowerCase()
    ).toContain("shorts");
    expect(
      recommendationFor({ word: "MILD", isRaining: false, windKmh: 5 }).toLowerCase()
    ).toContain("jumper");
    expect(
      recommendationFor({ word: "FREEZING", isRaining: false, windKmh: 5 }).toLowerCase()
    ).toContain("coat");
  });

  test("cold wind gets a wind warning", () => {
    const rec = recommendationFor({ word: "COLD", isRaining: false, windKmh: 40 });
    expect(rec.toLowerCase()).toContain("wind");
  });
});

describe("isRainy", () => {
  test("drizzle, rain and shower WMO codes count as rain", () => {
    expect(isRainy(61)).toBe(true); // slight rain
    expect(isRainy(53)).toBe(true); // moderate drizzle
    expect(isRainy(80)).toBe(true); // rain showers
    expect(isRainy(95)).toBe(true); // thunderstorm
  });

  test("clear and cloudy codes do not", () => {
    expect(isRainy(0)).toBe(false); // clear
    expect(isRainy(3)).toBe(false); // overcast
    expect(isRainy(45)).toBe(false); // fog
  });
});

describe("glyphFor", () => {
  test("rain shows the umbrella regardless of word", () => {
    expect(glyphFor("HOT", true)).toBe("umbrella");
  });

  test("dry hours map words to clothing glyphs", () => {
    expect(glyphFor("FREEZING", false)).toBe("gloves");
    expect(glyphFor("COLD", false)).toBe("coat");
    expect(glyphFor("MILD", false)).toBe("scarf");
    expect(glyphFor("WARM", false)).toBe("tshirt");
    expect(glyphFor("HOT", false)).toBe("shorts");
  });
});

describe("timeOfDay", () => {
  const sunrise = new Date("2026-07-08T05:00:00");
  const sunset = new Date("2026-07-08T21:00:00");

  test("classifies dawn, day, dusk and night", () => {
    expect(timeOfDay(new Date("2026-07-08T05:30:00"), sunrise, sunset)).toBe("dawn");
    expect(timeOfDay(new Date("2026-07-08T13:00:00"), sunrise, sunset)).toBe("day");
    expect(timeOfDay(new Date("2026-07-08T21:30:00"), sunrise, sunset)).toBe("dusk");
    expect(timeOfDay(new Date("2026-07-08T02:00:00"), sunrise, sunset)).toBe("night");
    expect(timeOfDay(new Date("2026-07-08T23:30:00"), sunrise, sunset)).toBe("night");
  });
});
