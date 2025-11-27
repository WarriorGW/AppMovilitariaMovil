import { StyleSheet } from "react-native";

export const colors = {
  primary: "#6C63FF",
  secondary: "#4B4B4B",
  background: "#FFFFFF",
  border: "#E5E5E5",
  accent: "#FF6B6B",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const globalStyles = StyleSheet.create({
  // --- Containers ---
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  // --- Text ---
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: "500",
    marginBottom: spacing.sm,
  },

  // --- Input ---
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    fontSize: 16,
  },

  // --- Buttons ---
  button: {
    backgroundColor: "#4A6CF7",
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  // --- Small button ---
  buttonSmall: {
    backgroundColor: "#4A6CF7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },

  // --- Card & List ---
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // --- Button wrapper (for spacing) ---
  buttonWrapper: {
    marginTop: spacing.md,
  },
});
