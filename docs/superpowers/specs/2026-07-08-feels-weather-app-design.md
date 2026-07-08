# "Feels" — a weather app for Josie (hackathon, 1-day build)

## Context

Work hackathon: build a product for a teammate, presented live tomorrow (browser, mobile responsive mode, in front of the room). Josie is fed up with weather apps showing absolute temperature instead of what it actually feels like, and wants to be told what to wear. We're building a mobile-web weather app whose headline is a *calibrated-to-Josie* feeling word, with an illustrated character dressed for the conditions as the centerpiece. Objective is a working, beautiful demo of the concept — not a shippable product. Fun is the point.

Design was fully brainstormed and approved by Alex. Key decisions already made:
- Headline = big feeling word ("HOT") from Josie's personal calibration, with "feels like 20°" smaller beneath.
- Must-haves: onboarding calibration, hourly outlook rail, smart rec logic. Stretch: baby mode.
- Assets: AI-generated character scenes (Alex generates from prompts I write) + Microsoft Fluent 3D emoji (MIT) for glyphs.
- Hidden demo panel to force weather states live on stage (also the API-failure fallback).

## Tech stack

Next.js (App Router) + TypeScript + Tailwind + Framer Motion (`motion`), entirely client-side. No backend, no API keys. Weather from Open-Meteo. Calibration persisted in localStorage. Celsius. Mobile-only layout (~390px wide). Rounded warm font via `next/font/google` (Nunito).

## Architecture

```
app/layout.tsx            — font, metadata, viewport
app/page.tsx              — client orchestrator: onboarding vs home (localStorage flag)
components/
  Greeting.tsx            — "Good morning, Josie" center → floats up to header (Framer layout anim)
  GradientBackground.tsx  — 2-3 huge blurred radial-gradient blobs, slow CSS drift; palette cross-fade on state change
  Character.tsx           — scene image (hot/mild/rain/cold), animated swap
  Headline.tsx            — feeling word + "feels like X°"
  Recommendation.tsx      — witty clothing advice line
  HourlyRail.tsx          — scroll-down day-ahead: hour + Fluent glyph + word
  Onboarding.tsx          — calibration flow (5 temp cards, one at a time)
  CalibrationSlider.tsx   — big tactile Freezing→Boiling slider (spring physics)
  DemoPanel.tsx           — hidden; toggled with "d" key
lib/
  weather.ts              — geolocate (fallback: London), fetch Open-Meteo, canned fallback data
  calibration.ts          — PURE: fit thresholds from ratings; map feels-like temp → feeling score/word
  conditions.ts           — PURE: (word, rain, wind) → scene + recommendation (rule table)
  palettes.ts             — scene × timeOfDay → 3 blob colors
public/characters/        — hot.png, mild.png, rain.png, cold.png (SVG/emoji placeholders until Alex's images land)
public/glyphs/            — Fluent 3D emoji PNGs
ASSET_PROMPTS.md          — image-gen prompts for Alex (FIRST deliverable)
```

## Core logic

**Weather (lib/weather.ts):** `https://api.open-meteo.com/v1/forecast?latitude={}&longitude={}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto&forecast_days=1`. Browser geolocation with graceful fallback to London coords; on any API failure, return canned data matching the same shape (demo insurance).

**Calibration (lib/calibration.ts):** Onboarding shows 5 temps (5°, 12°, 18°, 24°, 30°); Josie rates each on a 0–100 slider (Freezing→Boiling). Sort ratings to enforce monotonicity, then piecewise-linear interpolate temp → personal score. Score bands: <20 FREEZING, <40 COLD, <60 MILD, <80 WARM, else HOT. Default (onboarding skipped): sensible UK mapping. Persist ratings in localStorage.

**Conditions (lib/conditions.ts):** scene = `rain` if raining (weather_code / precip probability ≥ 50%), else by band: FREEZING/COLD → `cold`, MILD/WARM → `mild`, HOT → `hot`. Recommendation rule table keyed by scene with modifier overrides, flagship combo: rain + wind ≥ 30 km/h → "Leave the umbrella at home — it won't survive. Hood up." (NB: en-dash/hyphen only, no em-dash, per org rules — use "-"). A handful of witty Josie-addressed lines per scene.

**Time of day:** from sunrise/sunset → dawn/day/dusk/night; drives palette + greeting text.

**Demo panel:** "d" keypress toggles a compact overlay: force scene (hot/mild/rain/cold), wind toggle, time-of-day cycle, "live" reset. Overrides are nullable state layered over live data; every dependent element animates on change.

## Build order

1. **ASSET_PROMPTS.md** — detailed prompts + consistency recipe (same character description, style anchors: "soft 3D render, matte clay, toy-like, Airbnb-icon skeuomorphism, soft studio light, portrait") for the 4 scenes. Hand to Alex immediately so generation runs in parallel.
2. Scaffold Next.js + Tailwind + motion; download ~8 Fluent 3D emoji PNGs (coat, gloves, umbrella, sweater/t-shirt, shorts, bikini, sun, cloud) from github.com/microsoft/fluentui-emoji.
3. `lib/` pure modules (weather, calibration, conditions, palettes) + placeholder character images.
4. Home screen: greeting animation, background blobs, character, headline, recommendation — static states first, then wired to live data.
5. Demo panel (early — it accelerates all later visual work).
6. Onboarding calibration flow.
7. Hourly rail.
8. Drop in Alex's generated images; polish pass (stagger timings, spring tuning).
9. Stretch only if cruising: baby mode toggle.

## Verification

- Unit tests (vitest) for `calibration.ts` and `conditions.ts` only — pure functions, incl. monotonicity and the umbrella/wind rule.
- End-to-end demo-path run-through in browser at 390×844: fresh profile → onboarding → home animates in → scroll to hourly rail → press "d" → cycle all four scenes + wind toggle + time of day, confirming character/palette/copy all morph.
- This is the exact path performed on stage tomorrow; it must be flawless, everything else can be rough.

## Notes

- Org spelling rule: "Gocertify" if it ever appears; never em-dashes in copy or code comments.
- Spec doc: after approval, also save the approved design to `docs/superpowers/specs/2026-07-08-feels-weather-app-design.md` and commit, per brainstorming skill.
