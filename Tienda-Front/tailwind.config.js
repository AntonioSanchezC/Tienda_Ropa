/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
      },
      screens: {
        xs: '480px', // Define el ancho mínimo para xs
      },
    
    },
  },
  plugins: [],

  
  

}


