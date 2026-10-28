import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        ink: "#1c1c1c",
        muted: "#686b78",
        line: "#e8e8e8",
        accent: "#e23744",
        accentSoft: "#fce9eb",
        zred: "#e23744",
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
