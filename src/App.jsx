import React, { useState, useEffect } from "react";
import { layNamAmLich } from "./logic/utils";
import { layGoiYTen, layGoiYNgaySinh, chamDiemTenCoSan, tinhDiemChoTenDaChon, tinhTuoiVoChong, tinhNgayTotXau } from "./logic/phongThuy";
import { SolarDate, LunarDate } from "lunar-date-vn";
import { canChiNapAmList } from "./data/canChiNapAm";

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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Họ và tên đệm dự kiến của bé
  const [surname, setSurname] = useState("");
  const [middleName, setMiddleName] = useState("");

  // Trạng thái tab hiện tại: suggest (Đặt tên con), csection (Chọn ngày sinh mổ), check (Chấm điểm tên), couple (Xem tuổi vợ chồng), dates (Xem ngày tốt xấu), lunar_conv (Đổi lịch âm dương)
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("xem-ngay-sinh-mo")) return "csection";
      if (path.includes("cham-diem-ten")) return "check";
      if (path.includes("doi-am-duong-lich")) return "lunar_conv";
      if (path.includes("xem-tuoi-vo-chong")) return "couple";
      if (path.includes("xem-ngay-tot-xau")) return "dates";
    }
    return "suggest";
  });

  const changeTab = (tabName) => {
    setActiveTab(tabName);
    setExpandedIdx(null);
    if (typeof window !== "undefined") {
      if (tabName === "suggest") {
        window.history.pushState({}, "", "/");
        document.title = "Đặt Tên Con Hợp Mệnh Bố Mẹ 2026 - Xem Tên Phong Thủy Chuẩn Xác";
      } else if (tabName === "csection") {
        window.history.pushState({}, "", "/xem-ngay-sinh-mo");
        document.title = "Chọn Ngày Sinh Mổ Đẹp 2026 - Xem Ngày Mổ Chủ Động Theo Tuổi Bố Mẹ";
      } else if (tabName === "check") {
        window.history.pushState({}, "", "/cham-diem-ten");
        document.title = "Chấm Điểm Tên Con Theo Phong Thủy 2026 - Xem Cát Hung Tên Của Bé";
      } else if (tabName === "lunar_conv") {
        window.history.pushState({}, "", "/doi-am-duong-lich");
        document.title = "Đổi Lịch Âm Dương 2026 - Tra Cứu Ngày Âm, Ngày Dương Chính Xác";
      } else if (tabName === "couple") {
        window.history.pushState({}, "", "/xem-tuoi-vo-chong");
        document.title = "Xem Tuổi Vợ Chồng Hợp Nhau Không - Tính Ngay Theo Ngày Sinh 2026";
      } else if (tabName === "dates") {
        window.history.pushState({}, "", "/xem-ngay-tot-xau");
        document.title = "Xem Ngày Tốt Xấu 2026 - Chọn Ngày Khai Trương, Động Thổ Hợp Tuổi";
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("xem-ngay-sinh-mo")) {
        setActiveTab("csection");
      } else if (path.includes("cham-diem-ten")) {
        setActiveTab("check");
      } else if (path.includes("doi-am-duong-lich")) {
        setActiveTab("lunar_conv");
      } else if (path.includes("xem-tuoi-vo-chong")) {
        setActiveTab("couple");
      } else if (path.includes("xem-ngay-tot-xau")) {
        setActiveTab("dates");
      } else {
        setActiveTab("suggest");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Trạng thái chọn ngày sinh mổ
  const [csectStart, setCsectStart] = useState("2026-07-01");
  const [csectEnd, setCsectEnd] = useState("2026-07-07");
  const [csectResults, setCsectResults] = useState(null);
  const [csectGender, setCsectGender] = useState("Nam");

  // Trạng thái chấm điểm tên có sẵn
  const [customNameInput, setCustomNameInput] = useState("");
  const [checkedNameResult, setCheckedNameResult] = useState(null);
  const [customHanh, setCustomHanh] = useState("");

  // Trạng thái Đổi lịch âm dương
  const [convDate, setConvDate] = useState("2026-07-04");
  const [convType, setConvType] = useState("sol2lun");
  const [convLunarLeap, setConvLunarLeap] = useState(false);
  const [convResult, setConvResult] = useState(null);

  // Trạng thái Xem tuổi vợ chồng
  const [coupleResult, setCoupleResult] = useState(null);

  // Trạng thái Xem ngày tốt xấu
  const [datesYear, setDatesYear] = useState("2026");
  const [datesMonth, setDatesMonth] = useState("7");
  const [datesWorkType, setDatesWorkType] = useState("khai_truong");
  const [datesUserYear, setDatesUserYear] = useState("1996");
  const [datesResult, setDatesResult] = useState(null);

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

  const handleCsectCalculate = (e) => {
    e.preventDefault();
    if (!csectStart || !csectEnd) {
      alert("Vui lòng chọn đầy đủ khoảng ngày dự sinh!");
      return;
    }
    const fatherDob = getDobString(fatherDay, fatherMonth, fatherYear);
    const motherDob = getDobString(motherDay, motherMonth, motherYear);
    
    const fatherYearVal = fatherDob ? layNamAmLich(fatherDob) : null;
    const motherYearVal = motherDob ? layNamAmLich(motherDob) : null;

    const data = layGoiYNgaySinh({
      startDateStr: csectStart,
      endDateStr: csectEnd,
      fatherYear: fatherYearVal,
      motherYear: motherYearVal
    });

    setCsectResults(data);
  };

  const handleCheckName = (e) => {
    e.preventDefault();
    if (!customNameInput) {
      alert("Vui lòng nhập tên bé cần chấm điểm!");
      return;
    }
    const babyDob = getDobString(babyDay, babyMonth, babyYearSelect);
    const fatherDob = getDobString(fatherDay, fatherMonth, fatherYear);
    const motherDob = getDobString(motherDay, motherMonth, motherYear);

    const babyYear = layNamAmLich(babyDob);
    const fatherYearVal = fatherDob ? layNamAmLich(fatherDob) : null;
    const motherYearVal = motherDob ? layNamAmLich(motherDob) : null;

    const data = chamDiemTenCoSan({
      name: customNameInput,
      babyYear,
      fatherYear: fatherYearVal,
      motherYear: motherYearVal
    });

    if (data) {
      const initialHanh = data.hanhMacDinh || "Kim";
      setCustomHanh(initialHanh);
      
      const scoreData = tinhDiemChoTenDaChon({
        name: data.ten,
        hanh: initialHanh,
        babyYear,
        fatherYear: fatherYearVal,
        motherYear: motherYearVal,
        surname
      });
      setCheckedNameResult(scoreData);
    }
  };

  const handleRecalculateCustomName = (selectedHanh) => {
    setCustomHanh(selectedHanh);
    const babyDob = getDobString(babyDay, babyMonth, babyYearSelect);
    const fatherDob = getDobString(fatherDay, fatherMonth, fatherYear);
    const motherDob = getDobString(motherDay, motherMonth, motherYear);

    const babyYear = layNamAmLich(babyDob);
    const fatherYearVal = fatherDob ? layNamAmLich(fatherDob) : null;
    const motherYearVal = motherDob ? layNamAmLich(motherDob) : null;

    const scoreData = tinhDiemChoTenDaChon({
      name: customNameInput,
      hanh: selectedHanh,
      babyYear,
      fatherYear: fatherYearVal,
      motherYear: motherYearVal,
      surname
    });
    setCheckedNameResult(scoreData);
  };

  const handleConvertDate = (e) => {
    if (e) e.preventDefault();
    if (!convDate) {
      alert("Vui lòng chọn ngày cần quy đổi!");
      return;
    }
    
    try {
      const parts = convDate.split("-");
      const y = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      const d = parseInt(parts[2]);

      if (convType === "sol2lun") {
        const sd = new SolarDate({ day: d, month: m, year: y });
        const ld = sd.toLunarDate();
        
        const dayCanChi = ld.getDayName();
        const dayInfo = canChiNapAmList.find(item => item.canChi === dayCanChi);
        
        setConvResult({
          type: "sol2lun",
          sourceStr: `${d}/${m}/${y} (Dương lịch)`,
          targetStr: `${ld.day}/${ld.month}/${ld.year} ${ld.isLeap ? "(Nhuận)" : ""} (Âm lịch)`,
          canChiStr: `Ngày ${ld.getDayName()} • Tháng ${ld.getMonthName()} • Năm ${ld.getYearName()}`,
          napAm: dayInfo ? dayInfo.napAm : "Chưa rõ",
          hanh: dayInfo ? dayInfo.hanh : "Chưa rõ",
          luckyHours: ld.getLuckyHours().map(h => `${h.name} (${h.time[0]}h-${h.time[1]}h)`).join(", ")
        });
      } else {
        const ld = new LunarDate({ day: d, month: m, year: y, isLeap: convLunarLeap });
        const sd = ld.toSolarDate();
        
        const dayCanChi = ld.getDayName();
        const dayInfo = canChiNapAmList.find(item => item.canChi === dayCanChi);

        setConvResult({
          type: "lun2sol",
          sourceStr: `${d}/${m}/${y} ${convLunarLeap ? "(Nhuận)" : ""} (Âm lịch)`,
          targetStr: `${sd.day}/${sd.month}/${sd.year} (Dương lịch)`,
          canChiStr: `Ngày ${ld.getDayName()} • Tháng ${ld.getMonthName()} • Năm ${ld.getYearName()}`,
          napAm: dayInfo ? dayInfo.napAm : "Chưa rõ",
          hanh: dayInfo ? dayInfo.hanh : "Chưa rõ",
          luckyHours: ld.getLuckyHours().map(h => `${h.name} (${h.time[0]}h-${h.time[1]}h)`).join(", ")
        });
      }
    } catch (err) {
      console.error(err);
      alert("Ngày tháng không hợp lệ hoặc vượt ngoài phạm vi tính toán.");
    }
  };

  const handleCoupleCalculate = (e) => {
    e.preventDefault();
    if (!fatherYear || !motherYear) {
      alert("Vui lòng chọn đầy đủ năm sinh của Chồng và Vợ!");
      return;
    }
    const data = tinhTuoiVoChong({
      chongYear: parseInt(fatherYear),
      voYear: parseInt(motherYear)
    });
    setCoupleResult(data);
  };

  const handleDatesCalculate = (e) => {
    e.preventDefault();
    if (!datesUserYear || !datesYear || !datesMonth) {
      alert("Vui lòng chọn đầy đủ năm sinh gia chủ, năm và tháng cần xem!");
      return;
    }
    const data = tinhNgayTotXau({
      userYear: parseInt(datesUserYear),
      workType: datesWorkType,
      year: parseInt(datesYear),
      month: parseInt(datesMonth)
    });
    setDatesResult(data);
  };

  const handleCopy = (ten) => {
    navigator.clipboard.writeText(ten);
    setCopiedText(ten);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleViewNamesForDate = (dateStr, genderVal) => {
    const parts = dateStr.split("-");
    const y = parts[0];
    const m = String(parseInt(parts[1]));
    const d = String(parseInt(parts[2]));

    setBabyDay(d);
    setBabyMonth(m);
    setBabyYearSelect(y);
    setGender(genderVal);
    changeTab("suggest");

    // Tự động chạy tính toán gợi ý tên
    const fatherDob = getDobString(fatherDay, fatherMonth, fatherYear);
    const motherDob = getDobString(motherDay, motherMonth, motherYear);
    
    const babyYear = layNamAmLich(dateStr);
    const fatherYearVal = fatherDob ? layNamAmLich(fatherDob) : null;
    const motherYearVal = motherDob ? layNamAmLich(motherDob) : null;

    const data = layGoiYTen({
      babyYear,
      fatherYear: fatherYearVal,
      motherYear: motherYearVal,
      gender: genderVal,
      surname
    });

    setResult(data);
    setVisibleCount(15);

    // Cuộn nhẹ xuống phần gợi ý tên
    setTimeout(() => {
      window.scrollTo({
        top: document.getElementById("naming-results-section")?.offsetTop || 500,
        behavior: "smooth"
      });
    }, 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-4">
          🔮 Phong Thủy & Ngũ Hành Cổ Điển
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-950 pb-2.5 pt-1 mb-3 leading-normal">
          BỘ CÔNG CỤ PHONG THỦY GIA ĐÌNH 2026
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Đặt tên con hợp mệnh bố mẹ, phân tích tìm ngày sinh mổ đẹp và chấm điểm chi tiết những cái tên bạn đang đắn đo.
        </p>
      </div>

      {/* PWA Installation Banner */}
      {showInstallBtn && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              🔮
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">Tải Ứng Dụng Phong Thủy Gia Đình</h4>
              <p className="text-xs text-amber-100">Cài đặt trực tiếp lên điện thoại của bạn để truy cập nhanh chóng, mượt mà hơn.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowInstallBtn(false)}
              className="px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer"
            >
              Để sau
            </button>
            <button
              onClick={handleInstallApp}
              className="px-4 py-1.5 bg-white text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-50 shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              Cài đặt ngay
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/80 mb-8">
        
        {/* Thông tin Bố & Mẹ - Dùng chung cho tất cả các tính năng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200/80 mb-6">
          {/* Father DOB Dropdowns */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Ngày sinh của Bố (Dương lịch)
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
            <span className="text-[11px] text-slate-400 italic block">Không bắt buộc, điền để tính tương hợp với Bố</span>
          </div>

          {/* Mother DOB Dropdowns */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Ngày sinh của Mẹ (Dương lịch)
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
            <span className="text-[11px] text-slate-400 italic block">Không bắt buộc, điền để tính tương hợp với Mẹ</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="overflow-x-auto -mx-2 px-2 pb-2 mb-6 border-b border-slate-200 scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {[
              { id: "suggest", href: "/", icon: "👶", label: "Đặt Tên Con" },
              { id: "csection", href: "/xem-ngay-sinh-mo", icon: "🩺", label: "Ngày Sinh Mổ" },
              { id: "check", href: "/cham-diem-ten", icon: "✍️", label: "Chấm Điểm Tên" },
              { id: "couple", href: "/xem-tuoi-vo-chong", icon: "💑", label: "Tuổi Vợ Chồng" },
              { id: "dates", href: "/xem-ngay-tot-xau", icon: "📅", label: "Ngày Tốt Xấu" },
              { id: "lunar_conv", href: "/doi-am-duong-lich", icon: "☯️", label: "Đổi Lịch" },
            ].map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => {
                  e.preventDefault();
                  changeTab(tab.id);
                }}
                className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === tab.id
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800"
                }`}
              >
                {tab.icon} {tab.label}
              </a>
            ))}
          </div>
        </div>

        {/* Tab 1: Đặt Tên Con Hợp Mệnh */}
        {activeTab === "suggest" && (
          <form onSubmit={handleCalculate} className="space-y-6 animate-fade-in">
            {/* Họ & Tên Đệm (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-slate-200/50">
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
                <span className="text-[11px] text-slate-400 italic block">Hệ thống sẽ tra cứu ngũ hành của Họ và chấm tương hợp Họ - Tên</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Gender selection */}
              <div className="space-y-2">
                <span className="block text-sm font-semibold text-slate-700">Giới tính của Bé:</span>
                <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 max-w-[200px]">
                  <button
                    type="button"
                    onClick={() => setGender("Nam")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      gender === "Nam"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    👦 Bé Trai
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("Nu")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      gender === "Nu"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    👧 Bé Gái
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg active:scale-98 transition-all text-sm tracking-wide cursor-pointer"
              >
                🔮 Tìm tên hợp mệnh
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Chọn Ngày Sinh Mổ */}
        {activeTab === "csection" && (
          <form onSubmit={handleCsectCalculate} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Ngày bắt đầu khoảng dự sinh (Dương lịch)
                </label>
                <input
                  type="date"
                  value={csectStart}
                  onChange={(e) => setCsectStart(e.target.value)}
                  className="w-full bg-white border border-slate-350 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Ngày kết thúc khoảng dự sinh (Dương lịch)
                </label>
                <input
                  type="date"
                  value={csectEnd}
                  onChange={(e) => setCsectEnd(e.target.value)}
                  className="w-full bg-white border border-slate-350 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Chọn Giới Tính Sinh Mổ */}
            <div className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700">Giới tính dự kiến của Bé:</span>
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 max-w-[200px]">
                <button
                  type="button"
                  onClick={() => setCsectGender("Nam")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    csectGender === "Nam"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  👦 Bé Trai
                </button>
                <button
                  type="button"
                  onClick={() => setCsectGender("Nu")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    csectGender === "Nu"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  👧 Bé Gái
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-450 italic">
              * Ghi chú: Hệ thống sẽ phân tích độ tương hợp Ngũ hành của các ngày trong khoảng này với Bố/Mẹ để tìm ngày tốt lành nhất cho bé chào đời, đồng thời tính ra các Khung giờ Hoàng Đạo tốt nhất trong ngày.
            </p>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg active:scale-98 transition-all text-sm tracking-wide cursor-pointer"
              >
                📅 Phân tích ngày sinh mổ
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Chấm Điểm Tên Có Sẵn */}
        {activeTab === "check" && (
          <form onSubmit={handleCheckName} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Tên chính bé dự định đặt (ví dụ: Minh Anh, Thắng, Bảo Châu...)
                </label>
                <input
                  type="text"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  placeholder="Nhập tên chính hoặc đầy đủ Họ + Tên để chấm điểm..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Năm sinh âm lịch của Bé
                </label>
                <select
                  value={babyYearSelect}
                  onChange={(e) => setBabyYearSelect(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {babyYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Họ & Tên Đệm (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Họ của Bé (Dự kiến)
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Điền để tính tương hợp Họ tộc"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Tên đệm dự kiến (Không bắt buộc)
                </label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Ví dụ: Minh, Bảo..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg active:scale-98 transition-all text-sm tracking-wide cursor-pointer"
              >
                ✍️ Chấm điểm tên này
              </button>
            </div>
          </form>
        )}

        {/* Tab 6: Đổi Lịch Âm Dương */}
        {activeTab === "lunar_conv" && (
          <form onSubmit={handleConvertDate} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chiều quy đổi */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Chiều quy đổi lịch
                </label>
                <select
                  value={convType}
                  onChange={(e) => setConvType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="sol2lun">☀️ Dương lịch ➔ 🌙 Âm lịch</option>
                  <option value="lun2sol">🌙 Âm lịch ➔ ☀️ Dương lịch</option>
                </select>
              </div>

              {/* Ngày tháng năm cần quy đổi */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {convType === "sol2lun" ? "Chọn Ngày Dương lịch cần đổi" : "Chọn Ngày Âm lịch cần đổi"}
                </label>
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={convDate}
                    onChange={(e) => setConvDate(e.target.value)}
                    className="flex-1 bg-white border border-slate-350 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                  {convType === "lun2sol" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="leap-month"
                        checked={convLunarLeap}
                        onChange={(e) => setConvLunarLeap(e.target.checked)}
                        className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                      />
                      <label htmlFor="leap-month" className="text-sm font-semibold text-slate-700 cursor-pointer">
                        Tháng nhuận?
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg active:scale-98 transition-all text-sm tracking-wide cursor-pointer"
              >
                ☯️ Thực hiện quy đổi
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Xem Tuổi Vợ Chồng */}
        {activeTab === "couple" && (
          <form onSubmit={handleCoupleCalculate} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chồng DOB */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Năm sinh âm lịch của Chồng
                </label>
                <select
                  value={fatherYear}
                  onChange={(e) => setFatherYear(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Chọn năm sinh của Chồng</option>
                  {parentYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Vợ DOB */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Năm sinh âm lịch của Vợ
                </label>
                <select
                  value={motherYear}
                  onChange={(e) => setMotherYear(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Chọn năm sinh của Vợ</option>
                  {parentYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg active:scale-98 transition-all text-sm tracking-wide cursor-pointer"
              >
                👩‍❤️‍👨 Xem mức độ hòa hợp
              </button>
            </div>
          </form>
        )}

        {/* Tab 5: Xem Ngày Tốt Xấu */}
        {activeTab === "dates" && (
          <form onSubmit={handleDatesCalculate} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Năm sinh gia chủ */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Năm sinh của Bạn
                </label>
                <select
                  value={datesUserYear}
                  onChange={(e) => setDatesUserYear(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {parentYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Loại công việc */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Công việc muốn xem
                </label>
                <select
                  value={datesWorkType}
                  onChange={(e) => setDatesWorkType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="khai_truong">🚀 Khai trương cửa hàng</option>
                  <option value="dong_tho">🏗️ Động thổ xây dựng</option>
                  <option value="nhap_trach">🏡 Nhập trạch về nhà mới</option>
                  <option value="xuat_hanh">🚗 Xuất hành đi xa</option>
                  <option value="mua_xe_ky_hop_dong">✍️ Ký hợp đồng / Mua xe</option>
                </select>
              </div>

              {/* Xem trong tháng */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Xem trong Tháng (Dương lịch)
                </label>
                <select
                  value={datesMonth}
                  onChange={(e) => setDatesMonth(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
              </div>

              {/* Xem trong năm */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Xem trong Năm
                </label>
                <select
                  value={datesYear}
                  onChange={(e) => setDatesYear(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg active:scale-98 transition-all text-sm tracking-wide cursor-pointer"
              >
                📅 Tìm ngày đẹp hợp tuổi
              </button>
            </div>
          </form>
        )}
      </div>

      {/* --- PHẦN HIỂN THỊ KẾT QUẢ --- */}

      {/* Tab 1 Results: Đặt Tên Con Hợp Mệnh */}
      {activeTab === "suggest" && result && (
        <div id="naming-results-section" className="space-y-8 animate-fade-in">
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
            <div className="space-y-4 text-sm leading-relaxed text-slate-650">
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
                      <div className="mt-3 p-3 bg-amber-50/40 rounded-xl border border-amber-200/40 text-xs text-slate-600 space-y-2.5 animate-fade-in text-left">
                        {item.dinhHuong && (
                          <div className="pb-2 border-b border-amber-200/45">
                            <span className="font-extrabold text-[10px] text-amber-800 uppercase block tracking-wider mb-1">🎯 Định vị cuộc đời: {item.dinhHuong.cat}</span>
                            <p className="italic text-slate-500 text-[11px] leading-relaxed">"{item.dinhHuong.desc}"</p>
                          </div>
                        )}
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
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all text-xs cursor-pointer"
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
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-600/10 transition-all active:scale-98 cursor-pointer"
                  >
                    📋 Copy danh sách gửi gia đình
                  </button>
                  <button
                    onClick={handleClearFavorites}
                    className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
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

      {/* Tab 2 Results: Chọn Ngày Sinh Mổ */}
      {activeTab === "csection" && csectResults && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass rounded-3xl p-6 border border-slate-200/80 shadow-lg bg-gradient-to-br from-amber-500/5 to-transparent">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              🔮 Kết Quả Phân Tích Ngày Sinh Mổ Tốt Nhất
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Dưới đây là danh sách các ngày trong khoảng dự sinh của bạn được xếp hạng độ tương hợp phong thủy với Bố Mẹ từ cao xuống thấp (Hợp Bố Mẹ tối đa là 3.0đ).
            </p>
            
            <div className="space-y-4">
              {csectResults.map((dayItem, dIdx) => (
                <div key={dIdx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3 hover:border-amber-400/40 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-base font-extrabold text-slate-800">
                        📅 Ngày {dayItem.formattedDate} (Âm lịch: {dayItem.lunarDateStr} - năm {dayItem.lunarYearName})
                      </span>
                      <div className="text-xs text-slate-500 mt-1">
                        Ngày {dayItem.dayCanChi} • Mệnh {dayItem.napAm} (Hành {dayItem.hanh})
                      </div>
                    </div>
                    <div className="text-left sm:text-right bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Độ tương hợp</span>
                      <span className="text-amber-800 font-extrabold text-lg">{dayItem.diem}đ</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-550 pt-2 border-t border-slate-100 flex flex-wrap gap-x-2 gap-y-1 items-center">
                    <span className="font-bold text-slate-400 uppercase text-[10px] mr-1">Điểm chi tiết:</span>
                    {dayItem.chiTiet.bo !== null && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">Bố ({dayItem.chiTiet.bo >= 0 ? `+${dayItem.chiTiet.bo}` : dayItem.chiTiet.bo}đ)</span>
                    )}
                    {dayItem.chiTiet.me !== null && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">Mẹ ({dayItem.chiTiet.me >= 0 ? `+${dayItem.chiTiet.me}` : dayItem.chiTiet.me}đ)</span>
                    )}
                  </div>

                  {dayItem.nhiThapBatTu && (
                    <div className="text-xs bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-left leading-relaxed">
                      <div>
                        🌌 <strong>Sao chủ ngày (Nhị Thập Bát Tú):</strong> <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${dayItem.nhiThapBatTu.loai === "Cát" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>SAO {dayItem.nhiThapBatTu.ten.toUpperCase()} ({dayItem.nhiThapBatTu.loai})</span>
                      </div>
                      <div className="text-slate-650 text-[11px]">
                        • <strong>Cốt cách:</strong> {dayItem.nhiThapBatTu.cotCach}
                      </div>
                      <div className="text-slate-650 text-[11px]">
                        • <strong>Định hướng nuôi dạy:</strong> {dayItem.nhiThapBatTu.dinhHuong}
                      </div>
                      {dayItem.saoCat && dayItem.saoCat.length > 0 && (
                        <div className="text-slate-650 text-[11px] pt-1.5 border-t border-slate-200/55 flex flex-wrap gap-1 items-center">
                          <span className="font-bold text-slate-500 mr-1">🌟 Cát tinh hội tụ:</span>
                          {dayItem.saoCat.map((star, sIdx) => (
                            <span key={sIdx} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700 font-medium">{star}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {dayItem.yinYangNote && (
                    <div className="text-xs text-amber-800 bg-amber-50/50 border border-amber-100 rounded-xl p-3 leading-relaxed">
                      💡 <strong>Âm Dương hợp mệnh:</strong> {dayItem.yinYangNote}
                    </div>
                  )}

                  <div className="text-xs text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 leading-relaxed">
                    <strong>🕒 Giờ Hoàng Đạo đẹp nhất trong ngày:</strong><br/>
                    {dayItem.luckyHours || "Chưa xác định"}
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleViewNamesForDate(dayItem.dateStr, csectGender)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
                    >
                      🔮 Xem gợi ý tên cho ngày này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3 Results: Chấm Điểm Tên Có Sẵn */}
      {activeTab === "check" && checkedNameResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass rounded-3xl p-6 border-2 border-amber-300 shadow-xl bg-amber-50/5 text-center">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 mb-3">
              {elementIcons[checkedNameResult.hanh]?.char} Hành {checkedNameResult.hanh}
            </div>
            
            <h3 className="text-3xl font-black text-slate-850 mb-2">
              {surname.trim() && `${surname.trim().charAt(0).toUpperCase() + surname.trim().slice(1)} `}
              {middleName.trim() && `${middleName.trim()} `}
              {checkedNameResult.ten}
            </h3>
            
            <div className="inline-block bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm mb-6 mt-2">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Độ hợp phong thủy</span>
              <span className="text-4xl font-black text-amber-700">{checkedNameResult.diem}đ</span>
            </div>

            {/* Formula */}
            <div className="text-xs text-slate-500 mb-6 flex flex-wrap justify-center gap-x-1.5 gap-y-1 items-center bg-slate-100/50 py-2.5 px-4 rounded-xl border border-slate-200/40 max-w-lg mx-auto">
              <span className="font-bold text-slate-450 uppercase text-[10px] mr-1">Cách tính:</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-250/30 text-slate-700 font-bold">Bé ({checkedNameResult.chiTiet.be}đ)</span>
              {checkedNameResult.chiTiet.bo !== null && (
                <>
                  <span className="text-slate-400 font-bold">+</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-250/30 text-slate-700 font-bold">Bố ({checkedNameResult.chiTiet.bo}đ)</span>
                </>
              )}
              {checkedNameResult.chiTiet.me !== null && (
                <>
                  <span className="text-slate-400 font-bold">+</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-250/30 text-slate-700 font-bold">Mẹ ({checkedNameResult.chiTiet.me}đ)</span>
                </>
              )}
              <span className="text-slate-400 font-bold">=</span>
              <span className="bg-amber-100 border border-amber-250 px-2 py-0.5 rounded text-amber-800 font-extrabold">{checkedNameResult.diem}đ (Tổng)</span>
            </div>

            {/* Life Orientation Box */}
            {checkedNameResult.dinhHuong && (
              <div className="bg-amber-50/40 border border-amber-200/50 rounded-2xl p-4 text-left max-w-lg mx-auto mb-6 animate-fade-in">
                <span className="font-extrabold text-amber-800 text-[10px] uppercase block tracking-wider mb-1">
                  🎯 Định vị cuộc đời: {checkedNameResult.dinhHuong.cat}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "{checkedNameResult.dinhHuong.desc}"
                </p>
              </div>
            )}

            {/* Element Changer Buttons */}
            <div className="mb-6 max-w-md mx-auto bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider mb-2">Hành của tên chính (Tự điều chỉnh nếu hệ thống nhận diện chưa đúng):</span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleRecalculateCustomName(h)}
                    className={`text-[11px] px-3.5 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                      customHanh === h
                        ? "bg-amber-600 border-amber-600 text-white shadow"
                        : "bg-white border-slate-250 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {elementIcons[h].char} {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Compatibility Badges */}
            {checkedNameResult.badges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-xl mx-auto">
                {checkedNameResult.badges.map((badge, bIdx) => {
                  let badgeStyle = "bg-slate-50 border-slate-200 text-slate-500";
                  if (badge.type === "success") badgeStyle = "bg-emerald-50 border-emerald-200 text-emerald-700";
                  if (badge.type === "info") badgeStyle = "bg-amber-50 border-amber-200 text-amber-800";
                  if (badge.type === "success-bo") badgeStyle = "bg-blue-50 border-blue-200 text-blue-700";
                  if (badge.type === "success-me") badgeStyle = "bg-purple-50 border-purple-200 text-purple-700";
                  return (
                    <span key={bIdx} className={`text-[10px] px-2.5 py-1 rounded-md border font-bold ${badgeStyle}`}>
                      {badge.text}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-center gap-3 mb-6 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => toggleFavorite({ ten: customNameInput, hanh: customHanh, nghia: "Tên chấm điểm tự chọn" })}
                className={`flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  favorites.some(f => f.ten === customNameInput)
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {favorites.some(f => f.ten === customNameInput) ? "❤️ Đã lưu" : "🤍 Lưu tên"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const full = `${surname.trim() ? surname.trim() + " " : ""}${middleName.trim() ? middleName.trim() + " " : ""}${checkedNameResult.ten}`.replace(/\s+/g, " ").trim();
                  navigator.clipboard.writeText(full);
                  alert("Đã copy đầy đủ Họ Tên vào bộ nhớ tạm! ✅");
                }}
                className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-650 transition-all cursor-pointer"
              >
                📋 Copy
              </button>
            </div>

            {/* Detailed explanations */}
            <div className="space-y-3 mt-6 pt-6 border-t border-slate-200 text-left max-w-2xl mx-auto">
              <h4 className="font-bold text-slate-800 text-sm mb-3">
                📖 Luận Giải Chi Tiết Phong Thủy Cho Tên Gọi:
              </h4>
              <div className="space-y-3">
                {checkedNameResult.giaiThich.map((para, pIdx) => (
                  <p key={pIdx} className="text-xs md:text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 p-3.5 rounded-xl" dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4 Results: Xem Tuổi Vợ Chồng */}
      {activeTab === "couple" && coupleResult && (
        <div className="space-y-6 animate-fade-in mt-8">
          <div className="glass rounded-3xl p-6 border-2 border-amber-300 shadow-xl bg-amber-50/5 text-center">
            
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
              👩‍❤️‍👨 Luận Giải Độ Hòa Hợp Tuổi Vợ Chồng
            </h3>

            {/* General Score */}
            <div className="inline-block bg-white border border-slate-200 px-8 py-4 rounded-2xl shadow-sm mb-6">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Điểm hòa hợp</span>
              <span className="text-4xl font-black text-amber-700">{coupleResult.diem} / 10đ</span>
              <span className={`block text-xs font-bold mt-1.5 px-2.5 py-0.5 rounded-full ${
                coupleResult.diem >= 8.5
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : coupleResult.diem >= 6.0
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : coupleResult.diem >= 4.0
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              } border`}>
                Xếp loại: {coupleResult.xepLoai}
              </span>
            </div>

            {/* Husband and Wife Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
              {/* Husband Info */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-left">
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block mb-2">
                  👦 Người Chồng ({coupleResult.chong.year})
                </span>
                <div className="text-2xl font-extrabold text-slate-800 mb-1">
                  Tuổi {coupleResult.chong.canChi}
                </div>
                <div className="text-xs font-bold text-slate-550 flex items-center gap-1.5 mt-1">
                  <span>Mệnh: {coupleResult.chong.napAm}</span>
                  <span className="text-[10px] text-slate-355">•</span>
                  <span className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold text-[10px]">Hành {coupleResult.chong.hanh}</span>
                </div>
              </div>

              {/* Wife Info */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-left">
                <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block mb-2">
                  👧 Người Vợ ({coupleResult.vo.year})
                </span>
                <div className="text-2xl font-extrabold text-slate-800 mb-1">
                  Tuổi {coupleResult.vo.canChi}
                </div>
                <div className="text-xs font-bold text-slate-550 flex items-center gap-1.5 mt-1">
                  <span>Mệnh: {coupleResult.vo.napAm}</span>
                  <span className="text-[10px] text-slate-355">•</span>
                  <span className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold text-[10px]">Hành {coupleResult.vo.hanh}</span>
                </div>
              </div>
            </div>

            {/* Explanations list */}
            <div className="space-y-3 mt-6 pt-6 border-t border-slate-200 text-left max-w-2xl mx-auto">
              <h4 className="font-bold text-slate-800 text-sm mb-3">
                📋 Phân Tích Cát Hung Chi Tiết:
              </h4>
              <div className="space-y-2">
                {coupleResult.details.map((detail, idx) => (
                  <div key={idx} className="text-xs md:text-sm text-slate-650 bg-white border border-slate-200 p-3.5 rounded-xl flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✔</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice Box */}
            <div className="bg-amber-50/40 border border-amber-200/50 rounded-2xl p-4 text-left max-w-2xl mx-auto mt-6">
              <span className="font-extrabold text-amber-800 text-[10px] uppercase block tracking-wider mb-1">
                💡 Lời khuyên hòa hợp gia đạo:
              </span>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {coupleResult.loiKhuyen}
              </p>
            </div>

            {/* Remedy/Remediation Box */}
            {coupleResult.hoaGiai && (
              <div className="bg-emerald-50/40 border border-emerald-250/50 rounded-2xl p-4 text-left max-w-2xl mx-auto mt-4">
                <span className="font-extrabold text-emerald-800 text-[10px] uppercase block tracking-wider mb-1">
                  🛠️ Gợi ý giải pháp hóa giải xung khắc:
                </span>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {coupleResult.hoaGiai}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Tab 5 Results: Xem Ngày Tốt Xấu */}
      {activeTab === "dates" && datesResult && (
        <div className="space-y-6 animate-fade-in mt-8">
          <div className="glass rounded-3xl p-6 border border-slate-200/80 shadow-lg text-center">
            
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
              📅 Danh Sách 10 Ngày Đẹp Nhất Trong Tháng
            </h3>

            {datesResult.length === 0 ? (
              <p className="text-slate-500 text-sm py-8">
                Không tìm thấy ngày nào phù hợp trong tháng này. Hãy thử chọn một khoảng thời gian khác!
              </p>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {datesResult.map((dayItem, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-amber-400 hover:shadow transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-slate-800">
                          📅 Ngày {dayItem.formattedDate}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          dayItem.isHoangDao
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                          {dayItem.isHoangDao ? "🌟 Hoàng Đạo" : "Hắc Đạo / Bình thường"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Âm lịch: {dayItem.lunarDateStr} (năm {dayItem.lunarYearName}) • Ngày {dayItem.dayCanChi}
                      </div>
                      <div className="text-xs text-slate-450 italic pt-1">
                        Mệnh ngày: {dayItem.napAm} (Hành {dayItem.hanh})
                      </div>
                      <div className="text-xs text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 mt-2 leading-relaxed max-w-xl">
                        <strong>🕒 Giờ Hoàng Đạo đẹp:</strong> {dayItem.luckyHours || "Chưa xác định"}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl self-stretch sm:self-auto min-w-[100px]">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Điểm Cát</span>
                      <span className="text-amber-800 font-extrabold text-xl">{dayItem.diem}đ</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6 Results: Đổi Lịch Âm Dương */}
      {activeTab === "lunar_conv" && convResult && (
        <div className="space-y-6 animate-fade-in mt-8">
          <div className="glass rounded-3xl p-6 border border-slate-200/80 shadow-lg bg-gradient-to-br from-amber-500/5 to-transparent">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              🔮 Kết Quả Chuyển Đổi Lịch
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Quy đổi ngày */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3 text-left">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Ngày ban đầu</span>
                  <span className="text-lg font-extrabold text-slate-800">{convResult.sourceStr}</span>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Kết quả quy đổi</span>
                  <span className="text-xl font-black text-amber-800">{convResult.targetStr}</span>
                </div>
              </div>

              {/* Box 2: Can chi & Nạp Âm */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3 text-left flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Chi tiết Can Chi</span>
                  <span className="text-sm font-bold text-slate-700 leading-relaxed block">{convResult.canChiStr}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${elementIcons[convResult.hanh]?.bg || "bg-slate-50"} ${elementIcons[convResult.hanh]?.border || "border-slate-200"} border`}>
                    {elementIcons[convResult.hanh]?.char || "☯️"}
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Ngũ hành Nạp âm Ngày</div>
                    <div className="text-xs font-black text-slate-700">Mệnh {convResult.napAm} (Hành {convResult.hanh})</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Giờ Hoàng Đạo */}
            <div className="mt-6 text-xs text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 leading-relaxed text-left">
              <strong>🕒 Các khung giờ Hoàng Đạo cát lành trong ngày:</strong><br/>
              {convResult.luckyHours || "Chưa xác định"}
            </div>
          </div>
        </div>
      )}
      {/* PWA bottom tip */}
      <div className="mt-8 text-center text-xs text-slate-400/90 space-y-2">
        <p className="flex items-center justify-center gap-1.5 flex-wrap px-4 leading-relaxed max-w-2xl mx-auto">
          <span>💡 Mẹo: Cài đặt công cụ này làm ứng dụng trên điện thoại (PWA) để mở nhanh từ màn hình chính.</span>
          <span className="block text-[11px] text-slate-400">Android/Chrome: bấm banner cài đặt hoặc Chọn cài đặt từ Menu trình duyệt. iOS/Safari: bấm nút Chia sẻ 📤 rồi chọn "Thêm vào MH chính".</span>
        </p>
      </div>
    </div>
  );
}
