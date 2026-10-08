const menus = [
  {
    id: 1,
    categoryId: 1,
    name: "ต้มยำกุ้ง",
    available: 1,
  },

  {
    id: 2,
    categoryId: 1,
    name: "ต้มข่าไก่",
    available: 1,
  },

  {
    id: 3,
    categoryId: 1,
    name: "แกงเขียวหวานไก่",
    available: 1,
  },

  {
    id: 4,
    categoryId: 1,
    name: "แกงจืดเต้าหู้หมูสับ",
    available: 1,
  },

  {
    id: 5,
    categoryId: 1,
    name: "แกงเผ็ดเป็ดย่าง",
    available: 1,
  },

  {
    id: 6,
    categoryId: 2,
    name: "ผัดกะเพราหมูสับ",
    available: 1,
  },

  {
    id: 7,
    categoryId: 2,
    name: "ผัดกะเพราไก่",
    available: 1,
  },

  {
    id: 8,
    categoryId: 2,
    name: "ผัดผักรวม",
    available: 1,
  },

  {
    id: 9,
    categoryId: 2,
    name: "ข้าวผัดกุ้ง",
    available: 1,
  },

  {
    id: 10,
    categoryId: 2,
    name: "ผัดซีอิ๊วหมู",
    available: 1,
  },

  {
    id: 11,
    categoryId: 2,
    name: "ผัดไทยกุ้ง",
    available: 1,
  },

  {
    id: 12,
    categoryId: 2,
    name: "ข้าวไข่เจียวหมูสับ",
    available: 1,
  },

  {
    id: 13,
    categoryId: 3,
    name: "ปลาทอดสมุนไพร",
    available: 1,
  },

  {
    id: 14,
    categoryId: 3,
    name: "ไก่ทอด",
    available: 1,
  },

  {
    id: 15,
    categoryId: 3,
    name: "ปีกไก่ทอด",
    available: 1,
  },

  {
    id: 16,
    categoryId: 3,
    name: "ส้มตำไทย",
    available: 1,
  },

  {
    id: 17,
    categoryId: 3,
    name: "ยำวุ้นเส้น",
    available: 1,
  },

  {
    id: 18,
    categoryId: 3,
    name: "ยำทะเล",
    available: 1,
  },

  {
    id: 19,
    categoryId: 3,
    name: "ทอดมันปลา",
    available: 1,
  },

  {
    id: 20,
    categoryId: 4,
    name: "น้ำเปล่า",
    available: 1,
  },

  {
    id: 21,
    categoryId: 4,
    name: "ชาเย็น",
    available: 1,
  },

  {
    id: 22,
    categoryId: 4,
    name: "กาแฟเย็น",
    available: 1,
  },

  {
    id: 23,
    categoryId: 4,
    name: "น้ำอัดลม",
    available: 1,
  },

  {
    id: 24,
    categoryId: 4,
    name: "ไอศกรีม",
    available: 1,
  },

  {
    id: 25,
    categoryId: 4,
    name: "ขนมหวานรวม",
    available: 1,
  },
];

export async function SMenus(db) {
  try {
    for (const menu of menus) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO menus (
          menu_id,
          category_id,
          menu_name,
          is_available
        )
        VALUES (?, ?, ?, ?)
        `,
        [menu.id, menu.categoryId, menu.name, menu.available],
      );
    }

    return {
      ok: true,
      message: "Seed D3 Menus สำเร็จ",
    };
  } catch (error) {
    console.error("seedMenus failed:", error);

    return {
      ok: false,
      message: "Seed D3 Menus ไม่สำเร็จ",
    };
  }
}
