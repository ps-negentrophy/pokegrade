import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#CC0000",
          "red-dark": "#9B0000",
          "red-light": "#FF3333",
          yellow: "#FFCB05",
          "yellow-dark": "#D4A800",
          blue: "#3B4CCA",
          "blue-light": "#6070E0",
        },
        grade: {
          gem: "#FFD700",  // PSA 10 / BGS 10
          pristine: "#C0C0C0",
          excellent: "#CD7F32",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
