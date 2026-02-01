/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for AI ITRI NTIC EVENT 2026
        primary: '#006AD7',
        secondary: '#9AD9EA',
        dark: '#21277B',
        light: '#FFFFFF',
        muted: '#5F83B1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
