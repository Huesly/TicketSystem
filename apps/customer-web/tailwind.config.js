/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme Factory: Golden Hour - Coffeehouse Edition
        roast: {
          950: '#1b120c',
          900: '#2b1d14', // Deep Espresso Roast
          800: '#3d2b1f',
          700: '#523c2d',
          600: '#6d523f',
          500: '#8e6d55',
          400: '#b19077',
          300: '#d0b6a2',
          200: '#e7d8cb',
          100: '#f3ece5',
          50: '#faf6f2',
        },
        golden: {
          DEFAULT: '#e89a24',
          50: '#fdf8ef',
          100: '#faedd6',
          200: '#f4d9aa',
          300: '#edc076',
          400: '#e89a24', // Honey Crema
          500: '#d38318',
          600: '#b06512',
          700: '#8c4b13',
          800: '#733d16',
          900: '#603316',
        },
        terracotta: {
          DEFAULT: '#c1666b',
          light: '#d98287',
          dark: '#9e4c51',
        },
        crema: {
          DEFAULT: '#faf6f0',
          card: '#ffffff',
          surface: '#f5efe6',
          border: '#eae2d5',
        },
        // Compatibilidad previa para transiciones limpias
        coffee: {
          900: '#2b1d14',
          950: '#1b120c',
          800: '#3d2b1f',
          100: '#f3ece5',
          50: '#faf6f2',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
