import { layGoiYTen } from "./src/logic/phongThuy.js";

const result = layGoiYTen({
  babyYear: 2026, // Bính Ngọ - Thiên Hà Thủy (Thủy)
  fatherYear: null,
  motherYear: null,
  gender: "Nam"
});

console.log("Baby Info:", result.babyInfo);
console.log("Suggestions sample (first 5):", result.suggestions.slice(0, 5));
