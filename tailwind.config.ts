import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7f5',
          100: '#dce5df',
          200: '#b5c9bb',
          300: '#8aab93',
          400: '#5e8c6a',
          500: '#1a2e1f',
          600: '#162718',
          700: '#121f14',
          800: '#0e1810',
          900: '#0a110b',
          950: '#050905',
        },
        secondary: {
          50: '#fafaf9',
          100: '#f3f2f0',
          200: '#e7e5e2',
          300: '#d4d0cb',
          400: '#b8b2aa',
          500: '#8a8279',
          600: '#6b635a',
          700: '#4a453f',
          800: '#2d2a26',
          900: '#1a1816',
        },
        gold: {
          300: '#e0c76e',
          400: '#c9a84c',
          500: '#b8942e',
          600: '#9a7b20',
          700: '#7c6318',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
