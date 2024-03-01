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
      colors: {
        primary: '#000000',
        secondary: '#000000',
        accent: '#000000'
      },
      fontFamily: {
      },
      content: {
        blank: '""'
      },
      backgroundImage: {
      }
    }
  },
  plugins: []
};
