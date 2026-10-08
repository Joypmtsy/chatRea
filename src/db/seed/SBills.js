const bills = [
  {
    id: 1001,
    tableId: 4,
    status: "open",
    openedAt: "2026-09-27 12:00",
    closedAt: null,
  },

  {
    id: 1002,
    tableId: 2,
    status: "closed",
    openedAt: "2026-09-27 11:00",
    closedAt: "2026-09-27 12:30",
  },

  {
    id: 1003,
    tableId: 7,
    status: "open",
    openedAt: "2026-09-27 13:00",
    closedAt: null,
  },

  {
    id: 1004,
    tableId: 8,
    status: "closed",
    openedAt: "2026-09-27 10:00",
    closedAt: "2026-09-27 11:30",
  },
];

export async function SBills(db) {
  try {
    for (const bill of bills) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO bills (
          bill_id,
          table_id,
          status,
          opened_at,
          closed_at
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [bill.id, bill.tableId, bill.status, bill.openedAt, bill.closedAt],
      );
    }

    return {
      ok: true,
      message: "Seed D5 Bills สำเร็จ",
    };
  } catch (error) {
    console.error("seedBills failed:", error);

    return {
      ok: false,
      message: "Seed D5 Bills ไม่สำเร็จ",
    };
  }
}
