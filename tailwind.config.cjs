const plugin = require("tailwindcss/plugin");

/**
 * @typedef {Object} TailwindPluginModification
 * @property {string} [key] - An object with string keys and string values
 */

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--clr-base)",
        "base-reversed": "var(--bg-base)",
        primary: "var(--clr-primary)",
        secondary: "var(--clr-secondary)",
        red: "var(--red)",
        green: "var(--green)",
        yellow: "var(--yellow)",
        blue: "var(--blue)",
        purple: "var(--purple)",
        weiss: "var(--weiss)",
        schwarz: "var(--schwarz)",
        orange: "var(--orange)",
        cyan: "var(--cyan)",
        gray: "var(--gray)",
        skeleton: "var(--skeleton)",
        border: "var(--border-clr)",
        disabled: "var(--clr-disabled)",
        input: "var(--input-clr)",
        tertiary: "var(--clr-tertiary)",
        "border-tertiary": "var(--border-clr-tertiary)",
        grayD: "var(--gray-d)",
        "dark-blue": "var(--dark-blue)",
        "dark-yellow": "var(--dark-yellow)",
      },
      backgroundColor: {
        base: "var(--bg-base)",
        "base-reversed": "var(--clr-base)",
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        "secondary-hover": "var(--bg-secondary-hover)",
        green: "var(--green)",
        skeleton: "var(--skeleton)",
        hover: "var(--main-hover)",
        card: "var(--bg-card)",
        border: "var(--border-clr)",
        tertiary: "var(--bg-tertiary)",
        grayD: "var(--gray-d)",
        weiss: "var(--weiss)",
        schwarz: "var(--schwarz)",
        "dark-blue": "var(--dark-blue)",
        "dark-yellow": "var(--dark-yellow)",
      },
      fontSize: {
        md: "clamp(1rem, 0.9308rem + 0.3077vw, 1.2rem)",
        default: "0.875rem",
        sm: "clamp(0.8rem, 0.7654rem + 0.1538vw, 0.9rem)",
        xs: "clamp(0.7rem, 0.6923rem + 0.1538vw, 0.8rem)",
      },
      zIndex: {
        modal: 50,
        dropdown: 49,
        layout: 48,
        tooltip: 47,
        pageBreak: 46,
        a4: 45,
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      // Rewrite text color class prefix to "clr-":
      const colors = theme("colors") || {};

      const textColorClasses = {};
      for (const [name, color] of Object.entries(colors)) {
        textColorClasses[`.clr-${name}`] = { color };
      }

      addUtilities(textColorClasses);
    }),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),

    // require("@tailwindcss/forms"),
  ],
};

module.exports = config;
