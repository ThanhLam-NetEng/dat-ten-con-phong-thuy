// Dữ liệu Lục Thập Hoa Giáp và Ngũ hành nạp âm tương ứng
// Index tương ứng với: (năm_âm_lịch - 4) % 60

export const canChiNapAmList = [
  { canChi: "Giáp Tý", napAm: "Hải Trung Kim", hanh: "Kim" },
  { canChi: "Ất Sửu", napAm: "Hải Trung Kim", hanh: "Kim" },
  { canChi: "Bính Dần", napAm: "Lư Trung Hỏa", hanh: "Hỏa" },
  { canChi: "Đinh Mão", napAm: "Lư Trung Hỏa", hanh: "Hỏa" },
  { canChi: "Mậu Thìn", napAm: "Đại Lâm Mộc", hanh: "Mộc" },
  { canChi: "Kỷ Tỵ", napAm: "Đại Lâm Mộc", hanh: "Mộc" },
  { canChi: "Canh Ngọ", napAm: "Lộ Bàng Thổ", hanh: "Thổ" },
  { canChi: "Tân Mùi", napAm: "Lộ Bàng Thổ", hanh: "Thổ" },
  { canChi: "Nhâm Thân", napAm: "Kiếm Phong Kim", hanh: "Kim" },
  { canChi: "Quý Dậu", napAm: "Kiếm Phong Kim", hanh: "Kim" },
  { canChi: "Giáp Tuất", napAm: "Sơn Đầu Hỏa", hanh: "Hỏa" },
  { canChi: "Ất Hợi", napAm: "Sơn Đầu Hỏa", hanh: "Hỏa" },
  { canChi: "Bính Tý", napAm: "Giản Hạ Thủy", hanh: "Thủy" },
  { canChi: "Đinh Sửu", napAm: "Giản Hạ Thủy", hanh: "Thủy" },
  { canChi: "Mậu Dần", napAm: "Thành Đầu Thổ", hanh: "Thổ" },
  { canChi: "Kỷ Mão", napAm: "Thành Đầu Thổ", hanh: "Thổ" },
  { canChi: "Canh Thìn", napAm: "Bạch Lạp Kim", hanh: "Kim" },
  { canChi: "Tân Tỵ", napAm: "Bạch Lạp Kim", hanh: "Kim" },
  { canChi: "Nhâm Ngọ", napAm: "Dương Liễu Mộc", hanh: "Mộc" },
  { canChi: "Quý Mùi", napAm: "Dương Liễu Mộc", hanh: "Mộc" },
  { canChi: "Giáp Thân", napAm: "Tuyền Trung Thủy", hanh: "Thủy" },
  { canChi: "Ất Dậu", napAm: "Tuyền Trung Thủy", hanh: "Thủy" },
  { canChi: "Bính Tuất", napAm: "Ốc Thượng Thổ", hanh: "Thổ" },
  { canChi: "Đinh Hợi", napAm: "Ốc Thượng Thổ", hanh: "Thổ" },
  { canChi: "Mậu Tý", napAm: "Tích Lịch Hỏa", hanh: "Hỏa" },
  { canChi: "Kỷ Sửu", napAm: "Tích Lịch Hỏa", hanh: "Hỏa" },
  { canChi: "Canh Dần", napAm: "Tùng Bách Mộc", hanh: "Mộc" },
  { canChi: "Tân Mão", napAm: "Tùng Bách Mộc", hanh: "Mộc" },
  { canChi: "Nhâm Thìn", napAm: "Trường Lưu Thủy", hanh: "Thủy" },
  { canChi: "Quý Tỵ", napAm: "Trường Lưu Thủy", hanh: "Thủy" },
  { canChi: "Giáp Ngọ", napAm: "Sa Trung Kim", hanh: "Kim" },
  { canChi: "Ất Mùi", napAm: "Sa Trung Kim", hanh: "Kim" },
  { canChi: "Bính Thân", napAm: "Sơn Hạ Hỏa", hanh: "Hỏa" },
  { canChi: "Đinh Dậu", napAm: "Sơn Hạ Hỏa", hanh: "Hỏa" },
  { canChi: "Mậu Tuất", napAm: "Bình Địa Mộc", hanh: "Mộc" },
  { canChi: "Kỷ Hợi", napAm: "Bình Địa Mộc", hanh: "Mộc" },
  { canChi: "Canh Tý", napAm: "Bích Thượng Thổ", hanh: "Thổ" },
  { canChi: "Tân Sửu", napAm: "Bích Thượng Thổ", hanh: "Thổ" },
  { canChi: "Nhâm Dần", napAm: "Kim Bạch Kim", hanh: "Kim" },
  { canChi: "Quý Mão", napAm: "Kim Bạch Kim", hanh: "Kim" },
  { canChi: "Giáp Thìn", napAm: "Phú Đăng Hỏa", hanh: "Hỏa" },
  { canChi: "Ất Tỵ", napAm: "Phú Đăng Hỏa", hanh: "Hỏa" },
  { canChi: "Bính Ngọ", napAm: "Thiên Hà Thủy", hanh: "Thủy" },
  { canChi: "Đinh Mùi", napAm: "Thiên Hà Thủy", hanh: "Thủy" },
  { canChi: "Mậu Thân", napAm: "Đại Trạch Thổ", hanh: "Thổ" },
  { canChi: "Kỷ Dậu", napAm: "Đại Trạch Thổ", hanh: "Thổ" },
  { canChi: "Canh Tuất", napAm: "Thoa Xuyến Kim", hanh: "Kim" },
  { canChi: "Tân Hợi", napAm: "Thoa Xuyến Kim", hanh: "Kim" },
  { canChi: "Nhâm Tý", napAm: "Tang Đố Mộc", hanh: "Mộc" },
  { canChi: "Quý Sửu", napAm: "Tang Đố Mộc", hanh: "Mộc" },
  { canChi: "Giáp Dần", napAm: "Đại Khê Thủy", hanh: "Thủy" },
  { canChi: "Ất Mão", napAm: "Đại Khê Thủy", hanh: "Thủy" },
  { canChi: "Bính Thìn", napAm: "Sa Trung Thổ", hanh: "Thổ" },
  { canChi: "Đinh Tỵ", napAm: "Sa Trung Thổ", hanh: "Thổ" },
  { canChi: "Mậu Ngọ", napAm: "Thiên Thượng Hỏa", hanh: "Hỏa" },
  { canChi: "Kỷ Mùi", napAm: "Thiên Thượng Hỏa", hanh: "Hỏa" },
  { canChi: "Canh Thân", napAm: "Thạch Lựu Mộc", hanh: "Mộc" },
  { canChi: "Tân Dậu", napAm: "Thạch Lựu Mộc", hanh: "Mộc" },
  { canChi: "Nhâm Tuất", napAm: "Đại Hải Thủy", hanh: "Thủy" },
  { canChi: "Quý Hợi", napAm: "Đại Hải Thủy", hanh: "Thủy" }
];

export function getCanChiNapAm(year) {
  if (!year || isNaN(year)) return null;
  const index = (year - 4) % 60;
  // Đảm bảo xử lý đúng với index âm nếu có năm quá nhỏ
  const adjustedIndex = index < 0 ? index + 60 : index;
  return canChiNapAmList[adjustedIndex];
}
