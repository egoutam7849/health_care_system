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
        // Layered Enterprise Dark Palette
        dark: {
          canvas: '#09090B',    // Layer 1 — App Background
          shell: '#111827',     // Layer 2 — Workspace / Sidebar
          section: '#1E293B',   // Layer 3 — Content Section
          card: '#243447',      // Layer 4 — Card / Elevated Surface
          hover: '#334155',     // Layer 5 — Interactive Hover / Focus
        },
        // Text Palette
        txt: {
          primary: '#F8FAFC',   // Primary Heading / Core Text
          secondary: '#CBD5E1', // Subtitles / Labels
          muted: '#94A3B8',     // Secondary Details / Hints
          disabled: '#64748B',  // Inactive / Disabled
        },
        // Contextual Accent Palette
        accent: {
          blue: '#3B82F6',
          emerald: '#10B981',
          purple: '#8B5CF6',
          orange: '#F59E0B',
          red: '#EF4444',
          teal: '#14B8A6',
        },
        borderDark: 'rgba(255, 255, 255, 0.08)',
        health: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0c8de4',
          600: '#0270c1',
          900: '#0c3f6e',
          950: '#082849',
        },
        domain: {
          clinical: '#3b82f6',
          patient: '#10b981',
          finance: '#f59e0b',
          analytics: '#8b5cf6',
          infra: '#14b8a6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
