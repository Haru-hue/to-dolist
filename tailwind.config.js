/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "width": {
        "7/10": "70%",
        "3/10": "30%"
      },
      "screens": {
        "max-2xl": { max: '1536px' },
        "max-xl": { max: '1280px' },
        "max-md": { max: '768px' },
      },
      "borderRadius": {
        '4xl': '2rem'
      },
      "padding": {
        'full': '100%'
      }
    },
  },
  plugins: [],
}