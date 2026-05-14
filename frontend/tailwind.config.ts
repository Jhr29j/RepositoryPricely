import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#7B1728',
          dark:    '#5A0F1B',
          light:   '#A01E32',
          soft:    '#F5E8EA',
        },
        gold: '#C9A84C',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '14px',
        sm:      '8px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(123,23,40,0.10)',
        lg:   '0 8px 40px rgba(123,23,40,0.18)',
      },
    },
  },
  plugins: [],
}

export default config