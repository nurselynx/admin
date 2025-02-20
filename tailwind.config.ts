import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      backgroundColor: {
        "custom-semi-transparent": "#d9d9d933",
      },
      colors: {
        "lynx-blue": {
          100: "#4D6C9A",
          200: "#2E4B76",
          300: "#181818",
          400: "#121212",
          500: "#f6faff",
          700: "#EBF3FF",
        },
        "lynx-grey": {
          100: "#6A6F85",
          200: "#656F7E",
          300: "#FBFDFD",
          400: "#1B2428",
          500: "#202939",
          600: "#b8b8b8",
          700: "#747474",
          800: "#f6f9fe",
          900: "#C9C6C6",
          1000: "#C5C5C5",
          1100:"#949494",
          1200: "#202020",
          1300: "#cac6c3",
          1400: "#b0bdd2",
          1500: "#F5F6F7",
          1600: "#e2e1e1",
          1700: "#F9F9F9",
          1800: "#d3d3d3",
          1900: "#E8E8E8",
          2000: "#39404D"
        },
        "lynx-orange": {
          100: "#E86D65",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        tablet: { max: "1086px" },
        mintablet: { max: "786px" },
        xl: { max: "600px" },
        extra_sm: { max: "376px" },
      },
    },
  },
  plugins: [],
} satisfies Config;
