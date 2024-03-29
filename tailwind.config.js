/* eslint-disable quote-props */
/* eslint-disable global-require */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
      colors: {
        'primary-blue-plutus': '#5E81F4',
        'primary-dark-plutus': '#1C1D21',
        'primary-grey-plutus': '#8181A5',
        'outline-grey-plutus': '#F0F0F3',
        'secondary-pink-plutus': '#FF808B',
        'skyblue-plutus': '#EEF2FE',
        'lightgrey-plutus': '#F6F6F6',
        'background-lightgrey-plutus': '#F5F5FA',
      },
      lineHeight: {
        '11half': '2.65rem',
      },
      backgroundImage: {
        'gradient-radial-plutus': 'radial-gradient(98.58% 98.58% at 57.43% 48.15%, #5E81F4 0%, #1B51E5 100%)',
      },
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gridRow: {
        'span-10': 'span 10 / span 10',
        'span-11': 'span 11 / span 11',
        'span-12': 'span 12 / span 12',
      },
      gridRowEnd: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
      },
      gridTemplateColumns: {
        'custom-sidenav-layout': 'auto 1fr',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')({
    strategy: 'class',
  })],
};
