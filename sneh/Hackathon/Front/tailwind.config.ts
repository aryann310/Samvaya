import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#0B0C0F',
          900: '#11141A',
          800: '#1B2028',
          700: '#252C37',
          600: '#323A46',
          500: '#4A5565',
          400: '#7E8A99',
          300: '#A4B0BE',
          200: '#C7D1DC',
          100: '#DFE6EF',
          50: '#F0F4F8',
        },
        primary: {
          DEFAULT: '#7E8A99',
          light: '#A4B0BE',
          dark: '#323A46',
          50: '#F4F7FA',
          100: '#DFE6EF',
          200: '#C7D1DC',
          300: '#A4B0BE',
          400: '#8E9BAA',
          500: '#7E8A99',
          600: '#5C6775',
          700: '#323A46',
          800: '#1B2028',
          900: '#0B0C0F',
        },
        accent: {
          DEFAULT: '#38BDF8',
          glow: '#0284C7',
          gold: '#EAB308',
          emerald: '#10B981',
        },
        background: '#0B0C0F',
        surface: '#1B2028',
        'surface-elevated': '#232A35',
        'surface-highlight': '#323A46',
        charcoal: '#DFE6EF',
        'body-text': '#A4B0BE',
        border: '#323A46',
        success: {
          DEFAULT: '#10B981',
          light: '#064E3B',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#78350F',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#7F1D1D',
        },
        info: {
          DEFAULT: '#38BDF8',
          light: '#0C4A6E',
        },
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(31, 42, 36, 0.05)',
        'warm-md': '0 4px 6px -1px rgba(31, 42, 36, 0.07), 0 2px 4px -2px rgba(31, 42, 36, 0.05)',
        'warm-lg': '0 10px 15px -3px rgba(31, 42, 36, 0.07), 0 4px 6px -4px rgba(31, 42, 36, 0.05)',
        'warm-xl': '0 20px 25px -5px rgba(31, 42, 36, 0.07), 0 8px 10px -6px rgba(31, 42, 36, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
