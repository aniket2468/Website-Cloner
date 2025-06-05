import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Orchid-inspired dark theme palette
        orchid: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        dark: {
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
          950: '#020617',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'orchid-gradient': 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #6366f1 100%)',
        'orchid-dark': 'linear-gradient(135deg, #701a75 0%, #4c1d95 50%, #312e81 100%)',
        'neural-net': `
          radial-gradient(circle at 20% 80%, rgba(217, 70, 239, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
        `,
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'wave': 'wave 2.5s ease-in-out infinite',
        'orchid-pulse': 'orchid-pulse 3s ease-in-out infinite',
        'neural-flow': 'neural-flow 8s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
        'particle-float': 'particle-float 4s ease-in-out infinite',
        'progress-fill': 'progress-fill 2s ease-out forwards',
        'loading-dots': 'loading-dots 1.4s ease-in-out infinite',
        'morph': 'morph 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glow: {
          '0%': { 'box-shadow': '0 0 20px rgba(217, 70, 239, 0.4)' },
          '100%': { 'box-shadow': '0 0 40px rgba(217, 70, 239, 0.8)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
        },
        'orchid-pulse': {
          '0%, 100%': { 
            'box-shadow': '0 0 0 0 rgba(217, 70, 239, 0.7)',
            transform: 'scale(1)'
          },
          '50%': { 
            'box-shadow': '0 0 0 20px rgba(217, 70, 239, 0)',
            transform: 'scale(1.05)'
          },
        },
        'neural-flow': {
          '0%, 100%': { 
            transform: 'translateX(0) translateY(0) rotate(0deg)',
            opacity: '0.6'
          },
          '33%': { 
            transform: 'translateX(30px) translateY(-15px) rotate(120deg)',
            opacity: '1'
          },
          '66%': { 
            transform: 'translateX(-20px) translateY(25px) rotate(240deg)',
            opacity: '0.8'
          },
        },
        'text-shimmer': {
          '0%': { 'background-position': '200% center' },
          '100%': { 'background-position': '-200% center' },
        },
        'particle-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) scale(1)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'translateY(-30px) scale(1.1)',
            opacity: '1'
          },
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'loading-dots': {
          '0%, 80%, 100%': { 
            transform: 'scale(0)',
            opacity: '0.5'
          },
          '40%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
        },
        'morph': {
          '0%, 100%': { 
            'border-radius': '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'rotate(0deg)'
          },
          '50%': { 
            'border-radius': '30% 60% 70% 40% / 50% 60% 30% 60%',
            transform: 'rotate(180deg)'
          },
        },
      },
      boxShadow: {
        'orchid': '0 10px 25px -5px rgba(217, 70, 239, 0.1), 0 4px 10px -2px rgba(217, 70, 239, 0.05)',
        'orchid-lg': '0 20px 50px -10px rgba(217, 70, 239, 0.25), 0 10px 20px -5px rgba(217, 70, 239, 0.1)',
        'inner-orchid': 'inset 0 2px 4px 0 rgba(217, 70, 239, 0.1)',
        'glow-orchid': '0 0 20px rgba(217, 70, 239, 0.3), 0 0 40px rgba(217, 70, 239, 0.1)',
        'neural': '0 0 100px rgba(217, 70, 239, 0.1), 0 0 200px rgba(139, 92, 246, 0.05)',
      },
      blur: {
        'xs': '2px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
export default config; 