import type { Scene, TimeOfDay } from "./conditions";

// The app background is always white; each palette is three soft tint colours
// rendered as large radial washes that drift subtly behind the content.
export interface Palette {
  blobs: [string, string, string];
}

export const PALETTES: Record<Scene, Record<TimeOfDay, Palette>> = {
  hot: {
    dawn: { blobs: ["#ffd9c4", "#ffe9c8", "#ffc8b8"] },
    day: { blobs: ["#ffd08a", "#ffbfa0", "#ffe7b8"] },
    dusk: { blobs: ["#ffc49a", "#ff9d7e", "#ffdca8"] },
    night: { blobs: ["#dfb69e", "#cc9c85", "#e8c8a8"] },
  },
  mild: {
    dawn: { blobs: ["#ffe2b8", "#cdebcf", "#f8cdbb"] },
    day: { blobs: ["#c2e8c2", "#fff0be", "#d9edb6"] },
    dusk: { blobs: ["#eed2a8", "#cbdfb8", "#dfdca4"] },
    night: { blobs: ["#b6cbae", "#c6d2b6", "#a6bba2"] },
  },
  rain: {
    dawn: { blobs: ["#cbd5e4", "#e0d8cc", "#b8c8dc"] },
    day: { blobs: ["#b8cce0", "#d2dce6", "#9fb8d0"] },
    dusk: { blobs: ["#bcc0d8", "#cbb8d4", "#a8b0cc"] },
    night: { blobs: ["#aab8d4", "#b8b0d0", "#9cacc8"] },
  },
  cold: {
    dawn: { blobs: ["#f6ddbc", "#f0c89c", "#e4d2b4"] },
    day: { blobs: ["#f6d49c", "#f0b87e", "#e6d8a8"] },
    dusk: { blobs: ["#eec08c", "#dca478", "#d8bc94"] },
    night: { blobs: ["#d4bca0", "#c4a888", "#bcae9c"] },
  },
  freezing: {
    dawn: { blobs: ["#dce6f6", "#e8dcf0", "#c8d8f0"] },
    day: { blobs: ["#cce2f8", "#e2eefa", "#d4c8f0"] },
    dusk: { blobs: ["#ccd2ee", "#dcc8e8", "#b4c0e4"] },
    night: { blobs: ["#bcc8e8", "#c8bce0", "#acbcde"] },
  },
};
