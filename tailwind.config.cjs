const sizes = {
  '1': '8px',
  
  '1.5': '12px',

  '2': '16px',

  '2.5': '20px',

  '3': '24px',

  '3.5': '28px',

  '4': '32px',

  '4.5': '36px',

  '5': '40px',

  '5.5': '44px',

  '6': '48px',
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      padding: sizes,
      height: sizes,
      gap: sizes
    },
  },
  plugins: [],
};
