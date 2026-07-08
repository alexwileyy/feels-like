"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { templateSummary, type SummaryInput } from "@/lib/summary";

// Josie's speech-bubble weather report. Renders the deterministic template
// summary instantly, then upgrades to the AI-written one when the API route
// responds. Responses are cached per weather-state so demo scene-flipping
// doesn't spam the API.
const cache = new Map<string, string>();

export default function JosieReport({ input }: { input: SummaryInput }) {
  const fallback = templateSummary(input);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const key = `${input.word}-${Math.round(input.feelsLike)}-${input.windKmh >= 30}-${
    input.hours.filter((h) => h.isRaining).length
  }`;

  useEffect(() => {
    if (cache.has(key)) {
      setAiSummary(cache.get(key)!);
      return;
    }
    setAiSummary(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // small debounce so cycling demo scenes doesn't fire a request per click
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
          signal: controller.signal,
        });
        if (!res.ok) return; // template stays - never an empty bubble
        const { summary } = await res.json();
        if (typeof summary === "string" && summary.length > 0) {
          cache.set(key, summary);
          setAiSummary(summary);
        }
      } catch {
        // network/abort: keep the template
      }
    }, 700);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const text = aiSummary ?? fallback;

  return (
    <div className="flex items-start gap-3 pb-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/characters/avatar.png"
        alt="Your forecaster"
        className="h-12 w-12 shrink-0 rounded-full border border-black/5 bg-white object-cover shadow-sm"
        onError={(e) => ((e.target as HTMLImageElement).src = "/characters/mild.png")}
      />
      <div className="relative flex-1 rounded-2xl rounded-tl-sm bg-neutral-900/[0.05] px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={text}
            className="text-sm font-medium leading-relaxed text-neutral-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
