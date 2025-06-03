/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enables class-based dark mode
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
          colors: {
        primaryBlue: '#187CFA',
        primaryPink: '#D210B0',
        primaryPurple: '#604AE9',
      },
      backgroundImage: {
        'loaderColor' : 'linear-gradient(to right, #187CFA, #D210B0, #604AE9)' ,
      }
      },
    },
    plugins: [],
  }
  