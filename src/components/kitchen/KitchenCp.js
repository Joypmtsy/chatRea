import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
} from "../../styles/theme";

export function KitchenOrderCard({ order, onPress = undefined }) {
  const status = getStatusConfig(order.status);

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={onPress}
    >
      {}
      <View style={styles.orderTopRow}>
        <View style={styles.orderMain}>
          <Text style={styles.orderId}>Order #{order.orderId}</Text>

          <Text style={styles.tableText}>โต๊ะ {order.tableNumber}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: status.background,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: status.color,
              },
            ]}
          >
            {status.label}
          </Text>
        </View>
      </View>

      {}
      <Text style={styles.roundText}>Round {order.roundNumber}</Text>

      {}
      <Text style={styles.menuName}>{order.menuName}</Text>

      {}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>จำนวน</Text>

        <Text style={styles.infoValue}>{order.quantity}</Text>
      </View>

      {}
      {order.note ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>หมายเหตุ</Text>

          <Text style={styles.noteText}>{order.note}</Text>
        </View>
      ) : null}

      {}
      {order.createdAt ? (
        <Text style={styles.timeText}>{order.createdAt}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

export function KitchenOrderItem({ item }) {
  return (
    <View style={styles.orderItem}>
      <View style={styles.orderItemMain}>
        <Text style={styles.orderItemName}>{item.menuName}</Text>

        <Text style={styles.orderItemQuantity}>จำนวน {item.quantity}</Text>

        {item.note ? (
          <Text style={styles.orderItemNote}>หมายเหตุ: {item.note}</Text>
        ) : null}
      </View>

      <Text style={styles.orderItemStatus}>
        {getStatusConfig(item.status).label}
      </Text>
    </View>
  );
}

export function KitchenStatusButton({
  status,
  onPress = undefined,
  disabled = false,
}) {
  const button = getNextStatus(status);

  return (
    <TouchableOpacity
      style={[styles.statusButton, disabled && styles.statusButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.statusButtonText}>{button.label}</Text>
    </TouchableOpacity>
  );
}

function getStatusConfig(status) {
  switch (status) {
    case "waiting":
      return {
        label: "รอทำ",
        color: colors.warning,
        background: colors.warningBg,
      };

    case "cooking":
      return {
        label: "กำลังทำ",
        color: colors.info,
        background: colors.infoBg,
      };

    case "served":
      return {
        label: "เสิร์ฟแล้ว",
        color: colors.success,
        background: colors.successBg,
      };

    default:
      return {
        label: status || "-",
        color: colors.textSecondary,
        background: colors.border,
      };
  }
}

function getNextStatus(status) {
  switch (status) {
    case "waiting":
      return {
        label: "เริ่มทำอาหาร",
        nextStatus: "cooking",
      };

    case "cooking":
      return {
        label: "ทำเสร็จ / เสิร์ฟ",
        nextStatus: "served",
      };

    case "served":
      return {
        label: "เสิร์ฟแล้ว",
        nextStatus: "served",
      };

    default:
      return {
        label: "เปลี่ยนสถานะ",
        nextStatus: status,
      };
  }
}

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: colors.surface,

    borderRadius: radius.card,

    padding: spacing.xl,

    marginBottom: spacing.lg,

    borderWidth: 1,

    borderColor: colors.border,
  },

  orderTopRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",
  },

  orderMain: {
    flex: 1,
  },

  orderId: {
    fontSize: fontSize.sm,

    color: colors.textMuted,

    fontWeight: fontWeight.semibold,
  },

  tableText: {
    fontSize: fontSize.lg,

    color: colors.textPrimary,

    fontWeight: fontWeight.bold,

    marginTop: spacing.xs,
  },

  roundText: {
    fontSize: fontSize.sm,

    color: colors.textMuted,

    marginTop: spacing.md,
  },

  menuName: {
    fontSize: fontSize.xl,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    marginTop: spacing.xs,
  },

  statusBadge: {
    borderRadius: radius.md,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,
  },

  statusText: {
    fontSize: fontSize.xs,

    fontWeight: fontWeight.bold,
  },

  infoRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: spacing.lg,

    paddingTop: spacing.md,

    borderTopWidth: 1,

    borderTopColor: colors.border,
  },

  infoLabel: {
    fontSize: fontSize.sm,

    color: colors.textMuted,
  },

  infoValue: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },

  noteBox: {
    backgroundColor: colors.surfaceLight,

    borderRadius: radius.md,

    padding: spacing.md,

    marginTop: spacing.md,
  },

  noteLabel: {
    fontSize: fontSize.xs,

    color: colors.textMuted,

    marginBottom: spacing.xs,
  },

  noteText: {
    fontSize: fontSize.sm,

    color: colors.textSecondary,
  },

  timeText: {
    fontSize: fontSize.xs,

    color: colors.textMuted,

    marginTop: spacing.md,

    textAlign: "right",
  },

  orderItem: {
    minHeight: 70,

    backgroundColor: colors.surface,

    paddingVertical: spacing.md,

    borderBottomWidth: 1,

    borderBottomColor: colors.border,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  orderItemMain: {
    flex: 1,
  },

  orderItemName: {
    fontSize: fontSize.lg,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },

  orderItemQuantity: {
    fontSize: fontSize.sm,

    color: colors.textMuted,

    marginTop: spacing.xs,
  },

  orderItemNote: {
    fontSize: fontSize.xs,

    color: colors.textMuted,

    marginTop: spacing.xs,
  },

  orderItemStatus: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.semibold,

    color: colors.textSecondary,

    marginLeft: spacing.lg,
  },

  statusButton: {
    minHeight: 44,

    backgroundColor: colors.primary,

    borderRadius: radius.xl,

    paddingHorizontal: spacing.xl,

    paddingVertical: spacing.md,

    justifyContent: "center",

    alignItems: "center",
  },

  statusButtonDisabled: {
    backgroundColor: colors.disabled,
  },

  statusButtonText: {
    color: colors.textWhite,

    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,
  },
});
