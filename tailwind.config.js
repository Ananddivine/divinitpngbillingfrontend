/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },  // Oversize
          '100%': { transform: 'scale(1)' },   // Back to normal
        },
      },
      animation: {
        scaleUp: 'scaleUp 0.5s ease-out',
        scaleBounce: 'scaleBounce 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
