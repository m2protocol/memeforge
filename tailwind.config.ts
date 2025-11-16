import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#738ebd",
        'cartoon-bg': "#f5f7fa",
        'cartoon-dark': "#2d3748",
        'cartoon-accent': "#fbbf24",
      },
      fontFamily: {
        logo: ["CCBattleScarredOpen", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
