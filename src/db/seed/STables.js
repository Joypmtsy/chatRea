export async function STables(db) {
  try {
    for (let i = 1; i <= 15; i++) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO tables (
          table_id,
          table_number
        )
        VALUES (?, ?)
        `,
        [i, i],
      );
    }

    return {
      ok: true,
      message: "Seed D1 Tables สำเร็จ",
    };
  } catch (error) {
    console.error("seedTables failed:", error);

    return {
      ok: false,
      message: "Seed D1 Tables ไม่สำเร็จ",
    };
  }
}
