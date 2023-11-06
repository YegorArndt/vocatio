// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

/**
 * @typedef {Object} TailwindPluginModification
 * @property {string} [key] - An object with string keys and string values
 */

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "up-lg": { min: "942px" },
      "down-lg": { max: "940px" },
      "up-md": { min: "913px" },
      "down-md": { max: "539px" },
      "up-sm": { min: "551px" },
      "down-sm": { max: "324px" },
      "up-desktop": { min: "1281px" },
      "down-desktop": { max: "1279px" },
      "up-tablet": { min: "821px" },
      "down-tablet": { max: "767px" },
      "up-phone": { min: "421px" },
      "down-phone": { max: "299px" },
      phone: { min: "300px", max: "420px" },
      tablet: { min: "768px", max: "820px" },
      sm: { min: "325px", max: "550px" },
      md: { min: "540px", max: "912px" },
    },
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
      },
      backgroundColor: {
        base: "var(--bg-base)",
        "base-reversed": "var(--clr-base)",
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        "secondary-hover": "var(--bg-secondary-hover)",
        green: "var(--green)",
      },
      fontSize: {
        default: "clamp(0.75rem, 0.7232rem + 0.1429vw, 0.875rem)",
        medium: "clamp(0.875rem, 0.8310rem + 0.2167vw, 1rem);",
      },
      zIndex: {
        layout: "100",
        dropdown: "200",
        tooltip: "300",
        overlay: "400",
        fixed: "500",
        modal: "600",
        0: "0",
        1: "1",
        50: "50",
        150: "150",
        250: "250",
        350: "350",
        450: "450",
        550: "550",
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
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      // Rewrite text color class prefix to "clr-":
      const colors = theme("colors");
      const textColorClasses = {};
      // output: { ".clr-base": { color: "var(--clr-base)" } }
      // usage: <p className="clr-base">...</p>
      // @ts-ignore
      for (const [name, color] of Object.entries(colors)) {
        // @ts-ignore
        textColorClasses[`.clr-${name}`] = {
          color,
        };
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
          // @ts-ignore
          (headingClasses[`.h${i + 1}`] = {
            fontSize: theme(`fontSize.${entry[0]}`),
            letterSpacing: entry[1],
            fontWeight: "700",
          })
      );

      addUtilities({ ...textColorClasses, ...headingClasses });
    }),
  ],
};

module.exports = config;
