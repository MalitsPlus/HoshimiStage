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
        vocal: '#ed60bb',
        dance: '#1394ff',
        visual: '#fca104',
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
      }
    },
  },
  plugins: [
  ],
}