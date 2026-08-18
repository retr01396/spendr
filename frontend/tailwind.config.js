/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spendr: {
          black: '#000000',
          dark: '#0A0A0C',
          surface: '#121216',
          elevated: '#1A1A22',
          red: '#E50914',
          'red-bright': '#FF3B30',
          'red-dim': 'rgba(229, 9, 20, 0.15)',
          'grey-dim': '#666680',
          'grey-muted': '#8888A0',
          'grey-light': '#E0E0E0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'red-glow': '0 4px 20px rgba(229, 9, 20, 0.35)',
        'red-glow-lg': '0 6px 24px rgba(229, 9, 20, 0.55)',
        'glass': '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
