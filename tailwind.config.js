module.exports = {
  purge: ["./resources/views/*.ejs", "./resources/views/**/*.ejs"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      padding: "2rem",
    },
    screens: {
      sm: "567px",

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 1024px) { ... }

      xl: "1200px",
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      colors: {
        primary: "#fe5f1e",
        primaryHover: "#fb5607",
        secondary: "#f1f3f6",
        secondaryDefault: "#f8f8f8",
        pure: "#fff",
        dark: "#232323",
        facebook: "#395697",
        amber200: "#FDE68A",
        amber600: "#D97706",
        orange200: "#FED7AA",
        orange600: "#EA580C",
        yellow200: "#FEF08A",
        yellow600: "#CA8A04",
        blue: "#F5FAFF",
        footerBg: "#222E39",
      },
    },
  },
  fontFamily: {
    body: ["Roboto", "sans-serif"],
  },

  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
