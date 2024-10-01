import type { Config } from 'tailwindcss';
import tailwindcssanimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['selector', '[data-mantine-color-scheme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssanimate],
};
export default config;
