/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FFFBF7',
          100: '#FFF5EE',
          200: '#FFE8D6',
          300: '#FFD4B8',
        },
        coral: {
          400: '#FF7E67',
          500: '#FF6B4A',
          600: '#E85A3A',
        },
        sage: {
          400: '#6BBF8A',
          500: '#4A9B6E',
          600: '#3D8260',
        },
        lavender: {
          400: '#B8A4E8',
          500: '#9B82DC',
        },
        electric: {
          50:  '#EEF6FF',
          100: '#DBEEFF',
          200: '#A8D8FF',
          300: '#60B3FF',
          400: '#2196F3',
          500: '#0E7AE6',
          600: '#0057CC',
          700: '#0041A8',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'base': ['20px', { lineHeight: '1.5' }],
        'lg':   ['22px', { lineHeight: '1.5' }],
        'xl':   ['26px', { lineHeight: '1.4' }],
        '2xl':  ['30px', { lineHeight: '1.3' }],
        '3xl':  ['36px', { lineHeight: '1.2' }],
        '4xl':  ['44px', { lineHeight: '1.1' }],
      },
      animation: {
        'aurora': 'auroraShift 12s ease-in-out infinite',
        'pulse-warmth': 'warmthPulse 2.4s ease-in-out infinite',
        'breathe-in':   'breatheScale 4s ease-in-out forwards',
        'breathe-hold': 'breatheHold 4s ease-in-out forwards',
        'breathe-out':  'breatheScale 4s ease-in-out reverse forwards',
        'fade-in':      'fadeIn 0.6s ease-out forwards',
        'mic-pulse':    'micPulse 1.5s ease-in-out infinite',
        'slide-up':     'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        auroraShift: {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(25deg)' },
        },
        warmthPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.85' },
        },
        breatheScale: {
          '0%':   { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.3)' },
        },
        breatheHold: {
          '0%, 100%': { transform: 'scale(1.3)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        micPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,74,0.4)' },
          '50%':      { boxShadow: '0 0 0 20px rgba(255,107,74,0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
