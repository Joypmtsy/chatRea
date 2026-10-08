export async function getTables(db) {
  try {
    const rows = await db.getAllAsync(`
      SELECT
        t.table_id,
        t.table_number,
        b.bill_id,
        b.status AS bill_status
      FROM tables t
      LEFT JOIN bills b
        ON b.table_id = t.table_id
        AND b.status = 'open'
      ORDER BY t.table_number ASC
    `);

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getTables failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงข้อมูลโต๊ะได้",
    };
  }
}

export async function getTableById(db, tableId) {
  try {
    const row = await db.getFirstAsync(
      `
      SELECT
        table_id,
        table_number
      FROM tables
      WHERE table_id = ?
      `,
      [tableId],
    );

    return {
      ok: true,
      data: row,
    };
  } catch (error) {
    console.error("getTableById failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงข้อมูลโต๊ะได้",
    };
  }
}

export async function getOpenBillByTable(db, tableId) {
  try {
    const row = await db.getFirstAsync(
      `
      SELECT
        bill_id,
        table_id,
        status,
        opened_at,
        closed_at
      FROM bills
      WHERE table_id = ?
        AND status = 'open'
      `,
      [tableId],
    );

    return {
      ok: true,
      data: row,
    };
  } catch (error) {
    console.error("getOpenBillByTable failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถตรวจสอบบิลโต๊ะได้",
    };
  }
}

export async function transferBillToTable(db, billId, fromTableId, toTableId) {
  try {
    if (fromTableId === toTableId) {
      return {
        ok: false,
        message: "โต๊ะต้นทางและโต๊ะปลายทางต้องไม่เหมือนกัน",
      };
    }

    await db.withTransactionAsync(async () => {
      const bill = await db.getFirstAsync(
        `
          SELECT
            bill_id,
            table_id,
            status
          FROM bills
          WHERE bill_id = ?
            AND status = 'open'
          `,
        [billId],
      );

      if (!bill) {
        throw new Error("ไม่พบบิลที่เปิดอยู่");
      }

      if (bill.table_id !== fromTableId) {
        throw new Error("โต๊ะต้นทางของบิลไม่ตรงกัน");
      }

      const destinationBill = await db.getFirstAsync(
        `
            SELECT bill_id
            FROM bills
            WHERE table_id = ?
              AND status = 'open'
            `,
        [toTableId],
      );

      if (destinationBill) {
        throw new Error("โต๊ะปลายทางมีบิลเปิดอยู่แล้ว");
      }

      await db.runAsync(
        `
          UPDATE bills
          SET table_id = ?
          WHERE bill_id = ?
          `,
        [toTableId, billId],
      );

      await db.runAsync(
        `
          INSERT INTO table_transfers (
            bill_id,
            from_table_id,
            to_table_id,
            transferred_at
          )
          VALUES (?, ?, ?, ?)
          `,
        [billId, fromTableId, toTableId, new Date().toISOString()],
      );
    });

    return {
      ok: true,
      message: "ย้ายโต๊ะสำเร็จ",
    };
  } catch (error) {
    console.error("transferBillToTable failed:", error);

    return {
      ok: false,
      message: error.message || "ไม่สามารถย้ายโต๊ะได้",
    };
  }
}
