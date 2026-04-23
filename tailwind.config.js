/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#e8edf5", 100: "#c5d0e0", 200: "#9eb0c8",
          300: "#7690b0", 400: "#567a9e", 500: "#3d648c",
          600: "#2d5078", 700: "#1e3d63", 800: "#132b4e",
          900: "#0c1a2e", 950: "#07101c",
        },
        emerald: {
          50:  "#e6f5ee", 100: "#c2e5d3", 200: "#9ad3b6",
          300: "#70c198", 400: "#4db380", 500: "#18a163",
          600: "#148f56", 700: "#107b48", 800: "#0c673a", 900: "#07502c",
        },
        border:  "hsl(var(--border))",
        input:   "hsl(var(--input))",
        ring:    "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary:     { DEFAULT: "hsl(var(--primary))",     foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))",   foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))",       foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))",      foreground: "hsl(var(--accent-foreground))" },
        card:        { DEFAULT: "hsl(var(--card))",        foreground: "hsl(var(--card-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))",     foreground: "hsl(var(--popover-foreground))" },
      },
      fontFamily: {
        sans:    ["DM Sans", "system-ui", "sans-serif"],
        heading: ["Syne", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: { lg: "10px", md: "8px", sm: "6px", xl: "14px", "2xl": "18px" },
      boxShadow: {
        card:       "0 1px 3px 0 rgba(0,0,0,.25)",
        "card-lg":  "0 4px 14px 0 rgba(0,0,0,.45)",
        panel:      "0 8px 24px 0 rgba(0,0,0,.55)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "slide-up":       "slide-up 0.25s ease-out",
        shimmer:          "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
