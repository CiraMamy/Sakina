/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7BA9D8",
        "primary-light": "#8CB8E8",
        "primary-dark": "#5A8BBD",
        secondary: "#A7D7C5",
        "bg-app": "#FAFAFA",
        "text-dark": "#2E4057",
        "card-bg": "#E8F1F8",
      },
      borderRadius: {
        "4xl": "32px",
        "5xl": "40px",
        "6xl": "48px",
      },
    },
  },
  plugins: [],
};
