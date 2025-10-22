/** @type {import('tailwindcss').Config} */
module.exports = {
  // CONFIGURACIÓN CRUCIAL: 'content' le dice a Tailwind dónde buscar las clases.
  content: [
    // 1. Incluye el archivo HTML raíz de Vite.
    "./index.html",
    // 2. Escanea todos los archivos JavaScript/TypeScript/JSX/TSX dentro de la carpeta 'src'
    // (Incluye App.jsx, main.jsx, y todos los componentes en src/components).
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    // Aquí definimos las extensiones de nuestro tema, como los colores de la UCB.
    // Esto es opcional, pero hace que el código sea más limpio.
    extend: {
      colors: {
        // Colores institucionales definidos en tu componente Home.jsx
        'ucb-primary': '#003366', // Azul UCB Oscuro (Navy)
        'ucb-accent': '#FFD700',  // Amarillo UCB/Dorado
      },
      // Añadimos una animación para el ícono del logo.
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  // Plugins (si añades @tailwindcss/forms, @tailwindcss/typography, etc.)
  plugins: [],
}