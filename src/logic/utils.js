import { SolarDate } from "lunar-date-vn";

/**
 * Quy đổi ngày dương lịch sang năm âm lịch tương ứng
 * @param {string} dateStr - Chuỗi ngày dạng YYYY-MM-DD
 * @returns {number} Năm âm lịch tương ứng
 */
export function layNamAmLich(dateStr) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Khởi tạo SolarDate từ thư viện lunar-date-vn
    const solarDate = new SolarDate({ day, month, year });
    const lunarDate = solarDate.toLunarDate();

    return lunarDate.year;
  } catch (error) {
    console.error("Lỗi quy đổi dương lịch sang âm lịch:", error);
    // Fallback sang năm dương lịch nếu xảy ra lỗi
    return new Date(dateStr).getFullYear();
  }
}
