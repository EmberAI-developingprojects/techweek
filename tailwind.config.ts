// tailwind.config.mjs
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0f305a",     // bg-brand-navy
        },
      },
    },
  },
  plugins: [],
};
