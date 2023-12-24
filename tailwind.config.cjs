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
      animation: {
        pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        jiggle: "jiggle 0.3s ease-in-out infinite",
        shake: "shake 1s cubic-bezier(.36,.07,.19,.97) both infinite",
        "rotate-full": "rotate-full 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "rotate-y-circle":
          "rotate-y-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite",
      },
      keyframes: {
        "rotate-y-circle": {
          "0%, 100%": {
            animationTimingFunction: "cubic-bezier(0.5, 0, 1, 0.5)",
            transform: "rotateY(0deg)",
          },
          "50%": {
            transform: "rotateY(1800deg)",
            animationTimingFunction: "cubic-bezier(0, 0.5, 0.5, 1)",
          },
          "100%": {
            transform: "rotateY(3600deg)",
          },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(1px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-1px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(1px, 0, 0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        jiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "rotate-full": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
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
    // require("@tailwindcss/forms"),
  ],
};

module.exports = config;
