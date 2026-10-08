const rounds = [
  {
    id: 2001,
    billId: 1001,
    roundNumber: 1,
    createdAt: "2026-09-27 12:05",
  },

  {
    id: 2002,
    billId: 1001,
    roundNumber: 2,
    createdAt: "2026-09-27 12:20",
  },

  {
    id: 2003,
    billId: 1002,
    roundNumber: 1,
    createdAt: "2026-09-27 11:05",
  },

  {
    id: 2004,
    billId: 1003,
    roundNumber: 1,
    createdAt: "2026-09-27 13:05",
  },

  {
    id: 2005,
    billId: 1003,
    roundNumber: 2,
    createdAt: "2026-09-27 13:25",
  },

  {
    id: 2006,
    billId: 1004,
    roundNumber: 1,
    createdAt: "2026-09-27 10:05",
  },
];

export async function SOrderRounds(db) {
  try {
    for (const round of rounds) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO order_rounds (
          round_id,
          bill_id,
          round_number,
          created_at
        )
        VALUES (?, ?, ?, ?)
        `,
        [round.id, round.billId, round.roundNumber, round.createdAt],
      );
    }

    return {
      ok: true,
      message: "Seed D6 Order Rounds สำเร็จ",
    };
  } catch (error) {
    console.error("seedOrderRounds failed:", error);

    return {
      ok: false,
      message: "Seed D6 Order Rounds ไม่สำเร็จ",
    };
  }
}
