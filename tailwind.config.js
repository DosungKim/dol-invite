/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#f8ecec',
        cream: '#fffaf2',
        rosewood: '#8f6c6c'
      },
      boxShadow: {
        card: '0 15px 45px -25px rgba(76, 47, 47, 0.35)'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Noto Sans KR"', 'sans-serif']
      }
    }
  },
  plugins: []
};
