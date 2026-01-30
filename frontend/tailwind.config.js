/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505", // Deep Charcoal
        surface: "#111111",    // Card background
        primary: "#3b82f6",    // Electric Blue
        success: "#10b981",    // Bullish Green
        danger: "#ef4444",     // Bearish Red
        border: "#1f1f1f",     // Subtle separators
      },
    },
  },
  plugins: [],
}