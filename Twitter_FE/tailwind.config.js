import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.5)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-5px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
      animation: {
        wave: "wave 1s ease-in-out infinite",
        slideDown: "slideDown 0.3s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
        "slide-out": "slide-out 0.4s ease-in forwards",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "black"], // có nhiều theme fallback
  },
  safelist: [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "text-primary",
    "bg-base-100",
  ],
};
