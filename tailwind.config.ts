import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1B2A4A',
        wine: '#722F37',
        cream: '#F5F0E8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
      },
      boxShadow: {
        'wine-glow': '0 4px 20px -4px rgba(114, 47, 55, 0.4)',
        'navy-glow': '0 4px 20px -4px rgba(27, 42, 74, 0.3)',
        'card-hover': '0 16px 48px rgba(27, 42, 74, 0.10)',
      },
    },
  },
  plugins: [],
}
export default config
