import daisyui from "daisyui";
import flowbitePlugin from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'disabled-bg': '#f472b6',
      },
      fontFamily: {
        julius: ['"Julius Sans One"', "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#db2777",
          secondary: "#be185d",
          accent: "#f5f5f4",
          neutral: "#ff00ff",
          "base-100": "#121212",
          info: "#0000ff",
          success: "#00ff00",
          warning: "#00ff00",
          error: "#ff0000",
          "disabled-bg": "#f472b6"
        },
      },
    ],
  },
  plugins: [ daisyui],
};
