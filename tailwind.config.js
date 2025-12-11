/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#f5c76a',
        teal: '#30f0ff',
        dark: '#02010a',
      },
    },
  },
  plugins: [],
}

