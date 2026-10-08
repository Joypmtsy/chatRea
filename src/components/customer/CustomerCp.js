import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
} from "../../styles/theme";

export function CustomerTableCard({
  tableNumber,
  status = "available",
  onPress = undefined,
}) {
  const isAvailable = status === "available";

  return (
    <TouchableOpacity
      style={[
        styles.tableCard,
        isAvailable ? styles.tableAvailable : styles.tableOccupied,
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.tableNumber, !isAvailable && styles.tableNumberOccupied]}
      >
        {tableNumber}
      </Text>

      <Text
        style={[
          styles.tableStatus,
          isAvailable ? styles.availableText : styles.occupiedText,
        ]}
      >
        {isAvailable ? "ว่าง" : "ไม่ว่าง"}
      </Text>
    </TouchableOpacity>
  );
}

export function MenuCard({ menu, onAdd, disabled = false }) {
  return (
    <View style={styles.menuCard}>
      <Text
        style={styles.menuName}
        numberOfLines={2}
      >
        {menu.name}
      </Text>

      <View style={styles.menuBottomRow}>
        <Text style={styles.menuPrice}>{menu.price.toFixed(2)} บาท</Text>

        <TouchableOpacity
          style={styles.addButton}
          disabled={disabled}
          onPress={() => onAdd(menu)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CartItem({ item, onIncrease, onDecrease, disabled = false }) {
  return (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityButton}
            disabled={disabled}
            onPress={() => onDecrease(item)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityValue}>{item.qty}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            disabled={disabled}
            onPress={() => onIncrease(item)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.cartItemPrice}>
        {(item.price * item.qty).toFixed(2)} บาท
      </Text>
    </View>
  );
}

export function OrderStatusCard({ order, onPress = undefined }) {
  const status = getOrderStatus(order.status);

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={onPress}
    >
      <View style={styles.orderTopRow}>
        <View style={styles.orderMain}>
          <Text style={styles.roundText}>Round {order.round}</Text>

          <Text style={styles.orderMenuName}>{order.menu}</Text>
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

      <View style={styles.orderBottomRow}>
        <Text style={styles.orderQuantity}>จำนวน {order.quantity}</Text>

        <Text style={styles.orderPrice}>
          {order.price * order.quantity} บาท
        </Text>
      </View>

      {order.note ? (
        <Text style={styles.orderNote}>หมายเหตุ: {order.note}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

export function BillItem({ item }) {
  return (
    <View style={styles.billItem}>
      <View style={styles.billItemMain}>
        <Text style={styles.billItemName}>{item.name}</Text>

        <Text style={styles.billItemQuantity}>x {item.quantity}</Text>
        <Text style={styles.billItemQuantity}>
          ราคา/หน่วย {item.priceAtOrder.toFixed(2)} บาท
        </Text>

        {item.note ? (
          <Text style={styles.billItemNote}>หมายเหตุ: {item.note}</Text>
        ) : null}
      </View>

      <Text style={styles.billItemPrice}>
        {(item.quantity * item.priceAtOrder).toFixed(2)} บาท
      </Text>
    </View>
  );
}

function getOrderStatus(status) {
  switch (status) {
    case "waiting":
      return {
        label: "รอรับออเดอร์",
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
        label: status,
        color: colors.textSecondary,
        background: colors.border,
      };
  }
}

const styles = StyleSheet.create({
  tableCard: {
    width: "100%",
    height: 120,

    borderRadius: radius.card,

    borderWidth: 2,

    justifyContent: "center",
    alignItems: "center",
  },

  tableAvailable: {
    backgroundColor: colors.surface,

    borderColor: colors.successBg,
  },

  tableOccupied: {
    backgroundColor: colors.dangerBg,

    borderColor: colors.danger,
  },

  tableNumber: {
    fontSize: 28,

    fontWeight: fontWeight.bold,

    color: colors.success,
  },

  tableNumberOccupied: {
    color: colors.danger,
  },

  tableStatus: {
    marginTop: spacing.sm,

    fontSize: fontSize.sm,

    fontWeight: fontWeight.semibold,
  },

  availableText: {
    color: colors.success,
  },

  occupiedText: {
    color: colors.danger,
  },

  menuCard: {
    width: "100%",

    backgroundColor: colors.surface,

    borderRadius: radius.xl,

    padding: spacing.md,

    borderWidth: 1,

    borderColor: colors.border,
  },

  menuName: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    marginBottom: spacing.sm,
  },

  menuBottomRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  menuPrice: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },

  addButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: colors.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: colors.textWhite,

    fontSize: fontSize.lg,

    fontWeight: fontWeight.bold,
  },

  cartItem: {
    minHeight: 70,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: spacing.md,

    borderBottomWidth: 1,

    borderBottomColor: colors.border,
  },

  cartItemInfo: {
    flex: 1,
  },

  cartItemName: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.semibold,

    color: colors.textPrimary,

    marginBottom: spacing.sm,
  },

  quantityRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: spacing.sm,
  },

  quantityButton: {
    width: 44,
    height: 44,

    borderRadius: radius.sm,

    backgroundColor: colors.border,

    justifyContent: "center",
    alignItems: "center",
  },

  quantityButtonText: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,

    color: colors.textSecondary,
  },

  quantityValue: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    minWidth: 18,

    textAlign: "center",
  },

  cartItemPrice: {
    fontSize: fontSize.sm,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },

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

  roundText: {
    fontSize: fontSize.xs,

    color: colors.textMuted,
  },

  orderMenuName: {
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

  orderBottomRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: spacing.lg,
  },

  orderQuantity: {
    fontSize: fontSize.sm,

    color: colors.textSecondary,
  },

  orderPrice: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,
  },

  orderNote: {
    marginTop: spacing.md,

    paddingTop: spacing.md,

    borderTopWidth: 1,

    borderTopColor: colors.border,

    fontSize: fontSize.sm,

    color: colors.textMuted,
  },

  billItem: {
    minHeight: 64,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: spacing.md,

    borderBottomWidth: 1,

    borderBottomColor: colors.border,
  },

  billItemMain: {
    flex: 1,
  },

  billItemName: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.semibold,

    color: colors.textPrimary,
  },

  billItemQuantity: {
    marginTop: spacing.xs,

    fontSize: fontSize.sm,

    color: colors.textMuted,
  },

  billItemNote: {
    marginTop: spacing.xs,

    fontSize: fontSize.xs,

    color: colors.textMuted,
  },

  billItemPrice: {
    fontSize: fontSize.md,

    fontWeight: fontWeight.bold,

    color: colors.textPrimary,

    marginLeft: spacing.lg,
  },
});
