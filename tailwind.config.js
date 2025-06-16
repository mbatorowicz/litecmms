// Tailwind CSS Configuration - LiteCMMS v2.0

// Import modularnych konfiguracji
const { colors } = require('./tailwind/colors');
const { keyframes, animation } = require('./tailwind/animations');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content paths - określa gdzie Tailwind ma szukać klas
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx,css}',
  ],
  
  // Dark mode configuration
  darkMode: ['class'],
  
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    
    extend: {
      // Kolory z modułu
      colors,
      
      // Animacje z modułu  
      keyframes,
      animation,
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      
      // Border radius
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      // Spacing dla CMMS interfejsu
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Box shadows
      boxShadow: {
        'cmms': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'cmms-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      
      // Grid templates dla dashboardu
      gridTemplateColumns: {
        'cmms': 'minmax(0, 1fr) 300px',
        'mobile': '1fr',
      },
    },
  },
  
  // Plugins
  plugins: [
    require('tailwindcss-animate'),
  ],
}; 