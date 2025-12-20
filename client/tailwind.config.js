export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "ayur-gradient": "radial-gradient(circle at top left, #bbf7d0, #fef9c3, #f1f5f9)",
      },
    },
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      slate: {
        900: "#0f172a",
        600: "#475569"
      },
      ayur: {
        soft: "#ecfdf5",
        green: "#15803d",
        leaf: "#0f766e",
        cream: "#fef9c3",
        brown: "#78350f",
        accent: "#4ade80"
      }
    },
    boxShadow: {
      "soft-card": "0 20px 40px rgba(15, 118, 110, 0.15)"
    }
  }
};
