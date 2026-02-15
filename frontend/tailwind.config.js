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
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tight-display': '-0.02em',
        'tighter-display': '-0.03em',
      },
      colors: {
        brand: {
          DEFAULT: '#050a18',
          deep: '#030712',
          card: '#0f172a',
          hover: '#1e293b',
          surface: '#0a1128',
        },
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
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
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
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 4px 24px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-xl': '0 8px 40px -12px rgba(0, 0, 0, 0.08), 0 4px 16px -4px rgba(34, 211, 238, 0.12)',
        'card-hover': '0 12px 48px -16px rgba(0, 0, 0, 0.12), 0 4px 24px -8px rgba(34, 211, 238, 0.15)',
        'glow': '0 0 30px -5px rgba(34, 211, 238, 0.35), 0 0 60px -15px rgba(34, 211, 238, 0.2)',
        'glow-sm': '0 0 20px -5px rgba(34, 211, 238, 0.3)',
        'glow-indigo': '0 0 40px -10px rgba(99, 102, 241, 0.4)',
        'glow-violet': '0 0 40px -10px rgba(139, 92, 246, 0.4)',
        'focus': '0 0 0 3px rgba(34, 211, 238, 0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'cinematic': '0 25px 80px -20px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'scroll-indicator': 'scroll-indicator 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
