"use client";

import { AnimatePresence, motion } from "motion/react";

// Opening moment only: big bold greeting, each word sliding up with a fade,
// wrapping naturally. Fades away once the intro beat is over - it does not
// persist in a header.
export default function Greeting({ text, done }: { text: string; done: boolean }) {
  const words = text.split(" ");

  return (
    <AnimatePresence>
      {!done && (
        <motion.h1
          className="fixed inset-0 z-10 flex flex-wrap content-center justify-center gap-x-3 px-8 text-center text-6xl font-bold leading-tight tracking-tight"
          exit={{ opacity: 0, y: -28, transition: { duration: 0.45, ease: "easeIn" } }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + i * 0.16,
                type: "spring",
                stiffness: 240,
                damping: 26,
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      )}
    </AnimatePresence>
  );
}
