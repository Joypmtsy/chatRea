import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  dimensions,
  shadow,
} from "../../styles/theme";

export function ScreenHeader({
  title,
  subtitle = undefined,
  rightText = undefined,
  children = undefined,
}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>{title}</Text>

        {subtitle ? (
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={styles.headerRight}>
        {rightText ? (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{rightText}</Text>
          </View>
        ) : null}

        {children}
      </View>
    </View>
  );
}

export function SectionCard({ children = undefined, style = undefined }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({
  title,
  onPress = undefined,
  disabled = false,
  style = undefined,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function StatusBadge({ status, label = undefined }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: config.background,
        },
      ]}
    >
      <Text
        style={[
          styles.statusBadgeText,
          {
            color: config.color,
          },
        ]}
      >
        {label || config.label}
      </Text>
    </View>
  );
}

export function InfoRow({ label = undefined, value, style = undefined }) {
  return (
    <View style={[styles.infoRow, style]}>
      <Text style={styles.infoLabel}>{label}</Text>

      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const STATUS_CONFIG = {
  waiting: {
    label: "รอรับออเดอร์",
    color: colors.warning,
    background: colors.warningBg,
  },

  cooking: {
    label: "กำลังทำ",
    color: colors.info,
    background: colors.infoBg,
  },

  served: {
    label: "เสิร์ฟแล้ว",
    color: colors.success,
    background: colors.successBg,
  },

  open: {
    label: "เปิด",
    color: colors.info,
    background: colors.infoBg,
  },

  closed: {
    label: "ปิด",
    color: colors.textMuted,
    background: colors.border,
  },

  available: {
    label: "ว่าง",
    color: colors.success,
    background: colors.successBg,
  },

  occupied: {
    label: "ไม่ว่าง",
    color: colors.danger,
    background: colors.dangerBg,
  },

  default: {
    label: "",
    color: colors.textSecondary,
    background: colors.border,
  },
};

const styles = StyleSheet.create({
  header: {
    minHeight: dimensions.headerHeight,
    paddingVertical: spacing.md,
    flexWrap: "wrap",
    gap: spacing.sm,

    backgroundColor: colors.primaryDark,

    paddingHorizontal: spacing.xxl,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
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

  headerRight: {
    flexDirection: "row",

    alignItems: "center",

    gap: spacing.md,
  },

  headerBadge: {
    backgroundColor: "#334155",

    paddingHorizontal: spacing.lg,

    paddingVertical: spacing.sm,

    borderRadius: radius.lg,
  },

  headerBadgeText: {
    color: colors.textWhite,

    fontSize: fontSize.md,

    fontWeight: fontWeight.semibold,
  },

  card: {
    backgroundColor: colors.surface,

    borderRadius: radius.card,

    padding: dimensions.cardPadding,

    ...shadow.card,
  },

  primaryButton: {
    backgroundColor: colors.primary,

    minHeight: dimensions.buttonHeight,

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

  statusBadge: {
    borderRadius: radius.md,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,

    alignSelf: "flex-start",
  },

  statusBadgeText: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,
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
    flex: 1,
    paddingRight: spacing.md,
    color: colors.textMuted,

    fontSize: fontSize.md,
  },

  infoValue: {
    flexShrink: 1,
    maxWidth: "50%",
    textAlign: "right",
    color: colors.textPrimary,

    fontSize: fontSize.md,

    fontWeight: fontWeight.semibold,
  },
});
