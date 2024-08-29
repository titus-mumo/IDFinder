/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {
        width: {
          '100': '100px',
          '200': '200px',
          '250': '250px',
          '400': '400px',
        }
      },
    },
    plugins: [],
  }