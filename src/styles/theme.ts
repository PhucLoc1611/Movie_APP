// 🎨 COLORS
export const colors = {
  // Background
  background: "#76093d", // đen xanh sâu
  surface: "#46e905", // slate đậm
  surfaceLight: "#12e98c", // card nổi rõ

  // Primary (xanh neon)
  primary: "#0bfaa6",
  primaryDark: "#0ee9da",

  // Accent (đỏ movie / Netflix)
  accent: "#F43F5E",
  accentLight: "#c1fb71",

  // Text
  textPrimary: "#F9FAFB",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",

  // IMDb
  imdbYellow: "#FACC15",
  imdbBlack: "#000000",

  // Utility
  success: "#22C55E",
  warning: "#FBBF24",
  error: "#EF4444",

  // Overlay
  overlay: "rgba(0,0,0,0.7)",
  cardOverlay: "rgba(255,255,255,0.12)",

  // Border
  border: "rgba(255,255,255,0.12)",
  borderLight: "rgba(255,255,255,0.2)",
};

// 📏 SPACING
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

// 🟦 BORDER RADIUS
export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
};

// 🔤 FONT SIZE
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  hero: 40,
};

// 🔠 FONT WEIGHT
export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

// 🌫 SHADOWS (nổi card rõ hơn)
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
};
