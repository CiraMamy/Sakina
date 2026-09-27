/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sakina: {
          50: '#F2F7FD',
          100: '#E8F1F8',
          200: '#D0E8F5',
          300: '#B7D8F2',
          400: '#8FB9E7',
          500: '#7BA9D8',
          600: '#5A8BBD',
          700: '#436C9B',
          800: '#2E4057',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(123, 169, 216, 0.14)',
      },
    },
  },
  plugins: [],
}
