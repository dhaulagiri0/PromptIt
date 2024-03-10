import * as defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      borderRadius: {
        'vl': '0.7rem',
      },
      fontFamily: {
        gohu: ['Gohu'],
      },
      colors: {
        'grapefruit': '#EBA166',
        'offwhite': '#d9d9d9',
        'richgrey': '#83787A',
        'richred': '#C9373D',
        'richblue': '#368DBF',
        'darkergrey': '#2D2D2D',
        'richpink': "#F09296",
        'richyellow': '#E6B53A',
      },
      dropShadow: {
        'solid': '-5px 5px 0px rgba(0, 0, 0, 1.0)',
        'solid-white': '-5px 5px 0px rgba(255, 255, 255, 1.0)',
        'solid-grey': '-2px 2px 0px rgba(0, 0, 0, 1.0)',
      },
    },
  },
  safelist: [
    { pattern: /(bg|text|border)-./ },
  ],
  plugins: [],
}
