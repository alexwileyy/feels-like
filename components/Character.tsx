"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Scene } from "@/lib/conditions";

// Glyph diorama shown until the real character illustrations land in
// public/characters/<scene>.png - then the image takes over automatically.
const FALLBACK: Record<Scene, { main: string; accessory: string }> = {
  hot: { main: "sun", accessory: "bikini" },
  mild: { main: "suncloud", accessory: "scarf" },
  rain: { main: "rain", accessory: "umbrella" },
  cold: { main: "leaf", accessory: "coat" },
  freezing: { main: "snowflake", accessory: "gloves" },
};

const ALL_SCENES: Scene[] = ["hot", "mild", "rain", "cold", "freezing"];

export default function Character({ scene }: { scene: Scene }) {
  const [broken, setBroken] = useState<Partial<Record<Scene, boolean>>>({});

  // Preload every scene so live demo swaps never flash a loading gap.
  useEffect(() => {
    ALL_SCENES.forEach((s) => {
      const img = new Image();
      img.src = `/characters/${s}.png`;
    });
  }, []);

  return (
    <div className="relative mx-auto h-80 w-80">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={scene}
          className="absolute inset-0 grid place-items-center"
          initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotate: 6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          {broken[scene] ? (
            <div className="relative grid h-full w-full place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/glyphs/${FALLBACK[scene].main}.png`}
                alt=""
                className="h-44 w-44 drop-shadow-xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/glyphs/${FALLBACK[scene].accessory}.png`}
                alt=""
                className="absolute bottom-6 right-8 h-24 w-24 drop-shadow-lg"
              />
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={`/characters/${scene}.png`}
              alt={`Josie's outfit for ${scene} weather`}
              className="h-full w-full object-contain drop-shadow-2xl"
              onError={() => setBroken((b) => ({ ...b, [scene]: true }))}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
