// RUTA: ./postcss.config.mjs

export default {
  plugins: [
    // El compilador de Next.js prefiere el nombre de cadena simple
    '@tailwindcss/postcss',
    'autoprefixer',
  ],
};