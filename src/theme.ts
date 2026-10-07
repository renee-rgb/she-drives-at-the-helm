import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Brand colors from the live captain page code (see captain kit).
export const C = {
  paper: "#fcebf2",
  paperLight: "#fff6fa",
  blush: "#fdf2f7",
  pink: "#ee3d8f",
  deep: "#d3277e",
  pink2: "#ff6aad",
  highlight: "#f8bfd8",
  ink: "#1b181c",
  char: "#2b282c",
  orange: "#ef8a2b",
  water: "#3fb7d2",
};

export const F = {
  display: "Bebas Neue",
  display2: "Anton",
  script: "Caveat",
  body: "Poppins",
};

const fonts = [
  ["Bebas Neue", "bebas-neue-latin-400-normal.woff2", "400"],
  ["Anton", "anton-latin-400-normal.woff2", "400"],
  ["Caveat", "caveat-latin-400-normal.woff2", "400"],
  ["Caveat", "caveat-latin-700-normal.woff2", "700"],
  ["Poppins", "poppins-latin-400-normal.woff2", "400"],
  ["Poppins", "poppins-latin-600-normal.woff2", "600"],
  ["Poppins", "poppins-latin-700-normal.woff2", "700"],
  ["Poppins", "poppins-latin-800-normal.woff2", "800"],
] as const;

export const fontsReady = Promise.all(
  fonts.map(([family, file, weight]) =>
    loadFont({ family, url: staticFile(`fonts/${file}`), weight }),
  ),
);
