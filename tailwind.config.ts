import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7f7f6',
          900: '#111111',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
