export async function createOrderRound(db, billId) {
  try {
    const result = await db.runAsync(
      `
      INSERT INTO order_rounds (
        bill_id,
        round_number,
        created_at
      )
      VALUES (
        ?,
        (
          SELECT COALESCE(MAX(round_number), 0) + 1
          FROM order_rounds
          WHERE bill_id = ?
        ),
        datetime('now')
      )
      `,
      [billId, billId],
    );

    return {
      ok: true,
      roundId: result.lastInsertRowId,
      message: "สร้างรอบ Order สำเร็จ",
    };
  } catch (error) {
    console.error("createOrderRound failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถสร้างรอบ Order ได้",
    };
  }
}

export async function addOrderItems(db, roundId, items) {
  try {
    for (const item of items) {
      const menu = await db.getFirstAsync(
        `
        SELECT
          m.menu_id,
          mp.price
        FROM menus m
        JOIN menu_prices mp
          ON mp.menu_id = m.menu_id
          AND mp.end_at IS NULL
        WHERE m.menu_id = ?
          AND m.is_available = 1
        `,
        [item.menuId],
      );

      if (!menu) {
        throw new Error("Menu " + item.menuId + " is not available");
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("Invalid quantity for menu " + item.menuId);
      }

      await db.runAsync(
        `
        INSERT INTO order_items (
          round_id,
          menu_id,
          quantity,
          price_at_order,
          note,
          status,
          created_at
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          'waiting',
          datetime('now')
        )
        `,
        [roundId, item.menuId, item.quantity, menu.price, item.note ?? null],
      );
    }

    return {
      ok: true,
      message: "เพิ่มรายการ Order สำเร็จ",
    };
  } catch (error) {
    console.error("addOrderItems failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถเพิ่มรายการ Order ได้",
    };
  }
}

export async function createOrderWithItems(db, { billId, items }) {
  try {
    if (!billId) {
      return {
        ok: false,
        message: "ไม่พบ Bill",
      };
    }

    if (!Array.isArray(items) || items.length === 0) {
      return {
        ok: false,
        message: "ไม่มีรายการอาหาร",
      };
    }

    const result = await db.withTransactionAsync(async () => {
      const roundResult = await db.runAsync(
        `
          INSERT INTO order_rounds (
            bill_id,
            round_number,
            created_at
          )
          VALUES (
            ?,
            (
              SELECT COALESCE(MAX(round_number), 0) + 1
              FROM order_rounds
              WHERE bill_id = ?
            ),
            datetime('now')
          )
          `,
        [billId, billId],
      );

      const roundId = roundResult.lastInsertRowId;

      for (const item of items) {
        const menu = await db.getFirstAsync(
          `
            SELECT
              m.menu_id,
              mp.price
            FROM menus m
            JOIN menu_prices mp
              ON mp.menu_id = m.menu_id
              AND mp.end_at IS NULL
            WHERE m.menu_id = ?
              AND m.is_available = 1
            `,
          [item.menuId],
        );

        if (!menu) {
          throw new Error("Menu " + item.menuId + " is not available");
        }

        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error("Invalid quantity for menu " + item.menuId);
        }

        await db.runAsync(
          `
            INSERT INTO order_items (
              round_id,
              menu_id,
              quantity,
              price_at_order,
              note,
              status,
              created_at
            )
            VALUES (
              ?,
              ?,
              ?,
              ?,
              ?,
              'waiting',
              datetime('now')
            )
            `,
          [roundId, item.menuId, item.quantity, menu.price, item.note ?? null],
        );
      }

      return {
        roundId,
        itemCount: items.length,
      };
    });

    return {
      ok: true,
      data: result,
      message: "บันทึก Order สำเร็จ",
    };
  } catch (error) {
    console.error("createOrderWithItems failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถบันทึก Order ได้",
    };
  }
}
