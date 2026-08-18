import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/experience/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#0B0C0E",
          surface: "#121418",
          card: "#181A1E",
          ivory: "#F5F3EF",
          ivoryCard: "#EAE6DF",
        },
        foreground: {
          light: "#F7F7F8",
          muted: "#8E929C",
          dark: "#121418",
          darkMuted: "#626670",
        },
        accent: {
          gold: "#D8C29D",
          goldMuted: "#A38F6E",
          terracotta: "#D66853",
          warmBrown: "#7D4F39",
          coral: "#E27D60",
        },
        border: {
          glass: "rgba(255, 255, 255, 0.08)",
          glassHover: "rgba(255, 255, 255, 0.16)",
          darkGlass: "rgba(0, 0, 0, 0.08)",
        },
      },
      fontFamily: {
        serif: ["var(--font-editorial)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        hangul: ["var(--font-hangul)", "Noto Sans KR", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
