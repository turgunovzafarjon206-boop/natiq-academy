import type { Config } from "tailwindcss";

// Dizayn tizimi tokenlari brand.ts bilan mos. shadcn/ui shu tokenlardan foydalanadi.
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0E6F63", ink: "#0A544B", soft: "#DDEBE7" },
        gold: { DEFAULT: "#B5842A", soft: "#F4E8CD" },
        ground: "#F6F4EF",
        ink: { DEFAULT: "#1A211F", 2: "#414B48", 3: "#727C77" },
        ok: "#2E8B62", warn: "#B7791F", bad: "#C0503F",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: { xl: "14px", lg: "11px", md: "9px" },
    },
  },
  plugins: [],
};
export default config;
