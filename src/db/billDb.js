export async function closeBill(db, billId) {
  try {
    const bill = await db.getFirstAsync(
      `
      SELECT
        bill_id,
        status
      FROM bills
      WHERE bill_id = ?
      `,
      [billId],
    );

    if (!bill) {
      return {
        ok: false,
        message: "ไม่พบ Bill",
      };
    }

    if (bill.status !== "open") {
      return {
        ok: false,
        message: "Bill นี้ปิดไปแล้ว",
      };
    }

    const unfinished = await db.getFirstAsync(
      `
      SELECT COUNT(*) AS count
      FROM order_items oi
      INNER JOIN order_rounds r
        ON r.round_id = oi.round_id
      WHERE r.bill_id = ?
        AND oi.status != 'served'
      `,
      [billId],
    );

    if (unfinished.count > 0) {
      return {
        ok: false,
        message: "ยังมีรายการอาหารที่ยังไม่เสิร์ฟ",
      };
    }

    const totalResult = await db.getFirstAsync(
      `
      SELECT
        COALESCE(
          SUM(
            oi.quantity * oi.price_at_order
          ),
          0
        ) AS total
      FROM order_rounds r
      INNER JOIN order_items oi
        ON oi.round_id = r.round_id
      WHERE r.bill_id = ?
      `,
      [billId],
    );

    const total = totalResult.total;

    const paidResult = await db.getFirstAsync(
      `
      SELECT
        COALESCE(SUM(amount), 0) AS paid
      FROM payments
      WHERE bill_id = ?
      `,
      [billId],
    );

    const paid = paidResult.paid;

    if (paid < total) {
      return {
        ok: false,
        message: "ยอดชำระเงินยังไม่ครบ",
      };
    }

    await db.runAsync(
      `
      UPDATE bills
      SET
        status = 'closed',
        closed_at = ?
      WHERE bill_id = ?
      `,
      [new Date().toISOString(), billId],
    );

    return {
      ok: true,
      message: "ปิด Bill สำเร็จ",
    };
  } catch (error) {
    console.error("closeBill failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถปิด Bill ได้",
    };
  }
}

export async function getBillDetail(db, billId) {
  try {
    const bill = await db.getFirstAsync(
      `
      SELECT
        bill_id,
        table_id,
        status,
        opened_at,
        closed_at
      FROM bills
      WHERE bill_id = ?
      `,
      [billId],
    );

    if (!bill) {
      return {
        ok: false,
        message: "ไม่พบ Bill",
      };
    }

    const rounds = await db.getAllAsync(
      `
      SELECT
        round_id,
        bill_id,
        round_number,
        created_at
      FROM order_rounds
      WHERE bill_id = ?
      ORDER BY round_number ASC
      `,
      [billId],
    );

    const items = await db.getAllAsync(
      `
      SELECT
        oi.order_item_id,
        oi.round_id,
        oi.menu_id,
        m.menu_name,
        oi.quantity,
        oi.note,
        oi.price_at_order,
        oi.status,
        oi.created_at,

        (
          oi.quantity * oi.price_at_order
        ) AS item_total

      FROM order_items oi

      INNER JOIN order_rounds r
        ON r.round_id = oi.round_id

      INNER JOIN menus m
        ON m.menu_id = oi.menu_id

      WHERE r.bill_id = ?

      ORDER BY
        oi.created_at ASC,
        oi.order_item_id ASC
      `,
      [billId],
    );

    return {
      ok: true,

      data: {
        ...bill,
        rounds,
        items,
      },
    };
  } catch (error) {
    console.error("getBillDetail failed:", error);

    return {
      ok: false,
      message: error?.message || "ไม่สามารถโหลดรายละเอียด Bill ได้",
    };
  }
}
