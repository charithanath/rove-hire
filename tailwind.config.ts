import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        // Design tokens — map CSS variables to Tailwind utility classes
        bg:      "var(--color-bg)",
        surface: "var(--color-surface)",
        border:  "var(--color-border)",
        accent:  "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger:  "var(--color-danger)",
        "text-primary":    "var(--color-text-primary)",
        "text-secondary":  "var(--color-text-secondary)",
        "text-muted":      "var(--color-text-muted)",
        "text-disabled":   "var(--color-text-disabled)",
        "accent-light":    "var(--color-accent-light)",
      },
      borderRadius: {
        sm:  "4px",
        md:  "8px",
        lg:  "12px",
        xl:  "16px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
