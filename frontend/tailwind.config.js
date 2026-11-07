/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        botanical: {
          forest: '#263D32',
          'forest-hover': '#1E3228',
          evergreen: '#192A23',
          'evergreen-deep': '#121F19',
          parchment: '#F5F0E5',
          'parchment-light': '#FAF7F0',
          surface: '#FFFDF8',
          cream: '#FFFDF8',
          'cream-card': '#FAF7F0',
          clay: '#A65F45',
          'clay-hover': '#8E4F39',
          'clay-light': '#F7EFEA',
          terracotta: '#A65F45',
          'terracotta-hover': '#8E4F39',
          'terracotta-light': '#F7EFEA',
          sand: '#D6C5A3',
          'sand-hover': '#C4B18D',
          'sand-light': '#FAF5EB',
          gold: '#D6C5A3',
          'gold-hover': '#C4B18D',
          'gold-light': '#FAF5EB',
          charcoal: '#292B27',
          muted: '#77736B',
          border: '#E2DAC7',
          'border-strong': '#D6C5A3',
          'border-dark': '#334D40',
        },
        primary: {
          DEFAULT: '#263D32',
          hover: '#192A23',
          light: '#FAF5EB',
        },
        clay: {
          DEFAULT: '#A65F45',
          hover: '#8E4F39',
          light: '#F7EFEA',
        },
        terracotta: {
          DEFAULT: '#A65F45',
          hover: '#8E4F39',
          light: '#F7EFEA',
        },
        sand: {
          DEFAULT: '#D6C5A3',
          hover: '#C4B18D',
          light: '#FAF5EB',
        },
        gold: {
          DEFAULT: '#D6C5A3',
          hover: '#C4B18D',
          light: '#FAF5EB',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(41, 43, 39, 0.05), 0 1px 2px 0 rgba(41, 43, 39, 0.03)',
        'card': '0 4px 16px -2px rgba(41, 43, 39, 0.06), 0 2px 4px -2px rgba(41, 43, 39, 0.03)',
        'elevated': '0 12px 30px -4px rgba(25, 42, 35, 0.12), 0 4px 8px -2px rgba(25, 42, 35, 0.04)',
        'gold': '0 4px 14px 0 rgba(195, 166, 107, 0.25)',
        'terracotta': '0 4px 14px 0 rgba(185, 111, 80, 0.25)',
      }
    },
  },
  plugins: [],
}
