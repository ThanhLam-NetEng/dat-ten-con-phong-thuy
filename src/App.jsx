import React, { useState } from "react";
import { layNamAmLich } from "./logic/utils";
import { layGoiYTen } from "./logic/phongThuy";

// Icon và màu sắc đại diện cho các hành ngũ hành (Light Theme tương thích)
const elementIcons = {
  Kim: { char: "🟡", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", text: "Kim" },
  Mộc: { char: "🟢", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", text: "Mộc" },
  Thủy: { char: "🔵", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", text: "Thủy" },
  Hỏa: { char: "🔴", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", text: "Hỏa" },
  Thổ: { char: "🟣", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", text: "Thổ" }
};

// Chuẩn bị danh sách cho dropdown chọn ngày sinh
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

// Năm sinh Bố/Mẹ từ 1960 đến 2015
const parentYears = Array.from({ length: 2015 - 1960 + 1 }, (_, i) => 2015 - i);
// Năm sinh Bé từ 2020 đến 2035
const babyYears = Array.from({ length: 2035 - 2020 + 1 }, (_, i) => 2035 - i);

export default function App() {
  // Trạng thái ngày sinh Bố (Ngày - Tháng - Năm)
  const [fatherDay, setFatherDay] = useState("");
  const [fatherMonth, setFatherMonth] = useState("");
  const [fatherYear, setFatherYear] = useState("");

  // Trạng thái ngày sinh Mẹ
  const [motherDay, setMotherDay] = useState("");
  const [motherMonth, setMotherMonth] = useState("");
  const [motherYear, setMotherYear] = useState("");

  // Trạng thái ngày sinh Bé (mặc định sẵn 01/06/2026 cho năm Bính Ngọ)
  const [babyDay, setBabyDay] = useState("1");
  const [babyMonth, setBabyMonth] = useState("6");
  const [babyYearSelect, setBabyYearSelect] = useState("2026");
  
  const [gender, setGender] = useState("Nam");

  // Trạng thái kết quả gợi ý
  const [result, setResult] = useState(null);
  const [visibleCount, setVisibleCount] = useState(15);
  const [copiedText, setCopiedText] = useState("");
  const [expandedIdx, setExpandedIdx] = useState(null);

  // Họ và tên đệm dự kiến của bé
  const [surname, setSurname] = useState("");
  const [middleName, setMiddleName] = useState("");

  // Trạng thái danh sách tên yêu thích (LocalStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorite_names");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.ten === item.ten);
      let updated;
      if (exists) {
        updated = prev.filter((f) => f.ten !== item.ten);
      } else {
        updated = [...prev, { ten: item.ten, hanh: item.hanh, nghia: item.nghia }];
      }
      localStorage.setItem("favorite_names", JSON.stringify(updated));
      return updated;
    });
  };

  const handleCopyShortlist = () => {
    if (favorites.length === 0) return;
    const dateText = `${babyDay}/${babyMonth}/${babyYearSelect}`;
    const cleanSurname = surname.trim();
    const formattedSurname = cleanSurname ? cleanSurname.charAt(0).toUpperCase() + cleanSurname.slice(1) : "";
    const cleanMiddle = middleName.trim();
    
    const text = `Gợi ý tên hay hợp phong thủy cho bé yêu của chúng mình (${gender === "Nam" ? "Bé Trai" : "Bé Gái"} sinh ngày ${dateText}):\n` +
      favorites.map((f, i) => {
        const fullName = `${formattedSurname} ${cleanMiddle} ${f.ten}`.replace(/\s+/g, " ").trim();
        return `${i + 1}. ${fullName} (Hành ${f.hanh}) - ${f.nghia}`;
      }).join("\n") +
      `\n\nTra cứu tại: Đặt Tên Con Phong Thủy 2026`;
    navigator.clipboard.writeText(text);
    alert("Đã sao chép danh sách tên yêu thích kèm ý nghĩa gửi qua Zalo/Messenger! ✅");
  };

  const handleClearFavorites = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ danh sách tên đã chọn?")) {
      setFavorites([]);
      localStorage.removeItem("favorite_names");
    }
  };

  // Chuyển đổi Ngày-Tháng-Năm chọn được sang chuỗi định dạng YYYY-MM-DD
  const getDobString = (d, m, y) => {
    if (!d || !m || !y) return null;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!babyDay || !babyMonth || !babyYearSelect) {
      alert("Vui lòng chọn đầy đủ ngày, tháng, năm sinh/dự sinh của Bé!");
      return;
    }

    const babyDob = getDobString(babyDay, babyMonth, babyYearSelect);
    const fatherDob = getDobString(fatherDay, fatherMonth, fatherYear);
    const motherDob = getDobString(motherDay, motherMonth, motherYear);

    const babyYear = layNamAmLich(babyDob);
    const fatherYearVal = fatherDob ? layNamAmLich(fatherDob) : null;
    const motherYearVal = motherDob ? layNamAmLich(motherDob) : null;

    const data = layGoiYTen({
      babyYear,
      fatherYear: fatherYearVal,
      motherYear: motherYearVal,
      gender,
      surname
    });

    setResult(data);
    setVisibleCount(15); // Reset số lượng hiển thị khi tìm mới
  };

  const handleCopy = (ten) => {
    navigator.clipboard.writeText(ten);
    setCopiedText(ten);
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-4">
          🔮 Phong Thủy & Ngũ Hành Cổ Điển
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-950 pb-2.5 pt-1 mb-3 leading-normal">
          ĐẶT TÊN CON HỢP MỆNH 2026
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Tra cứu nhanh mệnh Ngũ Hành Lục Thập Hoa Giáp của gia đình và tìm ra danh sách những cái tên tương sinh hoàn hảo nhất cho con cưng.
        </p>
      </div>

      {/* Main Form (Glassmorphism Light) */}
      <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/80 mb-8">
        <form onSubmit={handleCalculate} className="space-y-6">
          
          {/* Họ & Tên Đệm (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5 border-b border-slate-200/80">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Họ của Bé (Dự kiến)
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Ví dụ: Nguyễn, Trần, Lê, Phạm, Hoàng..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-400 italic block">Hệ thống sẽ tra cứu ngũ hành của Họ và chấm điểm tương hợp Họ - Tên</span>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Tên đệm dự kiến (Không bắt buộc)
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Ví dụ: Minh, Bảo, Hữu, Khánh..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-400 italic block">Để hiển thị tên đầy đủ: Họ + Tên đệm + Tên chính</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Father DOB Dropdowns */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Ngày sinh Bố (Dương lịch)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={fatherDay}
                  onChange={(e) => setFatherDay(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Ngày</option>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={fatherMonth}
                  onChange={(e) => setFatherMonth(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Tháng</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={fatherYear}
                  onChange={(e) => setFatherYear(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Năm</option>
                  {parentYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <span className="text-[11px] text-slate-400 italic block">Không bắt buộc</span>
            </div>

            {/* Mother DOB Dropdowns */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Ngày sinh Mẹ (Dương lịch)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={motherDay}
                  onChange={(e) => setMotherDay(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Ngày</option>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={motherMonth}
                  onChange={(e) => setMotherMonth(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Tháng</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={motherYear}
                  onChange={(e) => setMotherYear(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Năm</option>
                  {parentYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <span className="text-[11px] text-slate-400 italic block">Không bắt buộc</span>
            </div>

            {/* Baby DOB Dropdowns */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                <span className="text-amber-800">Ngày sinh Bé (Dự sinh)</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={babyDay}
                  onChange={(e) => setBabyDay(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={babyMonth}
                  onChange={(e) => setBabyMonth(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={babyYearSelect}
                  onChange={(e) => setBabyYearSelect(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {babyYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <span className="text-[11px] text-slate-400 italic block">Mặc định: Năm Bính Ngọ 2026</span>
            </div>

          </div>

          {/* Gender selection and Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-5 border-t border-slate-200/80">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700">Giới tính của Bé:</span>
              <div className="flex bg-slate-200/80 rounded-xl p-1 border border-slate-300/40">
                <button
                  type="button"
                  onClick={() => setGender("Nam")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    gender === "Nam"
                      ? "bg-amber-600 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  👦 Bé Trai
                </button>
                <button
                  type="button"
                  onClick={() => setGender("Nu")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    gender === "Nu"
                      ? "bg-amber-600 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  👧 Bé Gái
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-600/10 active:scale-98 transition-all text-sm tracking-wide"
            >
              🔮 Tìm tên hợp mệnh
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Family Wu Xing Info Card */}
          <div className="glass rounded-3xl p-6 border border-slate-200/80 shadow-lg">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              📊 Mệnh Ngũ Hành Gia Đình
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Bé Info */}
              <div className="glass-card rounded-2xl p-5 border border-amber-200 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider inline-block mb-2">
                    👶 Con Cưng ({gender === "Nam" ? "Nam" : "Nữ"})
                  </span>
                  <div className="text-3xl font-extrabold text-slate-800 mb-1">
                    {result.babyInfo.canChi}
                  </div>
                  <div className="text-xs text-slate-400">
                    Dương lịch: {babyDay}/{babyMonth}/{babyYearSelect}
                  </div>
                </div>
                
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${elementIcons[result.babyInfo.hanh]?.bg} ${elementIcons[result.babyInfo.hanh]?.border} border`}>
                    {elementIcons[result.babyInfo.hanh]?.char}
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Ngũ hành Nạp âm</div>
                    <div className={`text-sm font-bold ${elementIcons[result.babyInfo.hanh]?.color}`}>
                      {result.babyInfo.napAm} ({elementIcons[result.babyInfo.hanh]?.text})
                    </div>
                  </div>
                </div>
              </div>

              {/* Bố Info */}
              {result.fatherInfo ? (
                <div className="glass-card rounded-2xl p-5 border border-slate-100 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider inline-block mb-2">
                      👨 Cha yêu
                    </span>
                    <div className="text-3xl font-extrabold text-slate-800 mb-1">
                      {result.fatherInfo.canChi}
                    </div>
                    <div className="text-xs text-slate-400">
                      Dương lịch: {fatherDay}/{fatherMonth}/{fatherYear}
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${elementIcons[result.fatherInfo.hanh]?.bg} ${elementIcons[result.fatherInfo.hanh]?.border} border`}>
                      {elementIcons[result.fatherInfo.hanh]?.char}
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Ngũ hành Nạp âm</div>
                      <div className={`text-sm font-bold ${elementIcons[result.fatherInfo.hanh]?.color}`}>
                        {result.fatherInfo.napAm} ({elementIcons[result.fatherInfo.hanh]?.text})
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-5 flex items-center justify-center border border-dashed border-slate-200 text-slate-400 text-sm text-center min-h-[140px]">
                  Chưa điền thông tin của Bố.
                </div>
              )}

              {/* Mẹ Info */}
              {result.motherInfo ? (
                <div className="glass-card rounded-2xl p-5 border border-slate-100 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider inline-block mb-2">
                      👩 Mẹ yêu
                    </span>
                    <div className="text-3xl font-extrabold text-slate-800 mb-1">
                      {result.motherInfo.canChi}
                    </div>
                    <div className="text-xs text-slate-400">
                      Dương lịch: {motherDay}/{motherMonth}/{motherYear}
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${elementIcons[result.motherInfo.hanh]?.bg} ${elementIcons[result.motherInfo.hanh]?.border} border`}>
                      {elementIcons[result.motherInfo.hanh]?.char}
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Ngũ hành Nạp âm</div>
                      <div className={`text-sm font-bold ${elementIcons[result.motherInfo.hanh]?.color}`}>
                        {result.motherInfo.napAm} ({elementIcons[result.motherInfo.hanh]?.text})
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-5 flex items-center justify-center border border-dashed border-slate-200 text-slate-400 text-sm text-center min-h-[140px]">
                  Chưa điền thông tin của Mẹ.
                </div>
              )}

            </div>
          </div>

          {/* 🔮 Kết Luận Phong Thủy & Lời Khuyên */}
          <div className="glass rounded-3xl p-6 border border-slate-200/80 shadow-lg bg-gradient-to-br from-amber-500/5 to-transparent">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              🔮 Kết Luận Phong Thủy & Lời Khuyên Đặt Tên
            </h3>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p dangerouslySetInnerHTML={{ __html: result.ketLuan.loiKhuyen.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              
              {result.ketLuan.relations.length > 0 && (
                <div className="space-y-2 mt-3 pt-3 border-t border-slate-200/60">
                  <div className="font-bold text-slate-700 text-xs uppercase tracking-wider">Tương hợp gia đình:</div>
                  <ul className="list-inside space-y-1 text-slate-600 flex flex-col gap-1">
                    {result.ketLuan.relations.map((rel, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>{rel}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Bảng chú thích cách tính điểm */}
          <div className="glass rounded-3xl p-5 border border-slate-200/80 shadow-sm text-xs text-slate-500 space-y-3 bg-amber-50/10">
            <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
              💡 Hướng dẫn tính điểm phong thủy:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 leading-relaxed">
              <div>
                <span className="font-bold text-emerald-700">Tương sinh với Bé:</span> +3 điểm (Hành của tên nuôi dưỡng mệnh Bé)
              </div>
              <div>
                <span className="font-bold text-slate-600">Bình hòa với Bé:</span> +2 điểm (Tên cùng hành với mệnh Bé)
              </div>
              <div>
                <span className="font-bold text-blue-700">Hợp mệnh Bố/Mẹ:</span> +1.5 điểm nếu Tương sinh, +1 điểm nếu Bình hòa
              </div>
              <div>
                <span className="font-bold text-rose-700">Xung khắc Bố/Mẹ:</span> -2 điểm (Xung khắc ngũ hành với Bố hoặc Mẹ)
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-200/60">
              * Để đảm bảo an lành, các tên tương khắc trực tiếp với bản mệnh của Bé (bị trừ 5 điểm) đã được hệ thống tự động lọc bỏ hoàn toàn khỏi danh sách.
            </p>
          </div>

          {/* Baby Names Suggested */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                🌟 Danh Sách Tên Gợi Ý ({result.suggestions.length} tên)
              </h3>
              <span className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                Ưu tiên điểm phong thủy cao nhất
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.suggestions.slice(0, visibleCount).map((item, idx) => {
                const iconInfo = elementIcons[item.hanh];
                const isFav = favorites.some((f) => f.ten === item.ten);
                const isExpanded = expandedIdx === idx;
                return (
                  <div
                    key={`${item.ten}-${idx}`}
                    className="glass-card rounded-2xl border border-slate-200/80 p-5 hover:border-amber-500/40 hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all relative group overflow-hidden flex flex-col justify-between"
                  >
                    {/* Copy notification badge on hover */}
                    <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded shadow">
                      {copiedText === `${surname.trim() ? surname.trim() + " " : ""}${middleName.trim() ? middleName.trim() + " " : ""}${item.ten}` ? "Đã sao chép! ✅" : "Click nút để copy tên"}
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-extrabold text-slate-850 group-hover:text-amber-800 transition-colors">
                          {surname.trim() && `${surname.trim().charAt(0).toUpperCase() + surname.trim().slice(1)} `}
                          {middleName.trim() && `${middleName.trim()} `}
                          {item.ten}
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${iconInfo.bg} ${iconInfo.color} border ${iconInfo.border}`}>
                          {iconInfo.char} Hành {item.hanh}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">Hợp mệnh</span>
                        <span className="text-amber-700 font-extrabold text-base">{item.diem}đ</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs md:text-sm mb-3.5 leading-relaxed">
                      {item.nghia}
                    </p>

                    {/* Compatibility badges inside card */}
                    {item.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 py-2 border-t border-slate-100">
                        {item.badges.map((badge, bIdx) => {
                          let badgeStyle = "bg-slate-50 border-slate-200 text-slate-500";
                          if (badge.type === "success") badgeStyle = "bg-emerald-50 border-emerald-200 text-emerald-700";
                          if (badge.type === "info") badgeStyle = "bg-amber-50 border-amber-200 text-amber-800";
                          if (badge.type === "success-bo") badgeStyle = "bg-blue-50 border-blue-200 text-blue-700";
                          if (badge.type === "success-me") badgeStyle = "bg-purple-50 border-purple-200 text-purple-700";

                          return (
                            <span
                              key={bIdx}
                              className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${badgeStyle}`}
                            >
                              {badge.text}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Chi tiết điểm số của từng thành viên hiển thị dưới dạng công thức */}
                    <div className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-dashed border-slate-200/80 flex flex-wrap gap-x-1.5 gap-y-1 items-center">
                      <span className="font-bold text-slate-400 text-[10px] uppercase mr-1">Cách tính điểm:</span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">Bé ({item.chiTiet.be}đ)</span>
                      {item.chiTiet.bo !== null && (
                        <>
                          <span className="text-slate-400 font-bold">+</span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">Bố ({item.chiTiet.bo}đ)</span>
                        </>
                      )}
                      {item.chiTiet.me !== null && (
                        <>
                          <span className="text-slate-400 font-bold">+</span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">Mẹ ({item.chiTiet.me}đ)</span>
                        </>
                      )}
                      <span className="text-slate-400 font-bold">=</span>
                      <span className="bg-amber-100 border border-amber-200 px-2 py-0.5 rounded text-amber-800 font-extrabold">{item.diem}đ (Tổng)</span>
                    </div>

                    {/* Hàng nút hành động: Lưu tên & Copy nhanh & Xem luận giải */}
                    <div className="flex justify-between items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedIdx(isExpanded ? null : idx);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer"
                      >
                        {isExpanded ? "📖 Thu gọn" : "📖 Xem luận giải"}
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item)}
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            isFav
                              ? "bg-rose-50 border-rose-200 text-rose-600"
                              : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {isFav ? "❤️ Đã chọn" : "🤍 Lưu"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const full = `${surname.trim() ? surname.trim() + " " : ""}${middleName.trim() ? middleName.trim() + " " : ""}${item.ten}`.replace(/\s+/g, " ").trim();
                            handleCopy(full);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>

                    {/* Khối hiển thị văn bản luận giải chi tiết khi bấm mở rộng */}
                    {isExpanded && item.giaiThich && (
                      <div className="mt-3 p-3 bg-amber-50/40 rounded-xl border border-amber-200/40 text-xs text-slate-600 space-y-2 animate-fade-in text-left">
                        {item.giaiThich.map((para, pIdx) => (
                          <p key={pIdx} dangerouslySetInnerHTML={{ __html: para }} />
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Load more button */}
            {visibleCount < result.suggestions.length && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all text-xs"
                >
                  Xem thêm tên khác (+12 tên)
                </button>
              </div>
            )}

          </div>

          {/* ❤️ Danh Sách Tên Đã Chọn */}
          {favorites.length > 0 && (
            <div className="glass rounded-3xl p-6 border-2 border-amber-300 shadow-lg bg-amber-50/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    ❤️ Danh Sách Tên Đã Chọn ({favorites.length})
                  </h3>
                  <p className="text-xs text-slate-500">Danh sách lưu tạm thời qua LocalStorage (không bị mất khi tải lại trang)</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyShortlist}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-600/10 transition-all active:scale-98"
                  >
                    📋 Copy danh sách gửi gia đình
                  </button>
                  <button
                    onClick={handleClearFavorites}
                    className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold px-3 py-2 rounded-xl text-xs transition-all"
                  >
                    Xóa hết
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {favorites.map((fav, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2 rounded-2xl shadow-sm text-sm"
                  >
                    <span className="font-extrabold text-slate-800">{fav.ten}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      Hành {fav.hanh}
                    </span>
                    <button
                      onClick={() => toggleFavorite(fav)}
                      className="text-slate-400 hover:text-red-500 font-black ml-1.5 transition-colors cursor-pointer text-base leading-none"
                      title="Xóa tên này"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
