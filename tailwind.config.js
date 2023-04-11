/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'betterhover': {'raw': '(hover: hover)'},
      }
    },
  },
  plugins: [],
}