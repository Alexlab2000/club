/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Cormorant Garamond'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        obsidian: "#0a0a0a",
        coal: "#111111",
        charcoal: "#1a1a1a",
        ash: "#2a2a2a",
        muted: "#555555",
        ghost: "#888888",
        silver: "#cccccc",
        ivory: "#f5f0e8",
        gold: "#c9a84c",
        "gold-light": "#e8c97a",
        "gold-dark": "#8a6e2a",
        crimson: "#8b1a1a",
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,168,76,0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(201,168,76,0.25)" },
        },
      },
    },
  },
  plugins: [],
};
