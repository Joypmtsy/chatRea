const payments = [
  {
    id: 4001,
    billId: 1002,
    amount: 34000,
    paymentMethod: "cash",
    paidAt: "2026-09-27 12:30",
  },

  {
    id: 4002,
    billId: 1004,
    amount: 32000,
    paymentMethod: "qr",
    paidAt: "2026-09-27 11:30",
  },
];

export async function SPayments(db) {
  try {
    for (const payment of payments) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO payments (
          payment_id,
          bill_id,
          amount,
          payment_method,
          paid_at
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          payment.id,
          payment.billId,
          payment.amount,
          payment.paymentMethod,
          payment.paidAt,
        ],
      );
    }

    return {
      ok: true,
      message: "Seed D8 Payments สำเร็จ",
    };
  } catch (error) {
    console.error("seedPayments failed:", error);

    return {
      ok: false,
      message: "Seed D8 Payments ไม่สำเร็จ",
    };
  }
}
