import { SolarDate } from "lunar-date-vn";

const solarDate = new SolarDate({ day: 4, month: 7, year: 2026 });
const lunarDate = solarDate.toLunarDate();

console.log("getYearName():", lunarDate.getYearName());
console.log("getMonthName():", lunarDate.getMonthName());
console.log("getDayName():", lunarDate.getDayName());
console.log("getLuckyHours():", lunarDate.getLuckyHours());
console.log("getRealHourName():", lunarDate.getRealHourName());
