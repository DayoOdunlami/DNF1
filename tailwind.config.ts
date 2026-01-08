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
        neon: {
          red: "#ff1744",
          blue: "#00e5ff",
          yellow: "#ffea00",
          green: "#00e676",
          purple: "#d500f9",
        },
        dark: {
          bg: "#0a0a0f",
          "bg-darker": "#050508",
          card: "rgba(20, 20, 30, 0.95)",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        pulse: "pulse 1s infinite",
        buzzed: "buzzed 0.3s ease",
        fadeInUp: "fadeInUp 0.5s ease",
        correctPulse: "correctPulse 0.5s ease",
      },
      keyframes: {
        glow: {
          "0%": { filter: "drop-shadow(0 0 20px rgba(255,23,68,0.5))" },
          "100%": { filter: "drop-shadow(0 0 30px rgba(255,234,0,0.5))" },
        },
        pulse: {
          "0%, 100%": { boxShadow: "0 0 5px currentColor" },
          "50%": { boxShadow: "0 0 20px currentColor" },
        },
        buzzed: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        correctPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;


