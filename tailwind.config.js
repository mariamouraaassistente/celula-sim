/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#06101e',
          900: '#0b1626',
          800: '#0f1f33',
          700: '#152a44',
          600: '#1c3a5c',
        },
        bio: {
          mint: '#7af2c6',
          teal: '#14b8a6',
          aqua: '#22d3ee',
          violet: '#a78bfa',
          coral: '#fb7185',
          amber: '#f59e0b',
          lime: '#bef264',
        },
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(34, 211, 238, 0.45)',
        soft: '0 10px 30px -12px rgba(2, 6, 23, 0.45)',
      },
      backgroundImage: {
        'radial-fade':
          'radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(2,6,23,0.85) 70%, rgba(2,6,23,0.95) 100%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
