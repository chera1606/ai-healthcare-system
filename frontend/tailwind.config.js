/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#e2e8f0",
        accent: "#14b8a6",
        accentSoft: "#99f6e4",
        warn: "#f59e0b"
      }
    }
  },
  plugins: []
};

