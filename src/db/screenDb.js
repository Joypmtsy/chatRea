import { initDb } from "./restaurantDb";
import { STables } from "./seed/STables";
import { SCategories } from "./seed/SCategories";
import { SMenus } from "./seed/SMenus";
import { SMenuPrices } from "./seed/SMenuPrices";
import { getTables } from "./tableDb";
import { getBillDetail } from "./billDb";
import { getCategories, getMenus, getAvailableMenus } from "./menuDb";
import { getKitchenQueue } from "./kitchenDb";
import { transaction, positiveId, resultData } from "./transaction";

export async function initializeRestaurant(db) {
  resultData(await initDb(db));
  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);",
  );
  const seeded = await db.getFirstAsync(
    "SELECT value FROM app_meta WHERE key = 'master_seeded'",
  );
  if (!seeded) {
    await transaction(db, async (txn) => {
      const count = await txn.getFirstAsync(
        "SELECT COUNT(*) AS count FROM menus",
      );
      if (!count.count) {
        for (const seed of [STables, SCategories, SMenus, SMenuPrices])
          resultData(await seed(txn));
      }
      await txn.runAsync(
        "INSERT OR REPLACE INTO app_meta (key, value) VALUES ('master_seeded', '1')",
      );
    });
  }
}

export async function tablesForScreen(db) {
  return resultData(await getTables(db)).map((row) => ({
    id: row.table_id,
    number: String(row.table_number).padStart(2, "0"),
    status: row.bill_id ? "occupied" : "available",
    billId: row.bill_id,
  }));
}
export async function menusForScreen(db, availableOnly = false) {
  const [menus, categories] = await Promise.all([
    availableOnly ? getAvailableMenus(db) : getMenus(db),
    getCategories(db),
  ]);
  return {
    menus: resultData(menus).map((row) => ({
      id: row.menu_id,
      name: row.menu_name,
      categoryId: row.category_id,
      categoryName: row.category_name,
      price: row.price / 100,
      available: row.is_available === 1,
    })),
    categories: resultData(categories).map((row) => ({
      id: row.category_id,
      name: row.category_name,
    })),
  };
}
export async function billForScreen(db, id) {
  const data = resultData(await getBillDetail(db, positiveId(id)));
  const table = await db.getFirstAsync(
    "SELECT table_number FROM tables WHERE table_id = ?",
    data.table_id,
  );
  const payments = await db.getFirstAsync(
    "SELECT COALESCE(SUM(amount), 0) AS paid FROM payments WHERE bill_id = ?",
    data.bill_id,
  );
  const total = await db.getFirstAsync(
    "SELECT COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total FROM order_rounds r JOIN order_items oi ON oi.round_id = r.round_id WHERE r.bill_id = ?",
    data.bill_id,
  );
  return {
    ...data,
    tableNumber: table.table_number,
    total: total.total,
    paid: payments.paid,
    rounds: data.rounds.map((round) => ({
      ...round,
      items: data.items.filter((item) => item.round_id === round.round_id),
    })),
  };
}
export async function kitchenForScreen(db) {
  return resultData(await getKitchenQueue(db)).map((row) => ({
    orderId: row.order_item_id,
    orderItemId: row.order_item_id,
    roundId: row.round_id,
    billId: row.bill_id,
    tableNumber: String(row.table_number).padStart(2, "0"),
    roundNumber: row.round_number,
    menuName: row.menu_name,
    quantity: row.quantity,
    note: row.note,
    status: row.status,
    createdAt: row.created_at,
  }));
}
export async function openTable(db, tableId) {
  return transaction(db, async (txn) => {
    const id = positiveId(tableId);
    const table = await txn.getFirstAsync(
      "SELECT table_id FROM tables WHERE table_id = ?",
      id,
    );
    if (!table) throw new Error("ไม่พบโต๊ะ");
    const bill = await txn.getFirstAsync(
      "SELECT bill_id FROM bills WHERE table_id = ? AND status = 'open'",
      id,
    );
    if (bill) return bill.bill_id;
    const result = await txn.runAsync(
      "INSERT INTO bills (table_id, status, opened_at) VALUES (?, 'open', ?)",
      id,
      new Date().toISOString(),
    );
    return result.lastInsertRowId;
  });
}
export async function submitOrder(db, billId, items) {
  return transaction(db, async (txn) => {
    const id = positiveId(billId);
    const bill = await txn.getFirstAsync(
      "SELECT status FROM bills WHERE bill_id = ?",
      id,
    );
    if (!bill || bill.status !== "open")
      throw new Error("บิลนี้ปิดแล้วหรือไม่พบข้อมูล");
    if (!Array.isArray(items) || !items.length)
      throw new Error("ตะกร้ายังว่าง");
    const timestamp = new Date().toISOString();
    const round = await txn.runAsync(
      "INSERT INTO order_rounds (bill_id, round_number, created_at) VALUES (?, (SELECT COALESCE(MAX(round_number), 0) + 1 FROM order_rounds WHERE bill_id = ?), ?)",
      id,
      id,
      timestamp,
    );
    for (const item of items) {
      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0)
        throw new Error("จำนวนอาหารไม่ถูกต้อง");
      const menu = await txn.getFirstAsync(
        "SELECT mp.price FROM menus m JOIN menu_prices mp ON m.menu_id = mp.menu_id AND mp.end_at IS NULL WHERE m.menu_id = ? AND m.is_available = 1",
        positiveId(item.menuId),
      );
      if (!menu) throw new Error("มีเมนูที่ปิดขาย กรุณากลับไปตรวจสอบเมนู");
      await txn.runAsync(
        "INSERT INTO order_items (round_id, menu_id, quantity, note, price_at_order, status, created_at) VALUES (?, ?, ?, ?, ?, 'waiting', ?)",
        round.lastInsertRowId,
        item.menuId,
        item.quantity,
        item.note || null,
        menu.price,
        timestamp,
      );
    }
    return round.lastInsertRowId;
  });
}
export async function moveTable(db, billId, fromId, toId) {
  return transaction(db, async (txn) => {
    const from = positiveId(fromId),
      to = positiveId(toId);
    if (from === to) throw new Error("เลือกโต๊ะปลายทางที่ต่างจากเดิม");
    const bill = await txn.getFirstAsync(
      "SELECT table_id FROM bills WHERE bill_id = ? AND status = 'open'",
      positiveId(billId),
    );
    if (!bill || bill.table_id !== from)
      throw new Error("ข้อมูลโต๊ะเปลี่ยนแล้ว กรุณาโหลดใหม่");
    const destination = await txn.getFirstAsync(
      "SELECT table_id FROM tables WHERE table_id = ?",
      to,
    );
    if (!destination) throw new Error("ไม่พบโต๊ะปลายทาง");
    if (
      await txn.getFirstAsync(
        "SELECT bill_id FROM bills WHERE table_id = ? AND status = 'open'",
        to,
      )
    )
      throw new Error("โต๊ะปลายทางไม่ว่างแล้ว");
    await txn.runAsync(
      "UPDATE bills SET table_id = ? WHERE bill_id = ?",
      to,
      billId,
    );
    await txn.runAsync(
      "INSERT INTO table_transfers (bill_id, from_table_id, to_table_id, transferred_at) VALUES (?, ?, ?, ?)",
      billId,
      from,
      to,
      new Date().toISOString(),
    );
  });
}
export async function setMenuAvailable(db, menuId, available) {
  return transaction(db, async (txn) => {
    const result = await txn.runAsync(
      "UPDATE menus SET is_available = ? WHERE menu_id = ?",
      available ? 1 : 0,
      positiveId(menuId),
    );
    if (!result.changes) throw new Error("ไม่พบเมนู");
  });
}
export async function setMenuPrice(db, menuId, amount) {
  if (!Number.isSafeInteger(amount) || amount <= 0)
    throw new Error("ราคาไม่ถูกต้อง");
  return transaction(db, async (txn) => {
    const id = positiveId(menuId);
    const current = await txn.getFirstAsync(
      "SELECT start_at FROM menu_prices WHERE menu_id = ? AND end_at IS NULL",
      id,
    );
    if (!current) throw new Error("ไม่พบราคาปัจจุบัน");

    const now = new Date(
      Math.max(Date.now(), new Date(current.start_at).getTime() + 1),
    ).toISOString();
    await txn.runAsync(
      "UPDATE menu_prices SET end_at = ? WHERE menu_id = ? AND end_at IS NULL",
      now,
      id,
    );
    await txn.runAsync(
      "INSERT INTO menu_prices (menu_id, price, start_at) VALUES (?, ?, ?)",
      id,
      amount,
      now,
    );
  });
}
export async function advanceKitchenItem(db, id, status) {
  const next = { waiting: "cooking", cooking: "served" }[status];
  if (!next) throw new Error("รายการนี้เสิร์ฟแล้ว");
  return transaction(db, async (txn) => {
    const result = await txn.runAsync(
      "UPDATE order_items SET status = ? WHERE order_item_id = ? AND status = ?",
      next,
      positiveId(id),
      status,
    );
    if (!result.changes) throw new Error("สถานะเปลี่ยนแล้ว กรุณาโหลดใหม่");
  });
}
export async function settleBill(db, id, method) {
  if (!["cash", "qr"].includes(method))
    throw new Error("วิธีชำระเงินไม่ถูกต้อง");
  return transaction(db, async (txn) => {
    const bill = await txn.getFirstAsync(
      "SELECT status FROM bills WHERE bill_id = ?",
      positiveId(id),
    );
    if (!bill || bill.status !== "open")
      throw new Error("บิลนี้ปิดแล้วหรือไม่พบข้อมูล");
    const amounts = await txn.getFirstAsync(
      "SELECT COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total, COALESCE(SUM(CASE WHEN oi.status != 'served' THEN 1 ELSE 0 END), 0) AS unfinished FROM order_rounds r LEFT JOIN order_items oi ON oi.round_id = r.round_id WHERE r.bill_id = ?",
      id,
    );
    if (amounts.unfinished > 0)
      throw new Error("ยังมีอาหารที่ไม่เสิร์ฟ กรุณาตรวจคิวครัว");
    const paid = await txn.getFirstAsync(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE bill_id = ?",
      id,
    );
    const balance = Math.max(0, amounts.total - paid.total);
    const now = new Date().toISOString();
    if (balance)
      await txn.runAsync(
        "INSERT INTO payments (bill_id, amount, payment_method, paid_at) VALUES (?, ?, ?, ?)",
        id,
        balance,
        method,
        now,
      );
    await txn.runAsync(
      "UPDATE bills SET status = 'closed', closed_at = ? WHERE bill_id = ? AND status = 'open'",
      now,
      id,
    );
  });
}
export async function clearTransactions(db) {
  return transaction(db, async (txn) => {
    await txn.execAsync(
      "DELETE FROM table_transfers; DELETE FROM payments; DELETE FROM order_items; DELETE FROM order_rounds; DELETE FROM bills;",
    );
  });
}

export async function reportForScreen(db, start, end) {
  const range = [start, end];
  const [bills, categories, topMenus, payments, summary] = await Promise.all([
    db.getAllAsync(
      `SELECT b.bill_id, t.table_number, b.opened_at, b.closed_at, COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total FROM bills b JOIN tables t ON t.table_id = b.table_id LEFT JOIN order_rounds r ON r.bill_id = b.bill_id LEFT JOIN order_items oi ON oi.round_id = r.round_id WHERE b.status = 'closed' AND julianday(b.closed_at) >= julianday(?) AND julianday(b.closed_at) < julianday(?) GROUP BY b.bill_id ORDER BY b.closed_at DESC`,
      range,
    ),
    db.getAllAsync(
      `SELECT c.category_id, c.category_name, SUM(oi.quantity) AS quantity, SUM(oi.quantity * oi.price_at_order) AS total FROM bills b JOIN order_rounds r ON r.bill_id = b.bill_id JOIN order_items oi ON oi.round_id = r.round_id JOIN menus m ON m.menu_id = oi.menu_id JOIN categories c ON c.category_id = m.category_id WHERE b.status = 'closed' AND julianday(b.closed_at) >= julianday(?) AND julianday(b.closed_at) < julianday(?) GROUP BY c.category_id ORDER BY total DESC`,
      range,
    ),
    db.getAllAsync(
      `SELECT m.menu_id, m.menu_name, SUM(oi.quantity) AS quantity, SUM(oi.quantity * oi.price_at_order) AS total FROM bills b JOIN order_rounds r ON r.bill_id = b.bill_id JOIN order_items oi ON oi.round_id = r.round_id JOIN menus m ON m.menu_id = oi.menu_id WHERE b.status = 'closed' AND julianday(b.closed_at) >= julianday(?) AND julianday(b.closed_at) < julianday(?) GROUP BY m.menu_id ORDER BY quantity DESC, m.menu_id LIMIT 10`,
      range,
    ),
    db.getAllAsync(
      `SELECT p.payment_method, SUM(p.amount) AS total FROM payments p JOIN bills b ON b.bill_id = p.bill_id WHERE b.status = 'closed' AND julianday(b.closed_at) >= julianday(?) AND julianday(b.closed_at) < julianday(?) GROUP BY p.payment_method`,
      range,
    ),
    db.getFirstAsync(
      "SELECT COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total FROM bills b JOIN order_rounds r ON r.bill_id = b.bill_id JOIN order_items oi ON oi.round_id = r.round_id WHERE b.status = 'closed' AND julianday(b.closed_at) >= julianday(?) AND julianday(b.closed_at) < julianday(?)",
      range,
    ),
  ]);
  return {
    bills,
    categories,
    topMenus,
    total: summary.total,
    cash: payments.find((item) => item.payment_method === "cash")?.total || 0,
    qr: payments.find((item) => item.payment_method === "qr")?.total || 0,
  };
}
export async function dashboardForScreen(db, start, end) {
  const [tables, queue, report, recent, unavailable] = await Promise.all([
    tablesForScreen(db),
    kitchenForScreen(db),
    reportForScreen(db, start, end),
    db.getAllAsync(
      "SELECT oi.order_item_id, oi.quantity, oi.status, oi.created_at, m.menu_name, t.table_number FROM order_items oi JOIN order_rounds r ON r.round_id = oi.round_id JOIN bills b ON b.bill_id = r.bill_id JOIN tables t ON t.table_id = b.table_id JOIN menus m ON m.menu_id = oi.menu_id ORDER BY oi.order_item_id DESC LIMIT 10",
    ),
    db.getFirstAsync(
      "SELECT COUNT(*) AS count FROM menus WHERE is_available = 0",
    ),
  ]);
  return { tables, queue, report, recent, unavailable: unavailable.count };
}

export async function kitchenDetailForScreen(db, roundId) {
  const id = positiveId(roundId);
  const round = await db.getFirstAsync(
    "SELECT r.round_number, b.bill_id, t.table_number FROM order_rounds r JOIN bills b ON b.bill_id=r.bill_id JOIN tables t ON t.table_id=b.table_id WHERE r.round_id=?",
    id,
  );
  if (!round) throw new Error("ไม่พบรอบออเดอร์");
  const items = await db.getAllAsync(
    "SELECT oi.*, m.menu_name FROM order_items oi JOIN menus m ON m.menu_id=oi.menu_id WHERE round_id=? ORDER BY order_item_id",
    id,
  );
  return { round, items };
}
