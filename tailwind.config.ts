import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        atteliaGreen: "#0f766e",
        atteliaRed: "#b91c1c",
        atteliaGold: "#fbbf24"
      }
    }
  },
  plugins: []
};

export default config;


