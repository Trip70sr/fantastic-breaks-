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
          DEFAULT: "hsl(195 100% 50%)",
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
          DEFAULT: "hsl(180 100% 75%)",
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
          DEFAULT: "hsl(180 100% 75%)",
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
        chart: {
          "1": "hsl(195 100% 50%)",
          "2": "hsl(180 100% 75%)",
          "3": "hsl(210 100% 60%)",
          "4": "hsl(200 100% 65%)",
          "5": "hsl(190 100% 70%)",
        },
        blue: {
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
        aquamarine: {
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
        "pulse-blue": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-blue": "pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      screens: {
        xs: "475px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "blue-aqua-gradient": "linear-gradient(135deg, hsl(195 100% 50%) 0%, hsl(180 100% 75%) 100%)",
        "aqua-blue-gradient": "linear-gradient(135deg, hsl(180 100% 75%) 0%, hsl(195 100% 50%) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
