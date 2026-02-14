/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* 60% - Dark base (hero, navbar, footer) - named "brand" to avoid Tailwind dark: conflict */
        brand: {
          DEFAULT: '#0c1222',
          card: '#111827',
          hover: '#1a2332',
        },
        /* 30% - Accent | 10% - Light for CTAs */
        /* Electric accent - primary CTA, glow, links */
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          glow: 'rgba(34, 211, 238, 0.4)',
        },
        /* Secondary - violet for variety */
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.06), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -15px rgba(0, 0, 0, 0.1), 0 4px 20px -4px rgba(34, 211, 238, 0.15)',
        'glow': '0 0 30px -5px rgba(34, 211, 238, 0.35), 0 0 60px -15px rgba(34, 211, 238, 0.2)',
        'glow-sm': '0 0 20px -5px rgba(34, 211, 238, 0.3)',
        'focus': '0 0 0 3px rgba(34, 211, 238, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
