/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#1f1b0a',
        accent: '#ffc400',
        'accent-dark': '#a67c00',
        'card-bg': 'rgba(80, 70, 30, 0.7)',
      },
    },
  },
  plugins: [],
}