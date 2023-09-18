/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      fontFamily: {
        copperplate: ['Copperplate'],
        courierPrime: ['Courier Prime'],
      },
      screens: {
        xxs: '300px',
        xs: '375px',
        xms: '425px',
        slg: '850px',
        '3xl': '1800px',
      },
      colors: {
        gray: {
          100: '#e6e6e6',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        blue: {
          100: '#ebf8ff',
          200: '#bee3f8',
          300: '#90cdf4',
          400: '#63b3ed',
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
          800: '#2c5282',
          900: '#2a4365',
        },
        orange: {
          100: '#ff3031',
          200: '#ff914d',
        },
        black: {
          100: '#000000',
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
