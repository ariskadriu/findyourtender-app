import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1A3A6B",
        gold: "#F0A500",
        blue: "#2D6BE4",
        "light-gray": "#F5F7FA",
        "dark-navy": "#0F2347",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 10px 40px rgba(240,165,0,0.3)',
        navy: '0 10px 40px rgba(26,58,107,0.2)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
