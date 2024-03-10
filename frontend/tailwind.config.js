/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cyan: {
          '100': '#58e9be',
          '200': '#53e1b7',
          '300': '#4ddab0',
          '400': '#48d2a8',
          '500': '#42caa1',
          '600': '#3dc39a',
          '700': '#47d7ac',
          '800': '#31b48d',
          '900': '#25a57f'
        }
      },
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

