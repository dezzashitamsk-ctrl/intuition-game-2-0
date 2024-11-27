import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      perspective: {
        '1000': '1000px',
      },
      transitionProperty: {
        'transform': 'transform',
      },
    },
  },
  plugins: [],
} satisfies Config;
