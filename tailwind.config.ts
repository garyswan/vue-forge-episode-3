module.exports = {
  content : ['node_modules/daisyui/**/*.{js,jsx,ts,tsx}'],
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  theme: {
    extend: {
      transitionProperty: {
        'size': 'height,min-height,max-height,width,min-width,max-width',
        'height': 'height,min-height,max-height',
        'spacing': 'margin, padding',
      }
    }
  }
};
