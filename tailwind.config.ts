import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './content/**/*.mdx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"PingFang SC"', '"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
};

export default config;
