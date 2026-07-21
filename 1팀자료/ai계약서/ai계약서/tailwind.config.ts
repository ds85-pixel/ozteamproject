import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4B82F4',
          dark: '#3563D6',
          darker: '#274999',
          light: '#EAF0FF',
          tint: '#F5F8FF'
        },
        ink: {
          DEFAULT: '#12142B',
          soft: '#454863'
        },
        muted: '#767B99',
        canvas: '#F4F6FC',
        risk: {
          high: '#E24C4B',
          highBg: '#FDECEC',
          medium: '#EF9D2E',
          mediumBg: '#FCF2E2',
          low: '#1FA97A',
          lowBg: '#E7F7F0'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif']
      },
      borderRadius: {
        xl2: '1.75rem',
        card: '1.25rem'
      },
      boxShadow: {
        card: '0 2px 8px rgba(18, 20, 43, 0.05), 0 1px 2px rgba(18, 20, 43, 0.04)',
        cardHover: '0 12px 32px rgba(75, 130, 244, 0.16)',
        floating: '0 24px 64px rgba(18, 20, 43, 0.14)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        dash: {
          '0%': { strokeDashoffset: '283' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
