const withMT = require("@material-tailwind/html/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbeb',
          100: '#fbf7c7',
          200: '#f7ee8c',
          300: '#f2dd4c',
          400: '#eecf23',
          500: '#dfb23f', // Our branding gold
          600: '#b88514',
          700: '#936010',
          800: '#774c11',
          900: '#623e12',
          950: '#392105',
        }
      }
    },
  },
  plugins: [],
});
