/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#ffffff",
        surface: "#f8f9fb",
        "surface-elevated": "#ffffff",
        border: "#e5e7eb",
        "border-subtle": "#f0f1f4",
        ink: "#0f1419",
        "ink-secondary": "#374151",
        muted: "#6b7280",
        sub: "#4b5563",
        accent: "#0f766e",
        "accent-hover": "#0d6b63",
        "accent-soft": "#ecfdf5",
        "accent-muted": "#ccfbf1",
        sand: "#faf8f5",
        "sand-deep": "#f0ebe3",
        forest: "#042f2e",
        "forest-mid": "#0a3d3b",
        gold: "#c9a227",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15, 20, 25, 0.04)",
        sm: "0 2px 8px rgba(15, 20, 25, 0.05)",
        md: "0 8px 24px rgba(15, 20, 25, 0.07)",
        lg: "0 16px 48px rgba(15, 20, 25, 0.09)",
        xl: "0 24px 64px rgba(15, 20, 25, 0.12)",
        premium:
          "0 0 0 1px rgba(15, 20, 25, 0.04), 0 4px 16px rgba(15, 20, 25, 0.06), 0 24px 48px rgba(15, 118, 110, 0.06)",
        "premium-lg":
          "0 0 0 1px rgba(15, 20, 25, 0.05), 0 8px 32px rgba(15, 20, 25, 0.08), 0 32px 64px rgba(15, 118, 110, 0.08)",
        glow: "0 0 40px rgba(45, 212, 191, 0.15)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      fontSize: {
        "hero-sm": ["2.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        hero: ["4rem", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
        "hero-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        section: ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "section-lg": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
      },
      letterSpacing: {
        premium: "0.02em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.75" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        marquee: "marquee 32s linear infinite",
        float: "float 5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 90% 70% at 10% 0%, rgba(45, 212, 191, 0.18), transparent 55%), radial-gradient(ellipse 70% 60% at 90% 10%, rgba(201, 162, 39, 0.08), transparent 50%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(15, 118, 110, 0.32), transparent 60%)",
        "cta-glow":
          "linear-gradient(135deg, rgba(45, 212, 191, 0.28), rgba(201, 162, 39, 0.12), rgba(15, 118, 110, 0.4))",
        "premium-gradient": "linear-gradient(180deg, #ffffff 0%, #f8f9fb 100%)",
        "accent-gradient": "linear-gradient(135deg, #0f766e 0%, #0a3d3b 100%)",
      },
    },
  },
  plugins: [],
};
