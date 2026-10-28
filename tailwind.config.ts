import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#E23744",
        ink: "#ffffff",
        muted: "#ffe5e7",
        line: "rgba(255, 255, 255, 0.4)",
        accent: "#ffffff",
        accentSoft: "rgba(255, 255, 255, 0.16)",
        zred: "#E23744",
        zorange: "#f4a261",
        zgreen: "#24963f",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
