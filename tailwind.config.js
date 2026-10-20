/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Tweak in M6 (tag-style) and M8 (due-tint)
        feature: '#10B981', // emerald
        bug: '#DC2626',     // crimson
        brand: { 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5' },
        surface: { base: '#fafafa', raised: '#ffffff', muted: '#f4f4f5' },
        border: { subtle: '#e4e4e7' },
        text: { primary: '#18181b', muted: '#71717a' },
        type: { feature: '#8b5cf6', bug: '#ef4444' },
        stage: { todo: '#dbeafe', progress: '#ddd6fe', review: '#fed7aa', done: '#bbf7d0' },
        due: { warning: '#fef3c7', alarm: '#fecaca', done: '#f4f4f5' },
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
