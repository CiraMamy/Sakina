/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sakina: {
          50: '#F7F5F2',
          100: '#F5EFE6',
          200: '#E6DFF5',
          300: '#A7C7E7',
          400: '#C9E8D2',
          500: '#7BA9D8',
          600: '#5A8BBD',
          700: '#24313A',
          800: '#2E4057',
        },
      },
      boxShadow: {
        soft: '0 12px 30px rgba(36, 49, 58, 0.08)',
      },
    },
  },
  plugins: [],
}
