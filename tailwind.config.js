/** @type {import('tailwindcss').Config} */
const base = require('daisyui/dist/base');
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#A5C12A',
          accent: '#0c1012',
          'accent-content': '#f2f2f2',
          'base-100': '#FFFFFF',
          'base-content': '#202020',
          success: '#07bc0c',
          warning: '#f1c40f',
          info: '#0275d8',
          error: '#e74c3c',

          '--rounded-box': '0.3rem', // border radius rounded-box utility class, used in card and other large boxes
          '--rounded-btn': '0.3rem', // border radius rounded-btn utility class, used in buttons and similar element
          '--rounded-badge': '1.9rem', // border radius rounded-badge utility class, used in badges and similar
          '--animation-btn': '0.25s', // duration of animation when you click on button
          '--animation-input': '0.2s', // duration of animation for inputs like checkbox, toggle, radio, etc
          '--btn-text-case': 'uppercase', // set default text transform for buttons
          '--btn-focus-scale': '0.95', // scale transform of button when you focus on it
          '--border-btn': '1px', // border width of buttons
          '--tab-border': '1px', // border width of tabs
          '--tab-radius': '0.5rem', // border radius of tabs
        },
        dark: {
          primary: '#A5C12A',
          'primary-content': '#ffffff',
          accent: '#0c1012',
          'base-100': '#000000',
          'base-200': '#020303',
          'base-content': '#f7f7f7',
          success: '#07bc0c',
          warning: '#f1c40f',
          info: '#0275d8',
          error: '#e74c3c',

          '--rounded-box': '0.3rem', // border radius rounded-box utility class, used in card and other large boxes
          '--rounded-btn': '0.3rem', // border radius rounded-btn utility class, used in buttons and similar element
          '--rounded-badge': '1.9rem', // border radius rounded-badge utility class, used in badges and similar
          '--animation-btn': '0.25s', // duration of animation when you click on button
          '--animation-input': '0.2s', // duration of animation for inputs like checkbox, toggle, radio, etc
          '--btn-text-case': 'uppercase', // set default text transform for buttons
          '--btn-focus-scale': '0.95', // scale transform of button when you focus on it
          '--border-btn': '1px', // border width of buttons
          '--tab-border': '1px', // border width of tabs
          '--tab-radius': '0.5rem', // border radius of tabs
        },
      },
    ],
  },
  theme: {
    extend: {
      keyframes: {
        grow: {
          '0%': {
            transform: 'scale(0)',
            opacity: 0,
          },
          '5%': {
            transform: 'scale(0.1)',
            opacity: 1,
          },
          '25%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '95%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 0,
          },
        },
        showText: {
          '0%': { opacity: 0 },
          '20%': { opacity: 0 },
          '25%': { opacity: 1 },
          '100%': { opacity: 1 },
        },
      },
      fontFamily: {
        sans: ['var(--montserrat-font)', ...fontFamily.sans],
      },
    },
  },
  plugins: [require('daisyui')],
};
