/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        // Korean-inspired soft lavender theme
        primary: {
          50: '#f3f0ff',
          100: '#e9e3ff',
          200: '#d4c6ff',
          300: '#baa7ff',
          400: '#a189fc',
          500: '#8869fa', // Primary lavender
          600: '#7551e5',
          700: '#6240c8',
          800: '#5235a7',
          900: '#432c85',
        },
        secondary: {
          50: '#fff8f2',
          100: '#fff0e6',
          200: '#ffdec8',
          300: '#ffc4a3',
          400: '#ffa371',
          500: '#ff8c4f', // Soft orange
          600: '#f97435',
          700: '#ea5e2d',
          800: '#cc4522',
          900: '#a83a1d',
        },
        success: {
          50: '#ecfdf3',
          100: '#d1fadf',
          200: '#a5f2c0',
          300: '#6ee7a0',
          400: '#30d67b',
          500: '#10b964', // Soft green
          600: '#0a9654',
          700: '#0c7645',
          800: '#095e39',
          900: '#064c2f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Soft red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Deep purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        neutral: {
          50: '#f9f9fb',
          100: '#f4f3f8',
          200: '#e9e8f0',
          300: '#dcdbeb',
          400: '#c8c7d7',
          500: '#a5a3b8',
          600: '#787692',
          700: '#5e5c74',
          800: '#46455a',
          900: '#333240',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(98, 64, 200, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(98, 64, 200, 0.1), 0 1px 2px 0 rgba(98, 64, 200, 0.06)',
        'md': '0 4px 6px -1px rgba(98, 64, 200, 0.1), 0 2px 4px -1px rgba(98, 64, 200, 0.06)',
        'lg': '0 10px 15px -3px rgba(98, 64, 200, 0.1), 0 4px 6px -2px rgba(98, 64, 200, 0.05)',
        'xl': '0 20px 25px -5px rgba(98, 64, 200, 0.1), 0 10px 10px -5px rgba(98, 64, 200, 0.04)',
        'dropdown': '0 2px 5px 0 rgba(98, 64, 200, 0.2)',
        'modal': '0 5px 15px rgba(98, 64, 200, 0.1)',
      },
      // Custom animation
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}