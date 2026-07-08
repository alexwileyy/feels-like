import type { Scene, TimeOfDay } from "./conditions";

// Each palette drives the ambient background: a base sky colour plus three
// soft radial blobs layered and blurred over it. `dark` flips text colour.
export interface Palette {
  sky: string;
  blobs: [string, string, string];
  dark: boolean;
}

export const PALETTES: Record<Scene, Record<TimeOfDay, Palette>> = {
  hot: {
    dawn: { sky: "#ffe9d6", blobs: ["#ffc4a3", "#ffdf8e", "#ff9e9e"], dark: false },
    day: { sky: "#ffedc4", blobs: ["#ffb85c", "#ffe38a", "#7fd8f7"], dark: false },
    dusk: { sky: "#ffd9b0", blobs: ["#ff9d5c", "#e88bd0", "#ffc46b"], dark: false },
    night: { sky: "#2a1e3f", blobs: ["#8a4d76", "#c96f4a", "#3f2f63"], dark: true },
  },
  mild: {
    dawn: { sky: "#f2ead9", blobs: ["#ffd9a8", "#bfe3c0", "#f3b8a0"], dark: false },
    day: { sky: "#e3f0d9", blobs: ["#a8d8a8", "#ffe9a8", "#a5d8e8"], dark: false },
    dusk: { sky: "#f0dfc8", blobs: ["#e8b88a", "#b8cfa0", "#d8a8c0"], dark: false },
    night: { sky: "#1e2a35", blobs: ["#3f5a63", "#5a6e4f", "#2f3f55"], dark: true },
  },
  rain: {
    dawn: { sky: "#dfe3ea", blobs: ["#b8c4d6", "#d6cabb", "#9fb3c8"], dark: false },
    day: { sky: "#d6dee8", blobs: ["#9fb8d0", "#c0cdd9", "#7f9cb8"], dark: false },
    dusk: { sky: "#c4c4d6", blobs: ["#8f97b8", "#b0a0c0", "#6f7a9c"], dark: false },
    night: { sky: "#161d2b", blobs: ["#2b3a55", "#3f3a5f", "#20304a"], dark: true },
  },
  cold: {
    dawn: { sky: "#e8ecf5", blobs: ["#c8d8f0", "#e0d0e8", "#a8c4e8"], dark: false },
    day: { sky: "#ddeaf7", blobs: ["#aacdf0", "#d5e5f7", "#c8b8e8"], dark: false },
    dusk: { sky: "#d0d4ec", blobs: ["#a0aee0", "#c8a8d8", "#8898cc"], dark: false },
    night: { sky: "#131a30", blobs: ["#25355f", "#3a2f5a", "#1c2a4f"], dark: true },
  },
};
