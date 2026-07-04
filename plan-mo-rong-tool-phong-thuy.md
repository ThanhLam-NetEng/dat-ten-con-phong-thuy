# Plan mở rộng: Thêm 3 tool mới vào site Phong Thủy Gia Đình

## Mục tiêu
Tận dụng hạ tầng, data (Can Chi, Ngũ hành nạp âm, thư viện quy đổi âm lịch) và domain trust đã có từ `dat-ten-con-phong-thuy.pages.dev` để mở rộng thêm 3 trang/tool mới, mỗi trang target 1 cụm từ khóa riêng, tăng tổng traffic organic cho cả site mà không phải build lại từ đầu.

## Nguyên tắc giữ nguyên từ dự án cũ
- Vẫn multi-page tĩnh (mỗi tool 1 file HTML riêng), không dùng react-router-dom
- Mỗi trang có title/meta/H1/bài viết SEO riêng, nằm ngoài `#root` để Google crawl được ngay
- Chung 1 React bundle, chung data ngũ hành/Can Chi đã có sẵn trong `src/data/`
- Link điều hướng giữa các trang dùng thẻ `<a href>` thật (không chỉ onClick JS)

## 3 tool đề xuất thêm

### 1. `/xem-tuoi-vo-chong` — Xem tuổi vợ chồng có hợp nhau không
**Input:** Ngày sinh chồng, ngày sinh vợ (dương lịch)
**Logic tái sử dụng:** Dùng lại `canChiNapAm.js` để tính mệnh Ngũ hành mỗi người, dùng lại bảng tương sinh/tương khắc đã có trong `phongThuy.js`
**Logic mới cần thêm:**
- Tính quan hệ Thiên Can (tương hợp/tương khắc giữa 2 Can)
- Tính quan hệ Địa Chi (Tam hợp, Nhị hợp, Tứ hành xung, Lục hại)
- Tổng hợp điểm số + đưa ra kết luận: "Rất hợp / Hợp / Bình thường / Nên cân nhắc" kèm giải thích ngắn
**Output:** Card hiển thị mệnh 2 người, điểm hợp tổng, giải thích Can/Chi, gợi ý hóa giải nếu có xung khắc (mang tính tham khảo văn hóa, không phán xét tuyệt đối)
**Title đề xuất:** "Xem Tuổi Vợ Chồng Hợp Nhau Không - Tính Ngay Theo Ngày Sinh 2026"

### 2. `/xem-ngay-tot-xau` — Xem ngày tốt xấu làm việc lớn
**Input:** Ngày sinh gia chủ (dương lịch), loại việc muốn xem (dropdown: Khai trương / Động thổ / Xuất hành / Nhập trạch / Mua xe/Ký hợp đồng), khoảng thời gian muốn xem (tháng/năm)
**Logic tái sử dụng:** `canChiNapAm.js`, `lunar-date-vn` đã tích hợp
**Logic mới cần thêm:**
- Bảng Ngày Hoàng Đạo / Hắc Đạo theo hệ thống Kiến Trừ Thập Nhị Khách (12 ngày lặp lại theo chu kỳ)
- Lọc ngày tốt trong khoảng thời gian đã chọn, loại trừ ngày xung khắc với tuổi gia chủ
**Output:** Danh sách 5-10 ngày tốt nhất trong khoảng đã chọn, sắp xếp theo mức độ tốt, mỗi ngày kèm giờ Hoàng Đạo trong ngày đó
**Title đề xuất:** "Xem Ngày Tốt Xấu 2026 - Chọn Ngày Khai Trương, Động Thổ, Xuất Hành Hợp Tuổi"
**Lưu ý:** Đây là trang có phạm vi tính toán rộng nhất, nên làm sau cùng vì cần nhiều dữ liệu Hoàng Đạo/Hắc Đạo hơn 2 trang kia

### 3. `/doi-am-duong-lich` — Công cụ đổi lịch âm dương
**Input:** 1 ngày (âm hoặc dương), toggle chọn chiều đổi
**Logic tái sử dụng:** 100% dùng lại `lunar-date-vn` đã tích hợp sẵn — không cần logic mới, chỉ cần UI
**Output:** Ngày tương ứng ở lịch còn lại, kèm thông tin Can Chi ngày/tháng/năm đó, ngày Hoàng Đạo/Hắc Đạo (nếu tool #2 đã có bảng này thì tái sử dụng luôn)
**Title đề xuất:** "Đổi Lịch Âm Dương 2026 - Tra Cứu Ngày Âm, Ngày Dương Chính Xác"
**Lưu ý:** Tool dễ làm nhất, nên làm ĐẦU TIÊN để có thêm 1 trang nhanh, đồng thời là nền tảng logic dùng chung cho tool #2

## Thứ tự làm đề xuất (từ dễ đến khó, tận dụng lẫn nhau)
1. **`/doi-am-duong-lich`** trước — dễ nhất, không cần data mới, tận dụng ngay được cho tool #2 sau này
2. **`/xem-tuoi-vo-chong`** — độ phức tạp trung bình, tái sử dụng nhiều nhất từ code cũ (mệnh, tương sinh khắc)
3. **`/xem-ngay-tot-xau`** — làm sau cùng vì cần thêm bảng dữ liệu Hoàng Đạo/Hắc Đạo mới

## Cập nhật cần làm ở cấp độ site
- Thêm cả 3 URL mới vào `vite.config.js` (rollupOptions.input)
- Thêm cả 3 URL vào `public/sitemap.xml`
- Thêm navigation/menu ở tất cả các trang (kể cả 2 trang cũ) để link chéo giữa các tool — dùng thẻ `<a href>` thật, giúp Google hiểu đây là 1 cụm site liên quan, tăng "link equity" nội bộ
- Trang chủ (`index.html`) có thể thêm 1 section nhỏ "Các công cụ khác" liệt kê tất cả tool, tăng thời gian ở lại site (dwell time) và giảm bounce rate

## Việc KHÔNG làm (tránh over-scope)
- Không cần làm tool #2 (ngày tốt xấu) quá phức tạp với nhiều trường phái (Bát Tự, Kỳ Môn Độn Giáp...) — chỉ cần 1 hệ thống Hoàng Đạo/Hắc Đạo phổ biến, dễ hiểu là đủ cho MVP
- Không cần tài khoản/lưu lịch sử tra cứu giữa các tool
- Không cần làm giao diện quá khác biệt giữa các trang — giữ design system nhất quán (màu ngũ hành, font, layout) để cả site trông như 1 sản phẩm thống nhất, không phải 3 tool rời rạc ghép lại

## Testing checklist khi xong
- [ ] Vào thẳng từng URL mới, kiểm tra load đúng, không lỗi 404
- [ ] Ctrl+U kiểm tra bài viết SEO từng trang có trong HTML tĩnh
- [ ] Test chức năng tính toán với vài bộ dữ liệu biết trước đáp án (đối chiếu 1 trang tử vi uy tín)
- [ ] Kiểm tra menu/link chéo giữa 5 trang (2 cũ + 3 mới) hoạt động đúng, không bị lỗi 404
- [ ] Cập nhật lại sitemap.xml, submit lại Google Search Console sau khi deploy
