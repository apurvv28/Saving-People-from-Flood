/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // VRISHTI strict palette
        brand: {
          blue: "#2563eb",
          "blue-dark": "#1d4ed8",
          orange: "#ea580c",
          "orange-dark": "#c2410c",
          green: "#16a34a",
          "green-dark": "#15803d",
        },
        // Dark backgrounds
        gray: {
          950: "#030712",
          925: "#0a0f1a",
          900: "#111827",
          850: "#1a2235",
          800: "#1f2937",
          700: "#374151",
          600: "#4b5563",
          500: "#6b7280",
          400: "#9ca3af",
          300: "#d1d5db",
          200: "#e5e7eb",
          100: "#f3f4f6",
          50:  "#f9fafb",
        },
        // Keep space for backward compat with any remaining references
        space: {
          950: "#030712",
          900: "#111827",
          850: "#1a2235",
          800: "#1f2937",
        },
      },
      fontFamily: {
        sans: ["'Lexend Deca'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // Minimum 16px everywhere
        'xs':   ['15px', '21px'],
        'sm':   ['15px', '22px'],
        'base': ['15px', '22px'],
        'lg':   ['18px', '28px'],
        'xl':   ['20px', '28px'],
        '2xl':  ['24px', '32px'],
        '3xl':  ['28px', '36px'],
        '4xl':  ['34px', '42px'],
        '5xl':  ['42px', '50px'],
        '6xl':  ['52px', '60px'],
        '7xl':  ['64px', '72px'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
        'blue': '0 4px 20px rgba(37,99,235,0.25)',
        'orange': '0 4px 20px rgba(234,88,12,0.25)',
        'green': '0 4px 20px rgba(22,163,74,0.25)',
      },
    },
  },
  plugins: [],
};
