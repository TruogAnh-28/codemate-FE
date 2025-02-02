import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./public/**/*.html", // Include public HTML files
    "./src/**/*.{js,jsx,ts,tsx,vue}", // Include JS, JSX, TS, TSX, and Vue files in the src directory
    "./index.html", // Include the index.html file
  ],
  theme: {
    fontFamily: {
      sans: ["Public Sans", "sans-serif"],
      mono: ["Public Sans Mono", "monospace"],
    },
    borderRadius: {
      full: "100%",
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
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
    extend: {
      zIndex: {
        "-10": "-1",
      },
      fontSize: {
        "heading-1": ["48px", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-2": ["40px", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-3": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-4": ["24px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-large-bold": ["20px", { fontWeight: "700" }],
        "body-large-semibold": ["20px", { fontWeight: "600" }],
        "body-large-medium": ["20px", { fontWeight: "500" }],
        "body-large-regular": ["20px", { fontWeight: "400" }],
        "body-base-bold": ["16px", { fontWeight: "700" }],
        "body-base-semibold": ["16px", { fontWeight: "600" }],
        "body-base-medium": ["16px", { fontWeight: "500" }],
        "body-base-regular": ["16px", { fontWeight: "400" }],
        "body-small-bold": ["12px", { fontWeight: "700" }],
        "body-small-semibold": ["12px", { fontWeight: "600" }],
        "body-small-medium": ["12px", { fontWeight: "500" }],
        "body-small-regular": ["12px", { fontWeight: "400" }],
        "body-xs-1": ["10px", { fontWeight: "700" }],
        "body-xs-2": ["10px", { fontWeight: "600" }],
        "body-xs-3": ["10px", { fontWeight: "500" }],
        "body-xs-4": ["10px", { fontWeight: "400" }],
      },
      colors: {
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-variant": "hsl(var(--primary-variant) / <alpha-value>)",
        "primary-darker": "hsl(var(--primary-darker) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        "secondary-variant": "hsl(var(--secondary-variant) / <alpha-value>)",
        "secondary-darker": "hsl(var(--secondary-darker) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        error: "hsl(var(--error) / <alpha-value>)",
        "error-variant": "hsl(var(--error-variant) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        "warning-variant": "hsl(var(--warning-variant) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        "success-variant": "hsl(var(--success-variant) / <alpha-value>)",
        "on-primary": "hsl(var(--on-primary) / <alpha-value>)",
        "on-secondary": "hsl(var(--on-secondary) / <alpha-value>)",
        "on-background": "hsl(var(--on-background) / <alpha-value>)",
        "on-surface": "hsl(var(--on-surface) / <alpha-value>)",
        "on-error": "hsl(var(--on-error) / <alpha-value>)",
        "on-warning": "hsl(var(--on-warning) / <alpha-value>)",
        "on-success": "hsl(var(--on-success) / <alpha-value>)",
        "text-primary": "hsl(var(--text-primary) / <alpha-value>)",
        "text-secondary": "hsl(var(--text-secondary) / <alpha-value>)",
        "text-tetiary": "hsl(var(--text-tetiary) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
