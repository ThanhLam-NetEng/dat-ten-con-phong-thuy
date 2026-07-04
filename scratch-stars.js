import { SolarDate } from "lunar-date-vn";

const stars = [
  "Giác", "Cang", "Đê", "Phòng", "Tâm", "Vĩ", "Cơ",
  "Đẩu", "Ngưu", "Nữ", "Hư", "Nguy", "Thất", "Bích",
  "Khuê", "Lâu", "Vị", "Mão", "Tất", "Chủy", "Sâm",
  "Tỉnh", "Quỷ", "Liễu", "Tinh", "Trương", "Dực", "Chẩn"
];

// Let's check 2026-08-04 (Tuesday) which the Facebook post says is SAO VĨ
const date1 = new SolarDate({ day: 4, month: 8, year: 2026 });
const lunar1 = date1.toLunarDate();
console.log("2026-08-04 jd:", lunar1.jd);
const computedIdx1 = (lunar1.jd + 17) % 28; // Let's check what offset gives Vĩ (index 5)
console.log("computed star with offset 17:", stars[computedIdx1]);

// Let's print out the day of the week and Julian Date to confirm the constant offset
const dates = [
  { d: 4, m: 8, y: 2026, expected: "Vĩ" }, // Tuesday
  { d: 28, m: 7, y: 2026, expected: "Tất" }, // Tuesday? Wait, July 28, 2026 is Tuesday. Let's see what star it is.
];

for (const item of dates) {
  const sd = new SolarDate({ day: item.d, month: item.m, year: item.y });
  const ld = sd.toLunarDate();
  console.log(`Date: ${item.d}/${item.m}/${item.y}, jd: ${ld.jd}, weekday: ${sd.getDayOfWeek()}`);
}
