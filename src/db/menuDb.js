export async function getCategories(db) {
  try {
    const rows = await db.getAllAsync(`
      SELECT
        category_id,
        category_name
      FROM categories
      ORDER BY category_id ASC
    `);

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getCategories failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงหมวดหมู่ได้",
    };
  }
}

export async function getMenus(db) {
  try {
    const rows = await db.getAllAsync(`
      SELECT
        m.menu_id,
        m.category_id,
        c.category_name,
        m.menu_name,
        m.is_available,
        mp.price
      FROM menus m
      INNER JOIN categories c
        ON c.category_id = m.category_id
      LEFT JOIN menu_prices mp
        ON mp.menu_id = m.menu_id
        AND mp.end_at IS NULL
      ORDER BY
        c.category_id ASC,
        m.menu_id ASC
    `);

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getMenus failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงข้อมูลเมนูได้",
    };
  }
}

export async function getAvailableMenus(db) {
  try {
    const rows = await db.getAllAsync(`
      SELECT
        m.menu_id,
        m.category_id,
        c.category_name,
        m.menu_name,
        mp.price
      FROM menus m
      INNER JOIN categories c
        ON c.category_id = m.category_id
      INNER JOIN menu_prices mp
        ON mp.menu_id = m.menu_id
        AND mp.end_at IS NULL
      WHERE m.is_available = 1
      ORDER BY
        c.category_id ASC,
        m.menu_id ASC
    `);

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getAvailableMenus failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงเมนูที่เปิดขายได้",
    };
  }
}

export async function getMenusByCategory(db, categoryId) {
  try {
    const rows = await db.getAllAsync(
      `
      SELECT
        m.menu_id,
        m.category_id,
        c.category_name,
        m.menu_name,
        m.is_available,
        mp.price
      FROM menus m
      INNER JOIN categories c
        ON c.category_id = m.category_id
      LEFT JOIN menu_prices mp
        ON mp.menu_id = m.menu_id
        AND mp.end_at IS NULL
      WHERE m.category_id = ?
      ORDER BY m.menu_id ASC
      `,
      [categoryId],
    );

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getMenusByCategory failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงเมนูตามหมวดหมู่ได้",
    };
  }
}

export async function updateMenuAvailability(db, menuId, isAvailable) {
  try {
    await db.runAsync(
      `
      UPDATE menus
      SET is_available = ?
      WHERE menu_id = ?
      `,
      [isAvailable, menuId],
    );

    return {
      ok: true,
      message: "เปลี่ยนสถานะเมนูสำเร็จ",
    };
  } catch (error) {
    console.error("updateMenuAvailability failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถเปลี่ยนสถานะเมนูได้",
    };
  }
}

export async function changeMenuPrice(db, menuId, newPrice, startAt) {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `
          UPDATE menu_prices
          SET end_at = ?
          WHERE menu_id = ?
            AND end_at IS NULL
          `,
        [startAt, menuId],
      );

      await db.runAsync(
        `
          INSERT INTO menu_prices (
            menu_id,
            price,
            start_at,
            end_at
          )
          VALUES (?, ?, ?, NULL)
          `,
        [menuId, newPrice, startAt],
      );
    });

    return {
      ok: true,
      message: "เปลี่ยนราคาเมนูสำเร็จ",
    };
  } catch (error) {
    console.error("changeMenuPrice failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถเปลี่ยนราคาเมนูได้",
    };
  }
}
