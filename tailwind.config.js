/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        "background-light": "#f7f7f7",
        "background-dark": "#191919",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
