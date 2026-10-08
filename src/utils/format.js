export function baht(satang = 0) {
  return (
    (Number(satang) / 100).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " บาท"
  );
}
export function parsePrice(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(value).trim()))
    throw new Error("กรอกราคาเป็นตัวเลข ทศนิยมไม่เกิน 2 ตำแหน่ง");
  const amount = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(amount) || amount <= 0)
    throw new Error("ราคาต้องมากกว่า 0");
  return amount;
}
export function tableNumber(value) {
  return String(value).padStart(2, "0");
}
export function dateRange(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day))
    throw new Error("ใช้วันที่รูปแบบ YYYY-MM-DD");
  const [year, month, date] = day.split("-").map(Number);
  const start = new Date(year, month - 1, date);
  if (
    start.getFullYear() !== year ||
    start.getMonth() !== month - 1 ||
    start.getDate() !== date
  )
    throw new Error("วันที่ไม่ถูกต้อง");
  const end = new Date(year, month - 1, date + 1);
  return [start.toISOString(), end.toISOString()];
}
export function today() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
export function displayTime(value) {
  if (!value) return "–";
  const normalized = value.includes("T")
    ? value
    : value.replace(" ", "T") + "Z";
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("th-TH");
}

export function reportRange(firstDay, lastDay) {
  const [start] = dateRange(firstDay);
  const [, end] = dateRange(lastDay);
  if (new Date(start) >= new Date(end))
    throw new Error("วันสิ้นสุดต้องไม่อยู่ก่อนวันเริ่มต้น");
  return [start, end];
}
