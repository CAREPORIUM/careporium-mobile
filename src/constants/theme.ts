export const colors = {
  primary: "#2F6FEB",
  primaryDark: "#1E4FC0",

  background: "#FFFFFF",
  surface: "#FFFFFF",

  text: "#111111",
  textSecondary: "#6B7280",
  placeholder: "#A3A3A3",

  border: "#2F6FEB",
  borderLight: "#D1D5DB",

  error: "#DC2626",
  disabled: "#D1D5DB",

  white: "#FFFFFF",
  black: "#000000",

  primaryLight: "#EAF0FD",
  card: "#F9FAFB",
  success: "#16A34A",

  warning: "#B54708",
  warningLight: "#FFFAEB",

  successLight: "#ECFDF3",
  errorLight: "#FEE2E2",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
} as const;

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },

  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
  },

  h3: {
    fontSize: 22,
    fontWeight: "700" as const,
  },

  body: {
    fontSize: 18,
    fontWeight: "400" as const,
  },

  bodySmall: {
    fontSize: 16,
    fontWeight: "400" as const,
  },

  label: {
    fontSize: 18,
    fontWeight: "500" as const,
  },

  button: {
    fontSize: 18,
    fontWeight: "600" as const,
  },

  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
  },
} as const;