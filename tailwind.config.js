/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        accent: '#e040fb',
        secondary: '#7c4dff',
        surface: '#151520',
        surface2: '#1e1e2e',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
}
