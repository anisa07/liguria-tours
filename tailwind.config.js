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
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary))",
          foreground: "rgb(var(--color-secondary-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground))",
        },
        "accent-hover": "rgb(var(--color-accent-hover))",
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
        // Semantic colors
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          foreground: "rgb(var(--color-success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          foreground: "rgb(var(--color-warning-foreground) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
          foreground: "rgb(var(--color-error-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
          foreground: "rgb(var(--color-info-foreground) / <alpha-value>)",
        },
        // Surface color variations for visual depth
        surface: {
          1: "rgb(var(--color-surface-1) / <alpha-value>)",
          2: "rgb(var(--color-surface-2) / <alpha-value>)",
          3: "rgb(var(--color-surface-3) / <alpha-value>)",
        },
        // Interactive state colors for user feedback
        hover: "rgb(var(--color-hover))",
        pressed: "rgb(var(--color-pressed))",
        focus: "rgb(var(--color-focus))",
        disabled: {
          DEFAULT: "rgb(var(--color-disabled) / <alpha-value>)",
          foreground: "rgb(var(--color-disabled-foreground) / <alpha-value>)",
        },
        // 60-30-10 Color Rule Schemes
        "scheme-professional": {
          60: "rgb(var(--scheme-professional-60) / <alpha-value>)",
          30: "rgb(var(--scheme-professional-30) / <alpha-value>)",
          10: "rgb(var(--scheme-professional-10) / <alpha-value>)",
        },
        "scheme-modern": {
          60: "rgb(var(--scheme-modern-60) / <alpha-value>)",
          30: "rgb(var(--scheme-modern-30) / <alpha-value>)",
          10: "rgb(var(--scheme-modern-10) / <alpha-value>)",
        },
        "scheme-elegant": {
          60: "rgb(var(--scheme-elegant-60) / <alpha-value>)",
          30: "rgb(var(--scheme-elegant-30) / <alpha-value>)",
          10: "rgb(var(--scheme-elegant-10) / <alpha-value>)",
        },
        "scheme-corporate": {
          60: "rgb(var(--scheme-corporate-60) / <alpha-value>)",
          30: "rgb(var(--scheme-corporate-30) / <alpha-value>)",
          10: "rgb(var(--scheme-corporate-10) / <alpha-value>)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
