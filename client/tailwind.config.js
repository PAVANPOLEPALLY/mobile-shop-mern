/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#dbe8ff",
          500: "#1e6de8",
          700: "#16489f",
          900: "#0f1f3d"
        }
      }
    }
  },
  plugins: []
};
