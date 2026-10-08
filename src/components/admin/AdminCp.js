import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
} from "../../styles/theme";

export function SummaryCard({ title, value, subtitle = undefined }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{title}</Text>

      <Text style={styles.summaryValue}>{value}</Text>

      {subtitle ? <Text style={styles.summarySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function TableCard({
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
          isAvailable ? styles.statusAvailable : styles.statusOccupied,
        ]}
      >
        {isAvailable ? "ว่าง" : "ไม่ว่าง"}
      </Text>
    </TouchableOpacity>
  );
}

export function RecentOrderRow({
  orderId,
  tableNumber,
  menuName,
  quantity,
  status,
  time,
}) {
  return (
    <View style={styles.recentOrderRow}>
      <View style={styles.recentOrderMain}>
        <Text style={styles.orderId}>#{orderId}</Text>

        <Text style={styles.orderMenu}>{menuName}</Text>

        <Text style={styles.orderDetail}>
          โต๊ะ {tableNumber} • จำนวน {quantity}
        </Text>
      </View>

      <View style={styles.recentOrderRight}>
        <Text style={styles.orderTime}>{time}</Text>

        <View style={[styles.statusBadge, getStatusStyle(status).background]}>
          <Text style={[styles.statusText, getStatusStyle(status).text]}>
            {getStatusLabel(status)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function QuickActionButton({
  title,
  subtitle = undefined,
  icon = undefined,
  onPress = undefined,
}) {
  return (
    <TouchableOpacity
      style={styles.quickActionButton}
      onPress={onPress}
    >
      {icon ? <Text style={styles.quickActionIcon}>{icon}</Text> : null}

      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{title}</Text>

        {subtitle ? (
          <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export function BillRow({
  billId,
  tableNumber,
  openedAt = undefined,
  closedAt,
  total,
  onPress = undefined,
}) {
  return (
    <TouchableOpacity
      style={styles.billRow}
      onPress={onPress}
    >
      <View style={styles.billMain}>
        <Text style={styles.billId}>Bill #{billId}</Text>

        <Text style={styles.billTable}>โต๊ะ {tableNumber}</Text>
      </View>

      <View style={styles.billTime}>
        <Text style={styles.billDate}>{openedAt}</Text>

        {closedAt ? (
          <Text style={styles.billClosed}>ปิด {closedAt}</Text>
        ) : null}
      </View>

      <Text style={styles.billTotal}>{total} บาท</Text>
    </TouchableOpacity>
  );
}

export function BillDetailModal({ visible, bill, onClose }) {
  if (!bill) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.billModal}>
          {}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Bill #{bill.billId}</Text>

              <Text style={styles.modalSubtitle}>โต๊ะ {bill.tableNumber}</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {}
          <ScrollView
            style={styles.billItemList}
            showsVerticalScrollIndicator={false}
          >
            {bill.rounds?.map((round) => (
              <View
                key={round.roundId ?? round.roundNumber}
                style={styles.roundSection}
              >
                <Text style={styles.roundTitle}>Round {round.roundNumber}</Text>

                {round.items?.map((item) => (
                  <View
                    key={item.orderItemId ?? item.id}
                    style={styles.billItemRow}
                  >
                    <View style={styles.billItemMain}>
                      <Text style={styles.billItemName}>{item.menuName}</Text>

                      <Text style={styles.billItemDetail}>
                        x {item.quantity}
                      </Text>

                      {item.note ? (
                        <Text style={styles.billItemNote}>
                          หมายเหตุ: {item.note}
                        </Text>
                      ) : null}
                    </View>

                    <Text style={styles.billItemPrice}>
                      {item.quantity * item.priceAtOrder} บาท
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {}
          <View style={styles.billTotalSection}>
            <Text style={styles.billTotalLabel}>ยอดรวม</Text>

            <Text style={styles.billTotalValue}>{bill.total} บาท</Text>
          </View>

          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={onClose}
          >
            <Text style={styles.closeModalButtonText}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function MenuManageRow({
  menuName,
  categoryName,
  price,
  isAvailable,
  onEdit,
  onToggle,
  disabled = false,
}) {
  return (
    <View style={styles.menuManageRow}>
      <View style={styles.menuManageMain}>
        <Text style={styles.menuName}>{menuName}</Text>

        <Text style={styles.menuCategory}>{categoryName}</Text>
      </View>

      <Text style={styles.menuPrice}>{price} บาท</Text>

      <TouchableOpacity
        style={[
          styles.availabilityButton,
          isAvailable ? styles.availableButton : styles.unavailableButton,
        ]}
        disabled={disabled}
        onPress={onToggle}
      >
        <Text
          style={[
            styles.availabilityText,
            isAvailable ? styles.availableText : styles.unavailableText,
          ]}
        >
          {isAvailable ? "เปิดขาย" : "ปิดขาย"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        disabled={disabled}
        onPress={onEdit}
      >
        <Text style={styles.editButtonText}>แก้ไข</Text>
      </TouchableOpacity>
    </View>
  );
}

export function ReportCard({ title, value, subtitle = undefined }) {
  return (
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>{title}</Text>

      <Text style={styles.reportValue}>{value}</Text>

      {subtitle ? <Text style={styles.reportSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function WarningCard({ title, message }) {
  return (
    <View style={styles.warningCard}>
      <View style={styles.warningIconBox}>
        <Text style={styles.warningIcon}>!</Text>
      </View>

      <View style={styles.warningContent}>
        <Text style={styles.warningTitle}>{title}</Text>

        <Text style={styles.warningMessage}>{message}</Text>
      </View>
    </View>
  );
}

function getStatusLabel(status) {
  switch (status) {
    case "waiting":
      return "รอ";

    case "cooking":
      return "กำลังทำ";

    case "served":
      return "เสิร์ฟแล้ว";

    case "open":
      return "เปิด";

    case "closed":
      return "ปิด";

    default:
      return status;
  }
}

function getStatusStyle(status) {
  switch (status) {
    case "waiting":
      return {
        background: styles.statusWaiting,
        text: styles.statusWaitingText,
      };

    case "cooking":
      return {
        background: styles.statusCooking,
        text: styles.statusCookingText,
      };

    case "served":
      return {
        background: styles.statusServed,
        text: styles.statusServedText,
      };

    default:
      return {
        background: styles.statusDefault,
        text: styles.statusDefaultText,
      };
  }
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    flex: 1,
  },

  summaryTitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  summaryValue: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },

  summarySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

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

  statusAvailable: {
    color: colors.success,
  },

  statusOccupied: {
    color: colors.danger,
  },

  recentOrderRow: {
    backgroundColor: colors.surface,
    minHeight: 72,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  recentOrderMain: {
    flex: 1,
  },

  orderId: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  orderMenu: {
    marginTop: 2,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  orderDetail: {
    marginTop: 2,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  recentOrderRight: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },

  orderTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },

  quickActionButton: {
    minHeight: 70,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.card,

    padding: spacing.lg,

    flexDirection: "row",
    alignItems: "center",

    gap: spacing.md,
  },

  quickActionIcon: {
    fontSize: 24,
  },

  quickActionText: {
    flex: 1,
  },

  quickActionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  quickActionSubtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  billRow: {
    minHeight: 70,

    backgroundColor: colors.surface,

    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  billMain: {
    width: "30%",
  },

  billId: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  billTable: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  billTime: {
    width: "35%",
  },

  billDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  billClosed: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },

  billTotal: {
    flex: 1,
    textAlign: "right",
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },

  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.4)",

    justifyContent: "center",
    alignItems: "center",

    padding: spacing.xxl,
  },

  billModal: {
    width: "85%",
    maxHeight: "85%",

    backgroundColor: colors.surface,

    borderRadius: radius.card,

    padding: spacing.xl,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    marginBottom: spacing.lg,
  },

  modalTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  modalSubtitle: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },

  closeButton: {
    width: 36,
    height: 36,

    borderRadius: radius.round,

    backgroundColor: colors.surfaceLight,

    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },

  billItemList: {
    maxHeight: 400,
  },

  roundSection: {
    marginBottom: spacing.lg,
  },

  roundTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },

  billItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingVertical: spacing.sm,

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

  billItemDetail: {
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
  },

  billTotalSection: {
    marginTop: spacing.lg,

    paddingTop: spacing.lg,

    borderTopWidth: 1,
    borderTopColor: colors.border,

    flexDirection: "row",
    justifyContent: "space-between",
  },

  billTotalLabel: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },

  billTotalValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },

  closeModalButton: {
    marginTop: spacing.lg,

    backgroundColor: colors.primary,

    paddingVertical: spacing.md,

    borderRadius: radius.xl,

    alignItems: "center",
  },

  closeModalButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },

  menuManageRow: {
    flexWrap: "wrap",
    gap: spacing.sm,
    minHeight: 72,

    backgroundColor: colors.surface,

    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  menuManageMain: {
    flexGrow: 1,
    flexBasis: "100%",
  },

  menuName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  menuCategory: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },

  menuPrice: {
    flexGrow: 1,
    minWidth: 70,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: "right",
    marginRight: spacing.md,
  },

  availabilityButton: {
    width: 80,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
  },

  availableButton: {
    backgroundColor: colors.successBg,
  },

  unavailableButton: {
    backgroundColor: colors.dangerBg,
  },

  availabilityText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },

  availableText: {
    color: colors.success,
  },

  unavailableText: {
    color: colors.danger,
  },

  editButton: {
    marginLeft: spacing.sm,

    backgroundColor: colors.surfaceLight,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.md,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  editButtonText: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },

  reportCard: {
    backgroundColor: colors.surface,

    borderRadius: radius.card,

    padding: spacing.xl,

    flex: 1,
  },

  reportTitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  reportValue: {
    marginTop: spacing.xs,

    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  reportSubtitle: {
    marginTop: spacing.xs,

    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  warningCard: {
    backgroundColor: colors.warningBg,

    borderRadius: radius.card,

    padding: spacing.lg,

    flexDirection: "row",

    alignItems: "flex-start",

    borderWidth: 1,
    borderColor: colors.warning,
  },

  warningIconBox: {
    width: 32,
    height: 32,

    borderRadius: radius.round,

    backgroundColor: colors.warning,

    justifyContent: "center",
    alignItems: "center",

    marginRight: spacing.md,
  },

  warningIcon: {
    color: colors.textWhite,

    fontSize: fontSize.lg,

    fontWeight: fontWeight.bold,
  },

  warningContent: {
    flex: 1,
  },

  warningTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  warningMessage: {
    marginTop: spacing.xs,

    fontSize: fontSize.sm,
    color: colors.textSecondary,

    lineHeight: 20,
  },

  statusBadge: {
    borderRadius: radius.md,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },

  statusWaiting: {
    backgroundColor: colors.warningBg,
  },

  statusWaitingText: {
    color: colors.warning,
  },

  statusCooking: {
    backgroundColor: colors.infoBg,
  },

  statusCookingText: {
    color: colors.info,
  },

  statusServed: {
    backgroundColor: colors.successBg,
  },

  statusServedText: {
    color: colors.success,
  },

  statusDefault: {
    backgroundColor: colors.border,
  },

  statusDefaultText: {
    color: colors.textSecondary,
  },
});
