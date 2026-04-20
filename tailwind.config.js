/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        
        primary: "#3B82F6", 
        secondary: "#FBCFE8", 
        background: "#FFFFFF", 
        darkText: "#1F2937",
        lightText: "#F3F4F6",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem', 
      }
    },
  },
  plugins: [],
}