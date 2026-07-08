"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// The greeting opens large in the centre, then travels to the header slot.
// Pure translate + uniform scale (no FLIP layout animation), so the glyphs
// never stretch or warp mid-flight. Once it lands, the fixed element hands
// over to the in-flow header title so it scrolls naturally with the page.
const INTRO_SCALE = 1.9;

export default function Greeting({
  text,
  introDone,
  onSettled,
}: {
  text: string;
  introDone: boolean;
  onSettled: () => void;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [intro, setIntro] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const w = ref.current.offsetWidth;
    setIntro({
      x: (window.innerWidth - w * INTRO_SCALE) / 2,
      y: window.innerHeight * 0.42,
    });
  }, [text]);

  if (!intro) {
    return (
      <h1
        ref={ref}
        className="invisible fixed left-0 top-0 whitespace-nowrap text-xl font-bold"
      >
        {text}
      </h1>
    );
  }

  return (
    <motion.h1
      className="fixed left-0 top-0 z-10 origin-top-left whitespace-nowrap text-xl font-bold"
      initial={{ x: intro.x, y: intro.y, scale: INTRO_SCALE, opacity: 0 }}
      animate={
        introDone
          ? { x: 24, y: 32, scale: 1, opacity: 1 }
          : { x: intro.x, y: intro.y, scale: INTRO_SCALE, opacity: 1 }
      }
      transition={{ type: "spring", stiffness: 190, damping: 26 }}
      onAnimationComplete={() => {
        if (introDone) onSettled();
      }}
    >
      {text}
    </motion.h1>
  );
}
