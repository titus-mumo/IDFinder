/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {
        width: {
          '70':'70px',
          '100': '100px',
          '200': '200px',
          '250': '250px',
          '400': '400px',
          '500': '500px',
          '1000': '1000px',
        }
      },
    },
    plugins: [],
  }