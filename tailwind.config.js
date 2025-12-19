/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'float-delay': {
          '0%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.15' }
        },
        'pulse-slower': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float-delay 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'pulse-slower': 'pulse-slower 6s ease-in-out infinite',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      perspective: {
        'none': 'none',
        '500': '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
      backfaceVisibility: {
        'visible': 'visible',
        'hidden': 'hidden',
      },
      transitionDuration: {
        '800': '800ms',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
          '-webkit-transform-style': 'preserve-3d',
        },
        '.perspective-1000': {
          'perspective': '1000px',
          '-webkit-perspective': '1000px',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          'transform': 'rotateY(180deg)',
        },
        '.rotate-y-0': {
          'transform': 'rotateY(0deg)',
        },
        '.translate-z-1': {
          'transform': 'translateZ(1px)',
        }
      });
    }
  ],
} 