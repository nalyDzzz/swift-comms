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
    extend: {
      colors: {
        dark: {
          1: '#C9C9C9',
          2: '#b8b8b8',
          3: '#828282',
          4: '#696969',
          5: '#424242',
          6: '#3b3b3b',
          7: '#2e2e2e',
          8: '#242424',
          9: '#1f1f1f',
          10: '#141414',
        },
      },
    },
  },
  plugins: [tailwindcssanimate],
};
export default config;
