/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}"],
  darkMode: ["class", "class"], // Enable dark mode via class strategy
  theme: {
    extend: {
      // Custom breakpoints - only truly unique ones
      screens: {
        xs: "475px", // Extra small devices (Tailwind doesn't have xs by default)
        "3xl": "1920px", // Ultra-wide monitors
        // Height-based breakpoints
        "h-sm": { raw: "(min-height: 600px)" },
        "h-md": { raw: "(min-height: 768px)" },
        "h-lg": { raw: "(min-height: 1024px)" },
        // Preference-based breakpoints
        "motion-safe": { raw: "(prefers-reduced-motion: no-preference)" },
        "motion-reduce": { raw: "(prefers-reduced-motion: reduce)" },
        "high-contrast": { raw: "(prefers-contrast: high)" },
      },
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          light: "rgb(var(--primary-light) / <alpha-value>)",
          dark: "rgb(var(--primary-dark) / <alpha-value>)",
          foreground: "rgb(var(--text-light) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          light: "rgb(var(--secondary-light) / <alpha-value>)",
          dark: "rgb(var(--secondary-dark) / <alpha-value>)",
          foreground: "rgb(var(--text-light) / <alpha-value>)",
        },
        tertiary: {
          DEFAULT: "rgb(var(--tertiary) / <alpha-value>)",
          light: "rgb(var(--tertiary-light) / <alpha-value>)",
          dark: "rgb(var(--tertiary-dark) / <alpha-value>)",
        },
        // Alias for Shadcn UI compatibility
        accent: {
          DEFAULT: "rgb(var(--tertiary) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Alias for backward compatibility
        "liguria-mint": "rgb(var(--tertiary) / <alpha-value>)",
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Interactive state colors
        hover: "rgb(var(--hover))",
        pressed: "rgb(var(--pressed))",
        disabled: "rgb(var(--disabled) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input-bg) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        link: "hsl(var(--link))",
        "link-hover": "hsl(var(--link-hover))",
        "badge-bg": "hsl(var(--badge-bg))",
        "badge-text": "hsl(var(--badge-text))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["Fira Code", "monospace"],
      },
      spacing: {
        // Custom spacing extensions
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 2px 15px 0 rgba(0, 0, 0, 0.08)",
        medium: "0 4px 25px 0 rgba(0, 0, 0, 0.12)",
        hard: "0 8px 30px 0 rgba(0, 0, 0, 0.16)",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "slide-down": {
          "0%": {
            transform: "translateY(-20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-left": "slide-left 0.6s ease-out",
      },
      animationDelay: {
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        1: "100ms", // .animate-delay-1
        2: "200ms", // .animate-delay-2
        3: "300ms", // .animate-delay-3
        4: "400ms", // .animate-delay-4
        5: "500ms", // .animate-delay-5
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
