/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#CC0000",
          "red-dark": "#9B0000",
          yellow: "#FFCB05",
          blue: "#3B4CCA",
        },
      },
    },
  },
  plugins: [],
};
