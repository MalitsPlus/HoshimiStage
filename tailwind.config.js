/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vocal: '#fe4b9d',
        dance: '#38bbff',
        visual: '#feb100',
        stamina: '#99db66',
        default: 'blue',
      },
      fontFamily: {
        sans: [
          ...defaultTheme.fontFamily.sans,
        ]
      },
      brightness: {
        85: ".85",
        80: ".8",
        70: ".7",
        65: ".65",
        60: ".6",
        55: ".55",
      },
      transitionDuration: {
        0: "0ms",
        default: "200ms",
      },
    },
  },
  plugins: [
  ],
}