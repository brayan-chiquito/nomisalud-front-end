/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#185FA5',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          600: '#185FA5',
          700: '#1D4ED8',
          800: '#1e40af',
        },
        success: { DEFAULT: '#16A34A', light: '#DCFCE7', text: '#166534' },
        warning: { DEFAULT: '#D97706', light: '#FEF3C7', text: '#92400E' },
        danger: { DEFAULT: '#DC2626', light: '#FEE2E2', text: '#991B1B' },
        info: { DEFAULT: '#7C3AED', light: '#EDE9FE', text: '#5B21B6' },
        neutral: { DEFAULT: '#6B7280', light: '#F3F4F6', text: '#374151' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        card: '0.75rem',
        badge: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
