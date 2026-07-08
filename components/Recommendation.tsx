"use client";

import { AnimatePresence, motion } from "motion/react";

export default function Recommendation({ text }: { text: string }) {
  return (
    <div className="relative min-h-16 w-full">
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          className="mx-auto max-w-xs text-center text-lg font-medium leading-snug text-neutral-500"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
