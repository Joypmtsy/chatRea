export async function getSalesSummary(db, startAt, endAt) {
  try {
    const row = await db.getFirstAsync(
      `
        SELECT
          COUNT(DISTINCT b.bill_id)
            AS bill_count,

          COALESCE(
            SUM(
              oi.quantity *
              oi.price_at_order
            ),
            0
          ) AS sales_total

        FROM bills b

        LEFT JOIN order_rounds r
          ON r.bill_id = b.bill_id

        LEFT JOIN order_items oi
          ON oi.round_id = r.round_id

        WHERE b.status = 'closed'
          AND b.closed_at >= ?
          AND b.closed_at < ?
        `,
      [startAt, endAt],
    );

    return {
      ok: true,
      data: row,
    };
  } catch (error) {
    console.error("getSalesSummary failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงสรุปยอดขายได้",
    };
  }
}

export async function getCategorySales(db, startAt, endAt) {
  try {
    const rows = await db.getAllAsync(
      `
        SELECT
          c.category_id,
          c.category_name,

          COALESCE(
            SUM(
              oi.quantity *
              oi.price_at_order
            ),
            0
          ) AS sales_total,

          COALESCE(
            SUM(oi.quantity),
            0
          ) AS quantity_total

        FROM bills b

        INNER JOIN order_rounds r
          ON r.bill_id = b.bill_id

        INNER JOIN order_items oi
          ON oi.round_id = r.round_id

        INNER JOIN menus m
          ON m.menu_id = oi.menu_id

        INNER JOIN categories c
          ON c.category_id = m.category_id

        WHERE b.status = 'closed'
          AND b.closed_at >= ?
          AND b.closed_at < ?

        GROUP BY
          c.category_id,
          c.category_name

        ORDER BY
          sales_total DESC
        `,
      [startAt, endAt],
    );

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getCategorySales failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงยอดขายตามหมวดหมู่ได้",
    };
  }
}

export async function getTop10Menus(db, startAt, endAt) {
  try {
    const rows = await db.getAllAsync(
      `
        SELECT
          m.menu_id,
          m.menu_name,

          SUM(oi.quantity)
            AS quantity_total,

          SUM(
            oi.quantity *
            oi.price_at_order
          ) AS sales_total

        FROM bills b

        INNER JOIN order_rounds r
          ON r.bill_id = b.bill_id

        INNER JOIN order_items oi
          ON oi.round_id = r.round_id

        INNER JOIN menus m
          ON m.menu_id = oi.menu_id

        WHERE b.status = 'closed'
          AND b.closed_at >= ?
          AND b.closed_at < ?

        GROUP BY
          m.menu_id,
          m.menu_name

        ORDER BY
          quantity_total DESC

        LIMIT 10
        `,
      [startAt, endAt],
    );

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getTop10Menus failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึง Top 10 เมนูได้",
    };
  }
}

export async function getBillHistory(db, startAt, endAt) {
  try {
    const rows = await db.getAllAsync(
      `
        SELECT
          b.bill_id,
          t.table_number,
          b.opened_at,
          b.closed_at,

          COALESCE(
            SUM(
              oi.quantity *
              oi.price_at_order
            ),
            0
          ) AS total

        FROM bills b

        INNER JOIN tables t
          ON t.table_id = b.table_id

        LEFT JOIN order_rounds r
          ON r.bill_id = b.bill_id

        LEFT JOIN order_items oi
          ON oi.round_id = r.round_id

        WHERE b.status = 'closed'
          AND b.closed_at >= ?
          AND b.closed_at < ?

        GROUP BY
          b.bill_id,
          t.table_number,
          b.opened_at,
          b.closed_at

        ORDER BY
          b.closed_at DESC
        `,
      [startAt, endAt],
    );

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getBillHistory failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงประวัติบิลได้",
    };
  }
}
