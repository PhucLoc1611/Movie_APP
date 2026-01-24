export const colors = {
  // Background colors
  background: "#0D0D0D",
  surface: "#1A1A2E",
  surfaceLight: "#252540",

  // Primary colors
  primary: "#00D4FF",
  primaryDark: "#00A3CC",

  // Accent colors
  accent: "#E50914",
  accentLight: "#FF1A1A",

  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#8B8B8B",
  textMuted: "#5A5A5A",

  // IMDb colors
  imdbYellow: "#F5C518",
  imdbBlack: "#000000",

  // Utility colors
  success: "#00C853",
  warning: "#FFB300",
  error: "#FF5252",

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.6)",
  cardOverlay: "rgba(255, 255, 255, 0.1)",

  // Border colors
  border: "rgba(255, 255, 255, 0.1)",
  borderLight: "rgba(255, 255, 255, 0.2)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 36,
};

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
};
