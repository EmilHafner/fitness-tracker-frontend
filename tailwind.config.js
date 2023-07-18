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
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Default dark fitness-related theme
        background: "#feffff",
        "primary-dark": "#2c3531",
        primary: "#176e70",
        text: "#070707",
        accent: "#ffcb9a",
        "accent-muted": "#d5ac88",
        "accent-light": "#d1e8e2",
        abort: "#f1634f",
        "abort-muted": "#e14135",
      },
    },
  },
  plugins: [],
};
