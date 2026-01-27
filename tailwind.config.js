/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#e8d5ea',
        background: '#faf9fa',
        foreground: '#1F2937',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        primary: {
          50: '#faf8fb',
          100: '#f4f1f6',
          200: '#e8d5ea',
          300: '#d8b4db',
          400: '#c388ca',
          500: '#af62b8',
          600: '#9a4da9',
          700: '#7f3c8a',
          800: '#6b3272',
          900: '#391b49',
        },
        secondary: {
          50: '#faf9fa',
          100: '#f8f4f9',
          200: '#f0e8f2',
          300: '#e8dce9',
          400: '#dccadf',
          500: '#cfb8d4',
          600: '#b89cc1',
          700: '#9c7ba4',
          800: '#7d6186',
          900: '#2d1538',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}