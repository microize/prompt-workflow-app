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
        // App theme colors
        primary: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          200: '#a6c8fa',
          300: '#79adf8',
          400: '#4d92f7',
          500: '#4285f4', // Primary blue
          600: '#3367d6',
          700: '#2a56c6',
          800: '#1e47b5',
          900: '#0d2f91',
        },
        secondary: {
          50: '#fef7e0',
          100: '#feefc3',
          200: '#fee082',
          300: '#fdd14a',
          400: '#fcc934',
          500: '#fbbc04', // Warning/star yellow
          600: '#f9a825',
          700: '#f57f17',
          800: '#ef6c00',
          900: '#e65100',
        },
        success: {
          50: '#e6f4ea',
          100: '#ceead6', 
          500: '#137333',
        },
        danger: {
          500: '#ea4335',
        },
        purple: {
          50: '#fce8ff',
          100: '#f8d0fe',
          500: '#a142f4',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#5f6368',
          700: '#3c4043',
          800: '#202124',
          900: '#171717',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(60, 64, 67, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(60, 64, 67, 0.1), 0 1px 2px 0 rgba(60, 64, 67, 0.06)',
        'md': '0 4px 6px -1px rgba(60, 64, 67, 0.1), 0 2px 4px -1px rgba(60, 64, 67, 0.06)',
        'lg': '0 10px 15px -3px rgba(60, 64, 67, 0.1), 0 4px 6px -2px rgba(60, 64, 67, 0.05)',
        'xl': '0 20px 25px -5px rgba(60, 64, 67, 0.1), 0 10px 10px -5px rgba(60, 64, 67, 0.04)',
        'dropdown': '0 2px 5px 0 rgba(60, 64, 67, 0.2)',
        'modal': '0 5px 15px rgba(0, 0, 0, 0.1)',
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