const transfers = [
  {
    id: 5001,
    billId: 1001,
    fromTableId: 1,
    toTableId: 4,
    transferredAt: "2026-09-27 12:15",
  },

  {
    id: 5002,
    billId: 1003,
    fromTableId: 5,
    toTableId: 7,
    transferredAt: "2026-09-27 13:20",
  },
];

export async function STableTransfers(db) {
  try {
    for (const transfer of transfers) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO table_transfers (
          transfer_id,
          bill_id,
          from_table_id,
          to_table_id,
          transferred_at
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          transfer.id,
          transfer.billId,
          transfer.fromTableId,
          transfer.toTableId,
          transfer.transferredAt,
        ],
      );
    }

    return {
      ok: true,
      message: "Seed D9 Table Transfers สำเร็จ",
    };
  } catch (error) {
    console.error("seedTableTransfers failed:", error);

    return {
      ok: false,
      message: "Seed D9 Table Transfers ไม่สำเร็จ",
    };
  }
}
