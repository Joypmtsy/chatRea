import { StyleSheet } from "react-native";
import {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  dimensions,
  shadow,
} from "./theme";

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screenContent: {
    flex: 1,
    padding: dimensions.screenPadding,
  },

  scrollContent: {
    padding: dimensions.screenPadding,
    paddingBottom: spacing.xxxl,
  },

  header: {
    backgroundColor: colors.primaryDark,

    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  headerTitle: {
    color: colors.textWhite,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
  },

  headerSubtitle: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },

  headerBadge: {
    backgroundColor: "#334155",

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,

    borderRadius: radius.round,
  },

  headerBadgeText: {
    color: colors.textWhite,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },

  card: {
    backgroundColor: colors.surface,

    borderRadius: radius.card,

    padding: dimensions.cardPadding,

    ...shadow.card,
  },

  cardSmall: {
    backgroundColor: colors.surface,

    borderRadius: radius.lg,

    padding: spacing.lg,

    borderWidth: 1,
    borderColor: colors.border,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowStart: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  column: {
    flexDirection: "column",
  },

  flex: {
    flex: 1,
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  infoRow: {
    minHeight: 44,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    paddingVertical: spacing.md,
  },

  infoLabel: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },

  infoValue: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },

  primaryButton: {
    minHeight: dimensions.buttonHeight,

    backgroundColor: colors.primary,

    borderRadius: radius.xl,

    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,

    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonDisabled: {
    backgroundColor: colors.disabled,
  },

  primaryButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },

  secondaryButton: {
    minHeight: dimensions.buttonHeight,

    backgroundColor: colors.surface,

    borderRadius: radius.xl,

    borderWidth: 1,
    borderColor: colors.border,

    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,

    justifyContent: "center",
    alignItems: "center",
  },

  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },

  statusBadge: {
    alignSelf: "flex-start",

    borderRadius: radius.md,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  input: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.lg,

    minHeight: 44,

    paddingHorizontal: spacing.lg,

    color: colors.textPrimary,

    fontSize: fontSize.md,
  },

  emptyContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    padding: spacing.xxxl,
  },

  emptyTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
    textAlign: "center",
  },

  marginTopSm: {
    marginTop: spacing.sm,
  },

  marginTopMd: {
    marginTop: spacing.md,
  },

  marginTopLg: {
    marginTop: spacing.lg,
  },

  marginBottomSm: {
    marginBottom: spacing.sm,
  },

  marginBottomMd: {
    marginBottom: spacing.md,
  },

  marginBottomLg: {
    marginBottom: spacing.lg,
  },
});
