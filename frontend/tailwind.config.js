/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bedc',
          400: '#619ecb',
          500: '#3b82b8',
          600: '#2b689a',
          700: '#23547d',
          800: '#204667',
          900: '#1e3c56',
          950: '#142738',
        },
        risk: {
          high: '#b91c1c',
          'high-bg': '#fef2f2',
          'high-border': '#fecaca',
          mod: '#b45309',
          'mod-bg': '#fffbeb',
          'mod-border': '#fde68a',
          low: '#047857',
          'low-bg': '#ecfdf5',
          'low-border': '#a7f3d0',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      }
    },
  },
  plugins: [],
}
