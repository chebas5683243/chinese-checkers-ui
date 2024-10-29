import twAnimate from "tailwindcss-animate";

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        board: "url('/board-bg.png')",
        "hole-sphere":
          "radial-gradient(circle at 50% 50%, rgba(93, 64, 55, 0.2), rgba(124, 77, 46, 0.15), rgba(161, 136, 127, 0.1), rgba(215, 204, 200, 0.05))",
        "yellow-sphere":
          "radial-gradient(circle at 30% 30%, #ffffe0, #ffeb3b, #fbc02d, #f57f17)",
        "blue-sphere":
          "radial-gradient(circle at 30% 30%, #e0f7fa, #29b6f6, #0288d1, #01579b)",
        "green-sphere":
          "radial-gradient(circle at 30% 30%, #e8f5e9, #66bb6a, #388e3c, #1b5e20)",
        "black-sphere":
          "radial-gradient(circle at 30% 30%, #eeeeee, #757575, #424242, #212121)",
        "red-sphere":
          "radial-gradient(circle at 30% 30%, #ffebee, #ef5350, #d32f2f, #b71c1c)",
        "white-sphere":
          "radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0, #bdbdbd, #9e9e9e)",
      },
    },
  },
  plugins: [twAnimate],
};
export default config;
