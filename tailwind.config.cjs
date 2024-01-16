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
        white: "var(--white)",
        orange: "var(--orange)",
        cyan: "var(--cyan)",
        gray: "var(--gray)",
        skeleton: "var(--skeleton)",
        border: "var(--border-clr)",
        disabled: "var(--clr-disabled)",
        input: "var(--input-clr)",
        tertiary: "var(--clr-tertiary)",
        "border-tertiary": "var(--border-clr-tertiary)",
      },
      backgroundColor: {
        base: "var(--bg-base)",
        "base-reversed": "var(--clr-base)",
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        "secondary-hover": "var(--bg-secondary-hover)",
        green: "var(--green)",
        skeleton: "var(--skeleton)",
        hover: "var(--bg-hover)",
        card: "var(--bg-card)",
        border: "var(--border-clr)",
        input: "var(--input-bg)",
        tertiary: "var(--bg-tertiary)",
      },
      fontSize: {
        default: "0.875rem",
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
      fontFamily: {
        logo: ["logo", "sans-serif"],
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

      // Add heading classes
      const headingClasses = {};
      const headingFontSizeLetterSpacingMap = {
        /* h1 */ "4xl": "-0.049375rem",
        /* h2 */ "3xl": "-0.020625rem",
        /* h3 */ "2xl": "-0.029375rem",
        /* h4 */ xl: "-0.029375rem",
      };
      Object.entries(headingFontSizeLetterSpacingMap).forEach(
        (entry, i) =>
          (headingClasses[`.h${i + 1}`] = {
            fontSize: theme(`fontSize.${entry[0]}`),
            letterSpacing: entry[1],
            fontWeight: "700",
          })
      );

      addUtilities({ ...textColorClasses, ...headingClasses });
    }),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"),

    // require("@tailwindcss/forms"),
  ],
};

module.exports = config;
