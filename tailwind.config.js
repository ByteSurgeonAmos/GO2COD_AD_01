/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/tailwind/native");

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [nativewind()],
};
