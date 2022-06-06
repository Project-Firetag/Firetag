module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./elements/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      libre: "Libre Baskerville",
      kdam: "Kdam Thmor Pro",
      poppins: "'Poppins'",
      dancing: "Dancing Script"
    },
    extend: {
      transitionTimingFunction: {
        squared: "cubic-bezier(1, 0, 0, 1)"
      }
    },
  },
  plugins: [],
}