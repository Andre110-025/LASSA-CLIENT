/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: '#020F54',
      },
      fontFamily: {
        'sans': ['Poppins'],
      }
    },
    screens: {
      '2xs': '380px',
      'xs': '475px',
      '2md': '540px',
      'pmd': '940px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
}

