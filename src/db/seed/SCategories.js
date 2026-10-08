const categories = [
  { id: 1, name: "ต้ม / แกง" },
  { id: 2, name: "ผัด / จานหลัก" },
  { id: 3, name: "ทอด / ยำ" },
  { id: 4, name: "เครื่องดื่ม / ของหวาน" },
];

export async function SCategories(db) {
  try {
    for (const category of categories) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO categories (
          category_id,
          category_name
        )
        VALUES (?, ?)
        `,
        [category.id, category.name],
      );
    }

    return {
      ok: true,
      message: "Seed D2 Categories สำเร็จ",
    };
  } catch (_error) {
    return {
      ok: false,
      message: "Seed D2 Categories ไม่สำเร็จ",
    };
  }
}
