import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      perspective: {
        '1000': '1000px',
      },
      transitionProperty: {
        'transform': 'transform',
      },
      backdropBlur: {
        xs: '2px',
      },
      scale: {
        '102': '1.02',
      },
      backgroundColor: {
        'white-95': 'rgba(255, 255, 255, 0.95)',
      },
      borderColor: {
        'white-50': 'rgba(255, 255, 255, 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config;
