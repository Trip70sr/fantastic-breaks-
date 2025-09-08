import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
          50: "hsl(195 100% 95%)",
          100: "hsl(195 100% 90%)",
          200: "hsl(195 100% 80%)",
          300: "hsl(195 100% 70%)",
          400: "hsl(195 100% 60%)",
          500: "hsl(195 100% 50%)",
          600: "hsl(195 100% 40%)",
          700: "hsl(195 100% 30%)",
          800: "hsl(195 100% 20%)",
          900: "hsl(195 100% 10%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(180 100% 95%)",
          100: "hsl(180 100% 90%)",
          200: "hsl(180 100% 85%)",
          300: "hsl(180 100% 80%)",
          400: "hsl(180 100% 75%)",
          500: "hsl(180 100% 70%)",
          600: "hsl(180 100% 60%)",
          700: "hsl(180 100% 50%)",
          800: "hsl(180 100% 40%)",
          900: "hsl(180 100% 30%)",
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
        blue: {
          50: "hsl(210 100% 97%)",
          100: "hsl(210 100% 94%)",
          200: "hsl(210 100% 87%)",
          300: "hsl(210 100% 78%)",
          400: "hsl(210 100% 66%)",
          500: "hsl(210 100% 50%)",
          600: "hsl(210 100% 45%)",
          700: "hsl(210 100% 39%)",
          800: "hsl(210 100% 31%)",
          900: "hsl(210 100% 24%)",
        },
        aquamarine: {
          50: "hsl(180 100% 97%)",
          100: "hsl(180 100% 94%)",
          200: "hsl(180 100% 87%)",
          300: "hsl(180 100% 78%)",
          400: "hsl(180 100% 66%)",
          500: "hsl(180 100% 50%)",
          600: "hsl(180 100% 45%)",
          700: "hsl(180 100% 39%)",
          800: "hsl(180 100% 31%)",
          900: "hsl(180 100% 24%)",
        },
        cyan: {
          50: "hsl(185 100% 97%)",
          100: "hsl(185 100% 94%)",
          200: "hsl(185 100% 87%)",
          300: "hsl(185 100% 78%)",
          400: "hsl(185 100% 66%)",
          500: "hsl(185 100% 50%)",
          600: "hsl(185 100% 45%)",
          700: "hsl(185 100% 39%)",
          800: "hsl(185 100% 31%)",
          900: "hsl(185 100% 24%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
