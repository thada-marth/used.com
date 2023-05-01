/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        gridTemplateRows: {
          '[auto,auto,1fr]': 'auto auto 1fr',
        },
      },
      screens: {
        'xxl': '1440px',
        'xl': '1280px',
        'lg': '1024px',
        'md': '768px',
        'sm': '640px',
        'xs': '475px',
        'xxs': '300px',
        'xxxs': '200px',
      },
    },
  plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
}