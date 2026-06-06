/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom colors from specification
        royalBlue: "#1A56DB",
        emeraldGreen: "#10B981",
        crimsonRed: "#DC2626",
        // Reference design colors
        surfaceContainer: "#eceef0",
        inverseSurface: "#2d3133",
        surfaceContainerLowest: "#ffffff",
        tertiaryFixedDim: "#c0c1ff",
        onSurfaceVariant: "#434654",
        surfaceDim: "#d8dadc",
        background: "#f7f9fb",
        onSurface: "#191c1e",
        surfaceTint: "#0c56d0",
        onSecondaryFixed: "#002114",
        onSecondaryContainer: "#00714e",
        onTertiary: "#ffffff",
        primaryFixed: "#dae2ff",
        onTertiaryContainer: "#d0cfff",
        onTertiaryFixedVariant: "#2f2ebe",
        onPrimaryContainer: "#c4d2ff",
        secondary: "#006c4b",
        tertiaryFixed: "#e1e0ff",
        outlineVariant: "#c3c6d6",
        secondaryContainer: "#64f9bc",
        primary: "#003d9b",
        onPrimaryFixed: "#001848",
        onSecondary: "#ffffff",
        error: "#ba1a1a",
        secondaryFixedDim: "#45dfa4",
        onTertiaryFixed: "#07006c",
        tertiaryContainer: "#4547d3",
        outline: "#737685",
        onSecondaryFixedVariant: "#005137",
        surface: "#f7f9fb",
        primaryContainer: "#0052cc",
        errorContainer: "#ffdad6",
        surfaceContainerHigh: "#e6e8ea",
        surfaceBright: "#f7f9fb",
        onError: "#ffffff",
        inverseOnSurface: "#eff1f3",
        onErrorContainer: "#93000a",
        inversePrimary: "#b2c5ff",
        surfaceContainerLow: "#f2f4f6",
        onPrimaryFixedVariant: "#0040a2",
        tertiary: "#2b29bb",
        surfaceContainerHighest: "#e0e3e5",
        secondaryFixed: "#68fcbf",
        onBackground: "#191c1e",
        surfaceVariant: "#e0e3e5",
        onPrimary: "#ffffff",
        primaryFixedDim: "#b2c5ff"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "3xl": "64px",
        xs: "4px",
        md: "16px",
        marginDesktop: "40px",
        base: "4px",
        lg: "24px",
        "2xl": "48px",
        marginMobile: "16px",
        sm: "8px",
        gutter: "24px",
        xl: "32px",
        containerMax: "1440px"
      },
      fontFamily: {
        bodyMd: ["Inter", "sans-serif"],
        labelMd: ["Inter", "sans-serif"],
        headlineLg: ["Inter", "sans-serif"],
        labelSm: ["Inter", "sans-serif"],
        headlineLgMobile: ["Inter", "sans-serif"],
        headlineMd: ["Inter", "sans-serif"],
        bodyLg: ["Inter", "sans-serif"],
        bodySm: ["Inter", "sans-serif"],
        displayLg: ["Inter", "sans-serif"]
      },
      fontSize: {
        bodyMd: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        labelMd: ["14px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "600" }],
        headlineLg: ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        labelSm: ["12px", { lineHeight: "14px", letterSpacing: "0.02em", fontWeight: "500" }],
        headlineLgMobile: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        headlineMd: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        bodyLg: ["18px", { lineHeight: "28px", fontWeight: "400" }],
        bodySm: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        displayLg: ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    }
  },
  plugins: []
};


