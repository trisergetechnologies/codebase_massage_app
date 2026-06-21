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
        surface: "#f7f8fa",
        border: "#e8eaed",
        ink: "#111827",
        muted: "#6b7280",
        sub: "#4b5563",
        accent: "#0f766e",
        "accent-soft": "#ecfdf5",
        "accent-muted": "#ccfbf1",
        sand: "#faf6f1",
        "sand-deep": "#f0e8dc",
        forest: "#042f2e",
        "forest-mid": "#0d4a47",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(17, 24, 39, 0.04)",
        md: "0 8px 24px rgba(17, 24, 39, 0.06)",
        lg: "0 16px 48px rgba(17, 24, 39, 0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      fontSize: {
        "hero-sm": ["2.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        hero: ["4rem", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
        "hero-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        section: ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "section-lg": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
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
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        marquee: "marquee 28s linear infinite",
        float: "float 5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 90% 70% at 10% 0%, rgba(45, 212, 191, 0.22), transparent 55%), radial-gradient(ellipse 70% 60% at 90% 10%, rgba(251, 191, 36, 0.12), transparent 50%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(15, 118, 110, 0.35), transparent 60%)",
        "cta-glow":
          "linear-gradient(135deg, rgba(45, 212, 191, 0.35), rgba(251, 191, 36, 0.2), rgba(15, 118, 110, 0.45))",
      },
    },
  },
  plugins: [],
};
