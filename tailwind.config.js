/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Tokyo Night colors - More vibrant
        tokyonight: {
          bg: "#1a1b26",
          bgHighlight: "#24283b",
          terminal: "#1f2335",
          fg: "#d5d6db", // Brighter foreground
          fgGutter: "#4a5578", // Brighter gutter
          dark3: "#5a6a7a", // Brighter
          comment: "#636da6", // Brighter comment
          dark5: "#7a82b8", // Brighter
          blue: "#7dcfff", // Cyan blue - more vibrant
          cyan: "#89ddff", // Brighter cyan
          blue1: "#2ac3de",
          blue2: "#0db9d7",
          blue5: "#b4f9f8", // Very bright blue
          blue6: "#c3e88d",
          blue7: "#394b70",
          magenta: "#c795ae", // Brighter magenta
          magenta2: "#ff79c6", // Hot pink
          purple: "#bb9af7", // Keep the nice purple
          orange: "#ffb86c", // Brighter orange
          yellow: "#f7ca88", // Brighter yellow
          green: "#a6e22e", // Bright green
          green1: "#73daca",
          green2: "#50c7e3", // Brighter teal
          teal: "#1dd1a1", // Brighter teal
          red: "#ff5555", // Bright red
          red1: "#ff6b6b", // Brighter red variant
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} 