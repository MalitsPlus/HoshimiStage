/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-vocal',
    {
      pattern: /bg-.*$/,
    },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      width: {
        '18': '4.5rem',
      },
      colors: {
        vocal: '#fe4b9d',
        dance: '#38bbff',
        visual: '#feb100',
        "vocal-trans": '#fe4b9d88',
        "dance-trans": '#38bbff88',
        "visual-trans": '#feb10088',
        'vocal-acc': '#cb015c',
        'dance-acc': '#0088d1',
        'visual-acc': '#b37d00',
        stamina: '#99db66',
        'stamina-acc': '#49ba43',
        'skill-success-rate-up': '#38bdf8',
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
      keyframes: {
        'pulse-strong': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .3 },
        },
        'spin-reverse': {
          'from': {
            transform: 'rotate(0deg)'
          },
          'to': {
            transform: 'rotate(-360deg)'
          }
        },
        'spin': {
          'from': {
            transform: 'rotate(0deg)'
          },
          'to': {
            transform: 'rotate(360deg)'
          }
        }
      },
      animation: {
        'pulse-quick': 'pulse-strong 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
        'spin-reverse': 'spin-reverse 1s linear infinite;',
        'spin-cubic-bezier': 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;'
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        "hero": "[full-start] minmax(2rem,1fr) [standard-start] 3.75rem [narrow-start] minmax(1rem,67.5rem) [narrow-end] 3.75rem [standard-end] minmax(2rem,1fr) [full-end]",
      },
      order: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18'
      },
      gridColumnStart: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}