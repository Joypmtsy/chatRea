export const DATABASE_NAME = "restaurant-order-01418342.db";

export async function initDb(db) {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS tables (
        table_id INTEGER PRIMARY KEY,
        table_number INTEGER NOT NULL UNIQUE
          CHECK (table_number BETWEEN 1 AND 15)
      );

      CREATE TABLE IF NOT EXISTS categories (
        category_id INTEGER PRIMARY KEY,
        category_name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS menus (
        menu_id INTEGER PRIMARY KEY,
        category_id INTEGER NOT NULL,
        menu_name TEXT NOT NULL,
        is_available INTEGER NOT NULL DEFAULT 1
          CHECK (is_available IN (0, 1)),

        FOREIGN KEY (category_id)
          REFERENCES categories(category_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS menu_prices (
        price_id INTEGER PRIMARY KEY,
        menu_id INTEGER NOT NULL,
        price INTEGER NOT NULL
          CHECK (price > 0),
        start_at TEXT NOT NULL,
        end_at TEXT,

        CHECK (
          end_at IS NULL
          OR end_at > start_at
        ),

        FOREIGN KEY (menu_id)
          REFERENCES menus(menu_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
      );

      CREATE UNIQUE INDEX IF NOT EXISTS
        ux_menu_prices_current
      ON menu_prices(menu_id)
      WHERE end_at IS NULL;

      CREATE TABLE IF NOT EXISTS bills (
        bill_id INTEGER PRIMARY KEY,
        table_id INTEGER NOT NULL,

        status TEXT NOT NULL
          CHECK (status IN ('open', 'closed')),

        opened_at TEXT NOT NULL,
        closed_at TEXT,

        CHECK (
          (status = 'open' AND closed_at IS NULL)
          OR
          (status = 'closed' AND closed_at IS NOT NULL)
        ),

        FOREIGN KEY (table_id)
          REFERENCES tables(table_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
      );

      CREATE UNIQUE INDEX IF NOT EXISTS
        ux_bills_one_open_per_table
      ON bills(table_id)
      WHERE status = 'open';

      CREATE TABLE IF NOT EXISTS order_rounds (
        round_id INTEGER PRIMARY KEY,

        bill_id INTEGER NOT NULL,

        round_number INTEGER NOT NULL
          CHECK (round_number > 0),

        created_at TEXT NOT NULL,

        UNIQUE (
          bill_id,
          round_number
        ),

        FOREIGN KEY (bill_id)
          REFERENCES bills(bill_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS order_items (
        order_item_id INTEGER PRIMARY KEY,

        round_id INTEGER NOT NULL,

        menu_id INTEGER NOT NULL,

        quantity INTEGER NOT NULL
          CHECK (quantity > 0),

        note TEXT,

        price_at_order INTEGER NOT NULL
          CHECK (price_at_order > 0),

        status TEXT NOT NULL
          DEFAULT 'waiting'
          CHECK (
            status IN (
              'waiting',
              'cooking',
              'served'
            )
          ),

        created_at TEXT NOT NULL,

        FOREIGN KEY (round_id)
          REFERENCES order_rounds(round_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT,

        FOREIGN KEY (menu_id)
          REFERENCES menus(menu_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS payments (
        payment_id INTEGER PRIMARY KEY,

        bill_id INTEGER NOT NULL,

        amount INTEGER NOT NULL
          CHECK (amount > 0),

        payment_method TEXT NOT NULL,

        paid_at TEXT NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (bill_id)
          REFERENCES bills(bill_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS table_transfers (
        transfer_id INTEGER PRIMARY KEY,

        bill_id INTEGER NOT NULL,

        from_table_id INTEGER NOT NULL,

        to_table_id INTEGER NOT NULL,

        transferred_at TEXT NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        CHECK (
          from_table_id <> to_table_id
        ),

        FOREIGN KEY (bill_id)
          REFERENCES bills(bill_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT,

        FOREIGN KEY (from_table_id)
          REFERENCES tables(table_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT,

        FOREIGN KEY (to_table_id)
          REFERENCES tables(table_id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
      );

      CREATE INDEX IF NOT EXISTS
        idx_order_items_status
      ON order_items(status);

      CREATE INDEX IF NOT EXISTS
        idx_order_items_created
      ON order_items(created_at);

      CREATE INDEX IF NOT EXISTS
        idx_order_rounds_created
      ON order_rounds(created_at);

      CREATE INDEX IF NOT EXISTS
        idx_bills_closed_at
      ON bills(closed_at);

    `);

    return {
      ok: true,
      message: "สร้าง Database D1–D9 สำเร็จ",
    };
  } catch (error) {
    console.error("initDb failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถสร้าง Database ได้",
    };
  }
}

export async function resetTransactions(db) {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`
        DELETE FROM table_transfers;
      `);

      await db.runAsync(`
        DELETE FROM payments;
      `);

      await db.runAsync(`
        DELETE FROM order_items;
      `);

      await db.runAsync(`
        DELETE FROM order_rounds;
      `);

      await db.runAsync(`
        DELETE FROM bills;
      `);
    });

    return {
      ok: true,
      message: "ล้างข้อมูล Transaction สำเร็จ",
    };
  } catch (error) {
    console.error("resetTransactions failed:", error);

    return {
      ok: false,
      message: "Reset ไม่สำเร็จ",
    };
  }
}
