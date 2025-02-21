/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
       'xxs': '360px',    // Smartphones pequenos
        'xs': '480px',     // Smartphones
        'sm': '640px',     // Tablets pequenos
        'md': '768px',     // Tablets
        'lg': '1024px',    // Laptops/Desktops pequenos
        'xl': '1280px',    // Desktops
        '2xl': '1400px',   // Desktops grandes
        '3xl': '1600px',   // Telas grandes
        '4xl': '1920px',   // Telas muito grandes
        'tall': { 'raw': '(min-height: 800px)' },
        'xtall': { 'raw': '(min-height: 1080px)' },
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' },
      },
    },
    extend: {
      colors: {
        // Tons de azul (cor principal)
        'primary-300': '#7CAFFF',
        'primary-400': '#5694F5',
        'primary-500': '#3a81f2', // Cor base
        'primary-600': '#2B6AD9',
        'primary-700': '#1E53B3',
        
        // Tons complementares
        'secondary-300': '#FFB86C',
        'secondary-400': '#FFB020',
        'secondary-500': '#FFB620', // Mantido do original
        'secondary-600': '#E6A012',
        'secondary-700': '#CC8C0A',

        // Tons de cinza/azul para texto e backgrounds
        'off-white': '#F5F8FF', // Mais azulado que o original
        'light-1': '#FFFFFF',
        'light-2': '#F5F7FF', // Mais azulado
        'light-3': '#7885B3', // Mais azulado
        'light-4': '#5C6B9B', // Mais azulado

        // Tons escuros com um toque de azul
        'dark-1': '#0A0C12',
        'dark-2': '#12151F',
        'dark-3': '#1A1F2E',
        'dark-4': '#242B3D',

        // Cores de estado
        'success': '#4CAF50',
        'warning': '#FFB620',
        'error': '#FF5A5A',
        'info': '#3a81f2',
      },
      screens: {
        'xs': '480px',
        '3xl': '1600px',
        '4xl': '1920px',
        'tall': { 'raw': '(min-height: 800px)' },
      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
        'flat': 'flat',
      },
      perspective: {
        'none': 'none',
        '500': '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'tilt': {
          '0%, 100%': { transform: 'rotate3d(0, 0, 0, 0deg)' },
          '25%': { transform: 'rotate3d(1, 0, 0, 20deg)' },
          '75%': { transform: 'rotate3d(0, 1, 0, 20deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'tilt': 'tilt 5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.transform-style-3d': {
          transformStyle: 'preserve-3d',
        }
      }
      addUtilities(newUtilities)
    }
  ],
};

