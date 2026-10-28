import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet Warna NEXUS: Urban Concrete & Sage Green
        nexus: {
          DEFAULT: "#4F6F52", // Sage Green utama (Tombol, Accent, Highlight)
          hover: "#3E5841",   // Sage Green gelap (Hover state)
          light: "#E8EFE9",   // Sage Green sangat soft (Badge / Soft Background)
          accent: "#2D4331",  // Sage Green paling gelap (Active state / Borders)
          bg: "#F6F6F3",      // Urban Concrete background (Soft Neutral Off-White)
          dark: "#18181B",    // Charcoal Dark (Text / Headers)
        },
      },
    },
  },
  plugins: [],
};

export default config;