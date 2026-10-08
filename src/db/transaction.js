const queues = new WeakMap();
export function transaction(db, task) {
  const previous = queues.get(db) || Promise.resolve();
  const next = previous
    .catch(() => {})
    .then(async () => {
      let value;

      await db.withTransactionAsync(async () => {
        value = await task(db);
      });
      return value;
    });
  queues.set(db, next);
  return next;
}
export function resultData(result) {
  if (!result.ok) throw new Error(result.message || "ไม่สามารถดำเนินการได้");
  return result.data;
}
export function positiveId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0)
    throw new Error("ข้อมูลอ้างอิงไม่ถูกต้อง");
  return id;
}
