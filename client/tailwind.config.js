/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        event: '#ffd700',
        command: '#87ceeb',
        aggregate: '#ffb6c1',
        context: '#98fb98',
      },
    },
  },
  plugins: [],
}
