/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5' },
        surface: { raised: '#ffffff', muted: '#f4f4f5' },
        border: { subtle: '#e4e4e7' },
        text: { primary: '#18181b', muted: '#71717a' },
        type: {
          feature: '#8b5cf6',   // violet-500
          bug:     '#ef4444',   // red-500
        },
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
