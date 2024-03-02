module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    borderRadius: {
      'vl' : '1rem',
    },
    extend: {
      fontFamily: {
        gohu: ['Gohu', ],
      },
      colors: {
        'grapefruit': '#EBA166',
        'offwhite': '#EAE1D8',
      },
      dropShadow: {
        'solid': '-5px 5px 0px rgba(0, 0, 0, 1.0)',
      },
    },
  },
  plugins: [],
}
