/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        owl: "rgb(var(--owl) / <alpha-value>)",
        "owl-shadow": "rgb(var(--owl-shadow) / <alpha-value>)",
        macaw: "rgb(var(--macaw) / <alpha-value>)",
        "macaw-shadow": "rgb(var(--macaw-shadow) / <alpha-value>)",
        cardinal: "rgb(var(--cardinal) / <alpha-value>)",
        "cardinal-shadow": "rgb(var(--cardinal-shadow) / <alpha-value>)",
        bee: "rgb(var(--bee) / <alpha-value>)",
        "bee-shadow": "rgb(var(--bee-shadow) / <alpha-value>)",
        beetle: "rgb(var(--beetle) / <alpha-value>)",
        "beetle-shadow": "rgb(var(--beetle-shadow) / <alpha-value>)",
        fox: "rgb(var(--fox) / <alpha-value>)",
        "fox-shadow": "rgb(var(--fox-shadow) / <alpha-value>)",
        eel: "rgb(var(--eel) / <alpha-value>)",
        hare: "rgb(var(--hare) / <alpha-value>)",
        wolf: "rgb(var(--wolf) / <alpha-value>)",
        swan: "rgb(var(--swan) / <alpha-value>)",
        polar: "rgb(var(--polar) / <alpha-value>)",
        snow: "rgb(var(--snow) / <alpha-value>)",
        "sea-sponge": "rgb(var(--sea-sponge) / <alpha-value>)",
        humpback: "rgb(var(--humpback) / <alpha-value>)",
        "walking-fish": "rgb(var(--walking-fish) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        wiggle: "duo-wiggle 400ms ease-in-out",
        pop: "duo-pop 240ms ease-out",
      },
      keyframes: {
        "duo-wiggle": {
          "0%,100%": { transform: "translateX(0)" },
          "20%,60%": { transform: "translateX(-6px)" },
          "40%,80%": { transform: "translateX(6px)" },
        },
        "duo-pop": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        }
      }
    },
  },
  plugins: [],
}
