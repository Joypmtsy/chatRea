const orderItems = [
  {
    id: 3001,
    roundId: 2001,
    menuId: 1,
    quantity: 1,
    note: "เผ็ดน้อย",
    priceAtOrder: 15000,
    status: "served",
    createdAt: "2026-09-27 12:06",
  },

  {
    id: 3002,
    roundId: 2001,
    menuId: 6,
    quantity: 2,
    note: "ไม่ใส่พริก",
    priceAtOrder: 10000,
    status: "served",
    createdAt: "2026-09-27 12:07",
  },

  {
    id: 3003,
    roundId: 2002,
    menuId: 20,
    quantity: 2,
    note: null,
    priceAtOrder: 1500,
    status: "cooking",
    createdAt: "2026-09-27 12:21",
  },

  {
    id: 3004,
    roundId: 2002,
    menuId: 14,
    quantity: 1,
    note: "กรอบๆ",
    priceAtOrder: 10000,
    status: "waiting",
    createdAt: "2026-09-27 12:22",
  },

  {
    id: 3005,
    roundId: 2003,
    menuId: 7,
    quantity: 1,
    note: null,
    priceAtOrder: 10000,
    status: "served",
    createdAt: "2026-09-27 11:06",
  },

  {
    id: 3006,
    roundId: 2003,
    menuId: 21,
    quantity: 2,
    note: "หวานน้อย",
    priceAtOrder: 4500,
    status: "served",
    createdAt: "2026-09-27 11:07",
  },

  {
    id: 3007,
    roundId: 2003,
    menuId: 16,
    quantity: 1,
    note: "ไม่ใส่ปลาร้า",
    priceAtOrder: 8000,
    status: "served",
    createdAt: "2026-09-27 11:08",
  },

  {
    id: 3008,
    roundId: 2004,
    menuId: 9,
    quantity: 1,
    note: null,
    priceAtOrder: 12000,
    status: "served",
    createdAt: "2026-09-27 13:06",
  },

  {
    id: 3009,
    roundId: 2004,
    menuId: 15,
    quantity: 1,
    note: null,
    priceAtOrder: 12000,
    status: "served",
    createdAt: "2026-09-27 13:07",
  },

  {
    id: 3010,
    roundId: 2005,
    menuId: 22,
    quantity: 1,
    note: null,
    priceAtOrder: 5000,
    status: "cooking",
    createdAt: "2026-09-27 13:26",
  },

  {
    id: 3011,
    roundId: 2005,
    menuId: 24,
    quantity: 2,
    note: null,
    priceAtOrder: 4000,
    status: "waiting",
    createdAt: "2026-09-27 13:27",
  },

  {
    id: 3012,
    roundId: 2006,
    menuId: 11,
    quantity: 2,
    note: null,
    priceAtOrder: 12000,
    status: "served",
    createdAt: "2026-09-27 10:06",
  },
];

export async function SOrderItems(db) {
  try {
    for (const item of orderItems) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO order_items (
          order_item_id,
          round_id,
          menu_id,
          quantity,
          note,
          price_at_order,
          status,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          item.id,
          item.roundId,
          item.menuId,
          item.quantity,
          item.note,
          item.priceAtOrder,
          item.status,
          item.createdAt,
        ],
      );
    }

    return {
      ok: true,
      message: "Seed D7 Order Items สำเร็จ",
    };
  } catch (error) {
    console.error("seedOrderItems failed:", error);

    return {
      ok: false,
      message: "Seed D7 Order Items ไม่สำเร็จ",
    };
  }
}
