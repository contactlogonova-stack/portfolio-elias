import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eef6',
          100: '#c5d4e8',
          200: '#9fb8d9',
          300: '#789bc9',
          400: '#5a84be',
          500: '#1B3F6B',
          600: '#173861',
          700: '#122f54',
          800: '#0e2647',
          900: '#091a33',
        },
        accent: {
          50: '#e6f7ef',
          100: '#c1ebd7',
          200: '#97debb',
          300: '#6cd09f',
          400: '#4dc58a',
          500: '#2EAA6E',
          600: '#289962',
          700: '#208554',
          800: '#187146',
          900: '#0d5030',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config
