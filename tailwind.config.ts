import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ["Lora", "serif"],
      },
      colors: {
        gold: {
          50: "#fffef5",
          100: "#fffce6",
          200: "#fff9bf",
          300: "#fff699",
          400: "#fff24d",
          500: "#e7ce8a",
          600: "#e6d100",
          700: "#bfb000",
          800: "#999000",
          900: "#7d7500",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
