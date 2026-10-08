import { StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize, fontWeight } from "./theme";

export const screenStyles = StyleSheet.create({
  stack: { gap: spacing.lg },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  filter: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { color: colors.textSecondary, fontSize: fontSize.md },
  filterTextActive: { color: colors.textWhite },
  summary: { flexGrow: 1, flexBasis: 140 },
  table: { flexGrow: 1, flexBasis: 140 },
  menu: { flexGrow: 1, flexBasis: 150 },
  fullWidth: { width: "100%" },
  total: {
    color: colors.primary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
  },
  note: { color: colors.textMuted, fontSize: fontSize.sm },
  input: { marginTop: spacing.md },
});
