import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#0f172a',
        primary: '#3b82f6',
        'primary-dark': '#1e40af',
        secondary: '#f3f4f6',
        'secondary-dark': '#e5e7eb',
      },
    },
  },
  plugins: [],
};

export default config;
