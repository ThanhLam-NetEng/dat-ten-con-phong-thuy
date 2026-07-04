import { getCanChiNapAm, canChiNapAmList } from "../data/canChiNapAm";
import { danhSachTen } from "../data/danhSachTen";
import { SolarDate } from "lunar-date-vn";

// Quan hệ tương sinh: A sinh B (A -> B)
const TUONG_SINH = {
  Kim: "Thủy",
  Thủy: "Mộc",
  Mộc: "Hỏa",
  Hỏa: "Thổ",
  Thổ: "Kim"
};

// Quan hệ tương khắc: A khắc B (A -> B)
const TUONG_KHAC = {
  Kim: "Mộc",
  Mộc: "Thổ",
  Thổ: "Thủy",
  Thủy: "Hỏa",
  Hỏa: "Kim"
};

// Kiểm tra A sinh B
function isSinh(hanhA, hanhB) {
  return TUONG_SINH[hanhA] === hanhB;
}

// Kiểm tra A khắc B hoặc B khắc A
function isKhac(hanhA, hanhB) {
  return TUONG_KHAC[hanhA] === hanhB || TUONG_KHAC[hanhB] === hanhA;
}

/**
 * Tính điểm phong thủy cho một tên đối với mệnh của Bé, Bố và Mẹ
 * @param {string} hanhName - Hành của tên (Kim, Mộc, Thủy, Hỏa, Thổ)
 * @param {string} hanhBaby - Hành của Bé
 * @param {string} hanhFather - Hành của Bố
 * @param {string} hanhMother - Hành của Mẹ
 * @returns {object} { totalScore, badges }
 */
export function tinhDiemTen(hanhName, hanhBaby, hanhFather, hanhMother) {
  let scoreBaby = 0;
  let scoreFather = 0;
  let scoreMother = 0;
  
  const badges = [];
  const status = {
    hopBe: false,
    sinhBo: false,
    sinhMe: false,
    khacBo: false,
    khacMe: false,
    khacBe: false
  };

  // 1. Tính điểm với Bé
  if (isSinh(hanhName, hanhBaby)) {
    // Hành của tên sinh cho mệnh Bé (Tốt nhất) - ví dụ: Thổ sinh Kim
    scoreBaby = 3;
    badges.push({ type: "success", text: `Tương sinh mệnh Bé (${hanhName} sinh ${hanhBaby})` });
    status.hopBe = true;
  } else if (hanhName === hanhBaby) {
    // Hành của tên giống mệnh Bé (Bình hòa - Tốt)
    scoreBaby = 2;
    badges.push({ type: "info", text: `Bình hòa mệnh Bé (cùng hành ${hanhBaby})` });
    status.hopBe = true;
  } else if (isSinh(hanhBaby, hanhName)) {
    // Mệnh bé sinh ra hành của tên - ví dụ: Kim sinh Thủy (Chấp nhận được)
    scoreBaby = 1;
  } else if (isKhac(hanhName, hanhBaby)) {
    // Tương khắc (Tránh)
    scoreBaby = -5;
    status.khacBe = true;
  }

  // 2. Tính điểm với Bố
  if (hanhFather) {
    if (isSinh(hanhName, hanhFather)) {
      scoreFather = 1.5;
      badges.push({ type: "success-bo", text: `Tương sinh mệnh Bố (${hanhName} sinh ${hanhFather})` });
      status.sinhBo = true;
    } else if (isSinh(hanhFather, hanhName)) {
      scoreFather = 1.5;
      badges.push({ type: "success-bo", text: `Được mệnh Bố sinh (${hanhFather} sinh ${hanhName})` });
      status.sinhBo = true;
    } else if (hanhName === hanhFather) {
      scoreFather = 1;
      status.sinhBo = true; // cũng xem là hòa hợp
    } else if (isKhac(hanhName, hanhFather)) {
      scoreFather = -2;
      status.khacBo = true;
    }
  }

  // 3. Tính điểm với Mẹ
  if (hanhMother) {
    if (isSinh(hanhName, hanhMother)) {
      scoreMother = 1.5;
      badges.push({ type: "success-me", text: `Tương sinh mệnh Mẹ (${hanhName} sinh ${hanhMother})` });
      status.sinhMe = true;
    } else if (isSinh(hanhMother, hanhName)) {
      scoreMother = 1.5;
      badges.push({ type: "success-me", text: `Được mệnh Mẹ sinh (${hanhMother} sinh ${hanhName})` });
      status.sinhMe = true;
    } else if (hanhName === hanhMother) {
      scoreMother = 1;
      status.sinhMe = true;
    } else if (isKhac(hanhName, hanhMother)) {
      scoreMother = -2;
      status.khacMe = true;
    }
  }

  const totalScore = scoreBaby + scoreFather + scoreMother;
  return {
    totalScore: parseFloat(totalScore.toFixed(1)),
    badges,
    status,
    chiTiet: {
      be: scoreBaby >= 0 ? `+${scoreBaby}` : `${scoreBaby}`,
      bo: hanhFather ? (scoreFather >= 0 ? `+${scoreFather}` : `${scoreFather}`) : null,
      me: hanhMother ? (scoreMother >= 0 ? `+${scoreMother}` : `${scoreMother}`) : null
    }
  };
}

/**
 * Tính toán đánh giá tổng quan quan hệ mệnh giữa bé và bố mẹ
 */
export function tinhDanhGiaChung(babyInfo, fatherInfo, motherInfo) {
  const recommendations = [];
  const relations = [];

  const hanhBaby = babyInfo.hanh;

  // 1. Xác định hành tốt nhất cho bé
  const totNhat = [];
  for (const h of ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"]) {
    if (isSinh(h, hanhBaby)) {
      totNhat.push(h);
    }
  }
  recommendations.push(`Hành của tên bổ trợ tốt nhất (Tương Sinh) cho bản mệnh **${babyInfo.napAm}** của Bé là hành **${totNhat.join(" và ")}** (ví dụ: đặt tên hành ${totNhat.join(", ")}). Bạn cũng có thể chọn hành **${hanhBaby}** (Bình Hòa) để tạo sự ôn hòa, vững vàng.`);

  // 2. Phân tích mối quan hệ tương sinh tương khắc
  if (fatherInfo) {
    const hanhFather = fatherInfo.hanh;
    if (isSinh(hanhBaby, hanhFather)) {
      relations.push(`Mệnh của Bé (${babyInfo.napAm} - ${hanhBaby}) tương sinh cho mệnh của Bố (${fatherInfo.napAm} - ${hanhFather}) => Rất tốt cho tài lộc của Bố.`);
    } else if (isSinh(hanhFather, hanhBaby)) {
      relations.push(`Mệnh của Bố (${fatherInfo.napAm} - ${hanhFather}) tương sinh cho mệnh của Bé (${babyInfo.napAm} - ${hanhBaby}) => Bé nhận được hồng phúc, sự che chở từ Bố.`);
    } else if (hanhBaby === hanhFather) {
      relations.push(`Mệnh của Bé và Bố cùng hành ${hanhBaby} (Bình hòa) => Gia đình đồng thuận, hòa hợp.`);
    } else if (isKhac(hanhBaby, hanhFather)) {
      relations.push(`Mệnh của Bé và Bố xung khắc nhau (${babyInfo.napAm} khắc/bị khắc với ${fatherInfo.napAm}) => Nên ưu tiên chọn tên thuộc hành trung gian để dung hòa hai mệnh.`);
    } else {
      relations.push(`Mệnh của Bé và Bố ôn hòa (không xung khắc trực tiếp).`);
    }
  }

  if (motherInfo) {
    const hanhMother = motherInfo.hanh;
    if (isSinh(hanhBaby, hanhMother)) {
      relations.push(`Mệnh của Bé (${babyInfo.napAm} - ${hanhBaby}) tương sinh cho mệnh của Mẹ (${motherInfo.napAm} - ${hanhMother}) => Rất tốt cho sức khỏe và tinh thần của Mẹ.`);
    } else if (isSinh(hanhMother, hanhBaby)) {
      relations.push(`Mệnh của Mẹ (${motherInfo.napAm} - ${hanhMother}) tương sinh cho mệnh của Bé (${babyInfo.napAm} - ${hanhBaby}) => Bé nhận được sự chăm sóc tận tình và vượng khí từ Mẹ.`);
    } else if (hanhBaby === hanhMother) {
      relations.push(`Mệnh của Bé và Mẹ cùng hành ${hanhBaby} (Bình hòa) => Tình cảm mẹ con gắn kết, thấu hiểu.`);
    } else if (isKhac(hanhBaby, hanhMother)) {
      relations.push(`Mệnh của Bé và Mẹ xung khắc nhau (${babyInfo.napAm} khắc/bị khắc với ${motherInfo.napAm}) => Nên ưu tiên chọn tên mang hành dung hòa để gia đình êm ấm.`);
    } else {
      relations.push(`Mệnh của Bé và Mẹ ôn hòa (không xung khắc trực tiếp).`);
    }
  }

  return {
    loiKhuyen: recommendations.join(" "),
    relations
  };
}

const SURNAME_ELEMENTS = {
  "Nguyễn": "Mộc",
  "Trần": "Hỏa",
  "Lê": "Hỏa",
  "Phạm": "Thủy",
  "Hoàng": "Thổ",
  "Huỳnh": "Thổ",
  "Phan": "Thủy",
  "Vũ": "Thủy",
  "Võ": "Thủy",
  "Đặng": "Hỏa",
  "Bùi": "Mộc",
  "Đỗ": "Kim",
  "Ngô": "Mộc",
  "Dương": "Hỏa",
  "Lý": "Hỏa",
  "Trịnh": "Thủy",
  "Đinh": "Hỏa",
  "Hồ": "Mộc",
  "Lương": "Hỏa"
};

const CAU_NOI = {
  "Mộc-Thổ": "Hỏa",
  "Thổ-Mộc": "Hỏa",
  "Thổ-Thủy": "Kim",
  "Thủy-Thổ": "Kim",
  "Thủy-Hỏa": "Mộc",
  "Hỏa-Thủy": "Mộc",
  "Hỏa-Kim": "Thổ",
  "Kim-Hỏa": "Thổ",
  "Kim-Mộc": "Thủy",
  "Mộc-Kim": "Thủy"
};

const BRIDGE_EXAMPLES = {
  "Hỏa": "Minh, Đăng, Huy, Nhật, Lâm",
  "Thổ": "Thành, Sơn, Bảo, Châu, Anh",
  "Kim": "Nguyên, Thắng, Khanh, Ngân, Đức",
  "Thủy": "Vũ, Hải, Giang, Hà, Khánh",
  "Mộc": "Lâm, Tùng, Bách, Thảo, Đông"
};

/**
 * Sinh văn bản giải thích phong thủy chi tiết cho từng tên
 */
export function taoLoiGiaiThichChiTiet(ten, hanhName, babyInfo, fatherInfo, motherInfo, surname) {
  const segments = [];

  // 1. Giải thích đối với Bé
  if (isSinh(hanhName, babyInfo.hanh)) {
    segments.push(`Hành <strong>${hanhName}</strong> của tên tương sinh cho bản mệnh <strong>${babyInfo.napAm}</strong> (hành ${babyInfo.hanh}) của Bé (nguyên lý ${hanhName} sinh ${babyInfo.hanh}). Đây là sự kết hợp cát tường nhất, giúp nâng đỡ vận mệnh, mang lại bình an, may mắn và tài lộc trọn đời cho con.`);
  } else if (hanhName === babyInfo.hanh) {
    segments.push(`Hành <strong>${hanhName}</strong> của tên tương hòa (bình hòa) với bản mệnh <strong>${babyInfo.napAm}</strong> của Bé. Giúp củng cố năng lượng bản mệnh vững vàng, tăng cường sự tự tin và ổn định cuộc sống.`);
  } else if (isSinh(babyInfo.hanh, hanhName)) {
    segments.push(`Bản mệnh <strong>${babyInfo.napAm}</strong> của Bé sinh cho hành <strong>${hanhName}</strong> của tên (nguyên lý ${babyInfo.hanh} sinh ${hanhName}). Sự kết hợp này tuy tương hợp nhưng bản mệnh của bé sẽ phải tiêu tốn năng lượng để nuôi dưỡng tên gọi.`);
  }

  // 2. Giải thích đối với Bố
  if (fatherInfo) {
    const hanhFather = fatherInfo.hanh;
    if (isSinh(hanhName, hanhFather)) {
      segments.push(`Hành <strong>${hanhName}</strong> của tên tương sinh cho mệnh Bố (hành ${hanhFather}) => Con cái sinh ra sẽ mang lại nhiều vượng khí, hỗ trợ công danh sự nghiệp của Bố thăng tiến, phát tài.`);
    } else if (isSinh(hanhFather, hanhName)) {
      segments.push(`Mệnh của Bố (hành ${hanhFather}) tương sinh cho hành <strong>${hanhName}</strong> của tên => Bố sẽ luôn là điểm tựa vững chắc, bảo bọc, nâng đỡ và dẫn dắt con.`);
    } else if (hanhName === hanhFather) {
      segments.push(`Hành của tên cùng hành với mệnh Bố (Bình hòa) => Cha con đồng tâm hiệp lực, tâm tính hòa hợp, gia đình êm ấm.`);
    } else if (isKhac(hanhName, hanhFather)) {
      if (TUONG_KHAC[hanhName] === hanhFather) {
        segments.push(`Hành <strong>${hanhName}</strong> của tên xung khắc với mệnh Bố (hành ${hanhFather} - tên khắc Bố) => Cha con dễ có sự bất đồng ý kiến trong cuộc sống.`);
      } else {
        segments.push(`Mệnh của Bố (hành ${hanhFather}) khắc hành <strong>${hanhName}</strong> của tên => Năng lượng của Bố khắc chế tên con (năng lượng gia đình áp chế tính cách trẻ).`);
      }
    }
  }

  // 3. Giải thích đối với Mẹ
  if (motherInfo) {
    const hanhMother = motherInfo.hanh;
    if (isSinh(hanhName, hanhMother)) {
      segments.push(`Hành <strong>${hanhName}</strong> của tên tương sinh cho mệnh Mẹ (hành ${hanhMother}) => Mang lại vượng khí dồi dào, tốt cho sức khỏe, niềm vui và sự an tâm của Mẹ.`);
    } else if (isSinh(hanhMother, hanhName)) {
      segments.push(`Mệnh của Mẹ (hành ${hanhMother}) tương sinh cho hành <strong>${hanhName}</strong> của tên => Mẹ luôn dành sự yêu thương, chăm sóc chu đáo, là bến đỗ bình yên cho con.`);
    } else if (hanhName === hanhMother) {
      segments.push(`Hành của tên cùng hành với mệnh Mẹ (Bình hòa) => Mẹ con tâm sự thấu hiểu, tình cảm vô cùng gắn kết.`);
    } else if (isKhac(hanhName, hanhMother)) {
      if (TUONG_KHAC[hanhName] === hanhMother) {
        segments.push(`Hành <strong>${hanhName}</strong> của tên xung khắc với mệnh Mẹ (hành ${hanhMother} - tên khắc Mẹ) => Có sự đối chọi hoặc khó chia sẻ giữa mẹ và con.`);
      } else {
        segments.push(`Mệnh của Mẹ (hành ${hanhMother}) khắc hành <strong>${hanhName}</strong> của tên => Năng lượng của Mẹ áp chế tên con.`);
      }
    }
  }

  // 4. Luận giải Họ và Tên chính (Nếu người dùng điền Họ)
  if (surname) {
    const cleanSurname = surname.trim();
    // Lấy chữ cái đầu viết hoa để chuẩn hóa (ví dụ: nguyễn -> Nguyễn)
    const formattedSurname = cleanSurname.charAt(0).toUpperCase() + cleanSurname.slice(1);
    const hanhSurname = SURNAME_ELEMENTS[formattedSurname];

    if (hanhSurname) {
      if (isSinh(hanhSurname, hanhName)) {
        segments.push(`Họ <strong>${formattedSurname}</strong> (${hanhSurname}) tương sinh cho tên <strong>${ten}</strong> (${hanhName}) => Bản mệnh gia tộc nuôi dưỡng tên gọi, mang lại nền tảng vững chắc.`);
      } else if (isSinh(hanhName, hanhSurname)) {
        segments.push(`Tên <strong>${ten}</strong> (${hanhName}) sinh cho Họ <strong>${formattedSurname}</strong> (${hanhSurname}) => Con cái sau này hiếu thuận, làm rạng danh dòng họ.`);
      } else if (hanhName === hanhSurname) {
        segments.push(`Họ <strong>${formattedSurname}</strong> và tên <strong>${ten}</strong> đồng hành <strong>${hanhName}</strong> (Bình hòa) => Gia đạo yên ổn, cuộc sống thuận lợi.`);
      } else if (isKhac(hanhSurname, hanhName)) {
        const key = `${hanhSurname}-${hanhName}`;
        const bridgeHanh = CAU_NOI[key];
        const examples = BRIDGE_EXAMPLES[bridgeHanh] || "";
        segments.push(`Họ <strong>${formattedSurname}</strong> (${hanhSurname}) xung khắc với tên <strong>${ten}</strong> (${hanhName}). <strong>Mẹo hóa giải:</strong> Nên chọn tên đệm thuộc hành <strong>${bridgeHanh}</strong> (ví dụ: ${examples}) để tạo vòng tương sinh khép kín: Họ (${hanhSurname}) sinh Đệm (${bridgeHanh}) sinh Tên (${hanhName}).`);
      }
    } else {
      segments.push(`Tên đầy đủ của bé dự kiến là: <strong>${formattedSurname} ${ten}</strong>.`);
    }
  }

  return segments;
}

/**
 * Gợi ý và xếp hạng danh sách tên phù hợp nhất
 * @param {object} params - { babyYear, fatherYear, motherYear, gender, surname }
 * @returns {object} { babyInfo, fatherInfo, motherInfo, dataSuggestions }
 */
export function layGoiYTen({ babyYear, fatherYear, motherYear, gender, surname }) {
  const babyInfo = getCanChiNapAm(babyYear);
  const fatherInfo = fatherYear ? getCanChiNapAm(fatherYear) : null;
  const motherInfo = motherYear ? getCanChiNapAm(motherYear) : null;

  if (!babyInfo) return null;

  const result = [];
  const gioiTinhKey = gender === "Nam" ? "Nam" : "Nu";

  // Duyệt qua cả 5 hành để chấm điểm tất cả các tên
  const hanhList = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];
  
  for (const hanh of hanhList) {
    const dsTenHanh = danhSachTen[hanh]?.[gioiTinhKey] || [];
    for (const item of dsTenHanh) {
      const evaluation = tinhDiemTen(
        hanh,
        babyInfo.hanh,
        fatherInfo?.hanh,
        motherInfo?.hanh
      );

      // Nếu tên bị khắc mệnh bé (điểm cực âm) thì có thể bỏ qua hoặc xếp cuối cùng.
      // Tuy nhiên ta vẫn giữ lại nhưng loại trừ các tên bị khắc trực tiếp với bé để đảm bảo phong thủy tốt.
      if (evaluation.status.khacBe) continue;

      const dinhHuong = layDinhHuongTen(item.ten);
      result.push({
        ten: item.ten,
        nghia: item.nghia,
        hanh: hanh,
        diem: evaluation.totalScore,
        badges: evaluation.badges,
        status: evaluation.status,
        chiTiet: evaluation.chiTiet,
        giaiThich: taoLoiGiaiThichChiTiet(item.ten, hanh, babyInfo, fatherInfo, motherInfo, surname),
        dinhHuong
      });
    }
  }

  // Sắp xếp theo thứ tự điểm giảm dần
  result.sort((a, b) => b.diem - a.diem);

  const ketLuan = tinhDanhGiaChung(babyInfo, fatherInfo, motherInfo);

  return {
    babyInfo,
    fatherInfo,
    motherInfo,
    suggestions: result,
    ketLuan
  };
}

/**
 * Gợi ý ngày sinh mổ chủ động trong khoảng thời gian cho trước
 */
export function layGoiYNgaySinh({ startDateStr, endDateStr, fatherYear, motherYear }) {
  const fatherInfo = fatherYear ? getCanChiNapAm(fatherYear) : null;
  const motherInfo = motherYear ? getCanChiNapAm(motherYear) : null;

  if (!startDateStr || !endDateStr) return [];

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  const daysList = [];
  let current = new Date(start);
  let limit = 0;
  
  while (current <= end && limit < 25) {
    limit++;
    const day = current.getDate();
    const month = current.getMonth() + 1;
    const year = current.getFullYear();
    
    try {
      const solarDate = new SolarDate({ day, month, year });
      const lunarDate = solarDate.toLunarDate();
      
      const dayCanChi = lunarDate.getDayName();
      const dayInfo = canChiNapAmList.find(item => item.canChi === dayCanChi);
      
      if (dayInfo) {
        let scoreFather = 0;
        let scoreMother = 0;
        const details = [];
        
        if (fatherInfo) {
          if (isSinh(dayInfo.hanh, fatherInfo.hanh) || isSinh(fatherInfo.hanh, dayInfo.hanh)) {
            scoreFather = 1.5;
            details.push(`Tương sinh với Bố (+1.5đ)`);
          } else if (dayInfo.hanh === fatherInfo.hanh) {
            scoreFather = 1.0;
            details.push(`Bình hòa với Bố (+1đ)`);
          } else if (isKhac(dayInfo.hanh, fatherInfo.hanh)) {
            scoreFather = -2.0;
            details.push(`Xung khắc với Bố (-2đ)`);
          }
        }
        
        if (motherInfo) {
          if (isSinh(dayInfo.hanh, motherInfo.hanh) || isSinh(motherInfo.hanh, dayInfo.hanh)) {
            scoreMother = 1.5;
            details.push(`Tương sinh với Mẹ (+1.5đ)`);
          } else if (dayInfo.hanh === motherInfo.hanh) {
            scoreMother = 1.0;
            details.push(`Bình hòa với Mẹ (+1đ)`);
          } else if (isKhac(dayInfo.hanh, motherInfo.hanh)) {
            scoreMother = -2.0;
            details.push(`Xung khắc với Mẹ (-2đ)`);
          }
        }
        
        const totalScore = scoreFather + scoreMother;
        
        const parts = dayCanChi.split(" ");
        const dayCan = parts[0];
        const dayChi = parts[1];
        
        const saoNhiThap = laySaoNhiThapBatTu(lunarDate.jd);
        const saoCatList = layDanhSachSaoCat(lunarDate.month, dayChi, dayCan);

        const isYangCan = ["Giáp", "Bính", "Mậu", "Canh", "Nhâm"].some(c => dayCanChi.startsWith(c));
        const isYangChi = ["Tý", "Dần", "Thìn", "Ngọ", "Thân", "Tuất"].some(c => dayCanChi.endsWith(c));
        
        let yinYangNote = "";
        if (isYangCan && isYangChi) {
          yinYangNote = "Ngày thuần Dương: Rất tốt cho bé trai, bồi đắp khí chất mạnh mẽ, quyết đoán.";
        } else if (!isYangCan && !isYangChi) {
          yinYangNote = "Ngày thuần Âm: Rất tốt cho bé gái, bồi đắp khí chất dịu dàng, thông minh, sâu sắc.";
        } else {
          yinYangNote = "Ngày Âm Dương cân bằng: Khí cát điều hòa, thích hợp cho cả bé trai và bé gái.";
        }

        daysList.push({
          dateStr: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          formattedDate: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
          lunarDateStr: `${lunarDate.day}/${lunarDate.month} âm lịch`,
          lunarYearName: lunarDate.getYearName(),
          dayCanChi: dayCanChi,
          napAm: dayInfo.napAm,
          hanh: dayInfo.hanh,
          diem: parseFloat(totalScore.toFixed(1)),
          details,
          luckyHours: lunarDate.getLuckyHours().map(h => `${h.name} (${h.time[0]}h-${h.time[1]}h)`).join(", "),
          chiTiet: { bo: scoreFather, me: scoreMother },
          yinYangNote,
          nhiThapBatTu: saoNhiThap,
          saoCat: saoCatList
        });
      }
    } catch (e) {
      console.error("Lỗi tính toán ngày sinh:", e);
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  // Sắp xếp ngày có điểm cao nhất lên đầu
  daysList.sort((a, b) => b.diem - a.diem);
  return daysList;
}

/**
 * Tra cứu thông tin tên có sẵn để chuẩn bị chấm điểm
 */
export function chamDiemTenCoSan({ name, babyYear, fatherYear, motherYear }) {
  const babyInfo = getCanChiNapAm(babyYear);
  const fatherInfo = fatherYear ? getCanChiNapAm(fatherYear) : null;
  const motherInfo = motherYear ? getCanChiNapAm(motherYear) : null;

  if (!babyInfo || !name) return null;

  const cleanName = name.trim();
  const words = cleanName.split(/\s+/);
  const mainName = words[words.length - 1];

  // Chuẩn hóa tên chính (ví dụ: anh -> Anh)
  const formattedMainName = mainName.charAt(0).toUpperCase() + mainName.slice(1).toLowerCase();

  // Khởi tạo bảng tra cứu ngược tên -> hành & nghĩa
  const NAME_TO_ELEMENT = {};
  for (const element of ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"]) {
    for (const gender of ["Nam", "Nu"]) {
      const list = danhSachTen[element]?.[gender] || [];
      for (const item of list) {
        NAME_TO_ELEMENT[item.ten.toLowerCase()] = { element, nghia: item.nghia };
      }
    }
  }

  const lookup = NAME_TO_ELEMENT[formattedMainName.toLowerCase()];
  let hanh = lookup?.element || null;
  let nghia = lookup?.nghia || "Ý nghĩa tốt lành, hòa hợp phong thủy.";

  return {
    babyInfo,
    fatherInfo,
    motherInfo,
    ten: cleanName,
    tenChinh: formattedMainName,
    hanhMacDinh: hanh,
    nghia,
    daTimThay: !!hanh
  };
}

/**
 * Tính điểm cho một tên cụ thể với hành đã xác định
 */
export function tinhDiemChoTenDaChon({ name, hanh, babyYear, fatherYear, motherYear, surname }) {
  const babyInfo = getCanChiNapAm(babyYear);
  const fatherInfo = fatherYear ? getCanChiNapAm(fatherYear) : null;
  const motherInfo = motherYear ? getCanChiNapAm(motherYear) : null;

  if (!babyInfo || !name || !hanh) return null;

  const evaluation = tinhDiemTen(
    hanh,
    babyInfo.hanh,
    fatherInfo?.hanh,
    motherInfo?.hanh
  );

  const giaiThich = taoLoiGiaiThichChiTiet(name, hanh, babyInfo, fatherInfo, motherInfo, surname);
  const dinhHuong = layDinhHuongTen(name);

  return {
    ten: name,
    hanh: hanh,
    diem: evaluation.totalScore,
    badges: evaluation.badges,
    status: evaluation.status,
    chiTiet: evaluation.chiTiet,
    giaiThich,
    dinhHuong
  };
}

// --- DỮ LIỆU NHỊ THẬP BÁT TÚ (28 SAO) ---
const NHI_THAP_BAT_TU = [
  { ten: "Giác", loai: "Cát", cotCach: "Thông minh, đắc lợi, học hành thi cử đỗ đạt, cuộc sống an ổn thanh nhàn.", dinhHuong: "Nên định hướng phát triển học vấn chuyên sâu, công nghệ hoặc quản lý." },
  { ten: "Cang", loai: "Hung", cotCach: "Tính cách kiên cường, bộc trực, hậu vận trung bình nhưng cần rèn luyện tính kiên nhẫn.", dinhHuong: "Phù hợp các ngành kỹ thuật tự động, thể thao hoặc quân đội." },
  { ten: "Đê", loai: "Hung", cotCach: "Ý chí tự lập cao, tự mình vươn lên, cuộc đời trải qua nhiều rèn luyện mới có thành tựu.", dinhHuong: "Nên khuyến khích tự lập sớm, định hướng kinh doanh hoặc kỹ nghệ." },
  { ten: "Phòng", loai: "Cát", cotCach: "Nhân duyên tốt lành, tài lộc dồi dào, gia đạo hòa hợp, gặp dữ hóa lành.", dinhHuong: "Phù hợp kinh tế, tài chính, quan hệ công chúng hoặc quản trị kinh doanh." },
  { ten: "Tâm", loai: "Hung", cotCach: "Tính cách thầm trầm, tư duy sâu sắc, thích nghiên cứu và có năng khiếu nghệ thuật.", dinhHuong: "Định hướng nghiên cứu khoa học, triết học, tâm lý hoặc nghệ thuật." },
  { ten: "Vĩ", loai: "Cát", cotCach: "Sinh lực dồi dào, mang trường khí sáng tạo mạnh mẽ, hậu vận tự mình xây dựng cơ nghiệp hưng vượng.", dinhHuong: "Nên khuyến khích bé phát huy các năng khiếu bẩm sinh như nghệ thuật, thiết kế hoặc kiến trúc." },
  { ten: "Cơ", loai: "Cát", cotCach: "Cốt cách tự do phóng khoáng, thích trải nghiệm, dễ đạt thành tựu nơi xa xứ.", dinhHuong: "Phù hợp du lịch, ngoại giao, truyền thông hoặc thương mại quốc tế." },
  { ten: "Đẩu", loai: "Cát", cotCach: "Học thức uyên thâm, tính tình điềm đạm, công danh hiển hách, thăng tiến thuận lợi.", dinhHuong: "Định hướng nghiên cứu, giảng dạy, luật pháp hoặc quản lý nhà nước." },
  { ten: "Ngưu", loai: "Hung", cotCach: "Tính tình siêng năng, chịu khó, có chí tiến thủ cao, tiền vận vất vả hậu vận an nhàn.", dinhHuong: "Thích hợp với nông nghiệp công nghệ cao, quản lý sản xuất hoặc tài chính." },
  { ten: "Nữ", loai: "Hung", cotCach: "Tự chủ, tháo vát, có khả năng quản lý gia đình và xã hội tốt.", dinhHuong: "Phù hợp ngành dịch vụ, y tế, giáo dục hoặc tổ chức sự kiện." },
  { ten: "Hư", loai: "Hung", cotCach: "Tư duy độc lập, cá tính mạnh, cần rèn luyện đức tính kiên nhẫn để tránh thăng trầm.", dinhHuong: "Nên hướng vào ngành công nghệ thông tin, phân tích dữ liệu hoặc sáng tạo tự do." },
  { ten: "Nguy", loai: "Hung", cotCach: "Cẩn thận, tỉ mỉ, thích an toàn, cuộc sống bình ổn nếu biết bằng lòng.", dinhHuong: "Phù hợp kế toán, kiểm toán, hành chính văn phòng hoặc nghiên cứu tài liệu." },
  { ten: "Thất", loai: "Cát", cotCach: "Trí tuệ sắc sảo, dũng cảm, mưu trí, dễ đạt được thành công lớn trong sự nghiệp.", dinhHuong: "Định hướng kinh doanh quy mô lớn, đầu tư mạo hiểm hoặc lãnh đạo." },
  { ten: "Bích", loai: "Cát", cotCach: "Khoan dung, hiếu nghĩa, học vấn uyên thâm, được quý nhân phù trợ trọn đời.", dinhHuong: "Phù hợp văn học, báo chí, luật sư hoặc công tác xã hội." },
  { ten: "Khuê", loai: "Hung", cotCach: "Tâm hồn lãng mạn, nhạy cảm, có khiếu văn chương nghệ thuật nổi trội.", dinhHuong: "Nên định hướng phát triển hội họa, âm nhạc, viết lách hoặc thời trang." },
  { ten: "Lâu", loai: "Cát", cotCach: "Hoạt bát, nhanh nhạy, có năng khiếu thương mại và quản lý tài chính xuất sắc.", dinhHuong: "Phù hợp kinh doanh, môi giới tài chính, logistics hoặc dịch vụ." },
  { ten: "Vị", loai: "Cát", cotCach: "Cốt cách phú quý, sung túc, có lộc ăn uống và quản lý gia sản tốt.", dinhHuong: "Phù hợp ẩm thực, bất động sản, tài chính gia đình hoặc quản lý khách sạn." },
  { ten: "Mão", loai: "Hung", cotCach: "Kiên nghị, trung thực, thẳng thắn, cần chú ý lời ăn tiếng nói để tránh thị phi.", dinhHuong: "Phù hợp kỹ thuật, chế tạo, nghiên cứu thực địa hoặc y khoa." },
  { ten: "Tất", loai: "Cát", cotCach: "Hiền hậu, nho nhã, có cuộc sống yên bình, hạnh phúc bên gia đình.", dinhHuong: "Định hướng các ngành sư phạm, chăm sóc khách hàng, y tế hoặc nhân sự." },
  { ten: "Chủy", loai: "Hung", cotCach: "Tư duy phản biện sắc bén, quyết đoán, dễ đạt vị trí cao trong tổ chức.", dinhHuong: "Phù hợp tư vấn chiến lược, biện hộ pháp lý hoặc quản lý rủi ro." },
  { ten: "Sâm", loai: "Cát", cotCach: "Khí chất tôn quý, tài hoa vượt trội, dễ trở thành nhân vật trung tâm thu hút đám đông.", dinhHuong: "Định hướng biểu diễn, nghệ thuật công chúng, PR hoặc quản trị cấp cao." },
  { ten: "Tỉnh", loai: "Cát", cotCach: "Học tập nhanh, trí nhớ tốt, cuộc sống giàu tình cảm và ấm cúng.", dinhHuong: "Thích hợp giáo dục, tâm lý học, dịch thuật hoặc nghiên cứu văn hóa." },
  { ten: "Quỷ", loai: "Hung", cotCach: "Linh cảm nhạy bén, thích khám phá tâm linh hoặc những điều bí ẩn.", dinhHuong: "Định hướng tâm lý học hành vi, thám tử, lịch sử hoặc khảo cổ." },
  { ten: "Liễu", loai: "Hung", cotCach: "Khéo léo, dẻo dai, khả năng thích ứng với môi trường cực kỳ cao.", dinhHuong: "Phù hợp đàm phán thương mại, quan hệ quốc tế hoặc thể thao nghệ thuật." },
  { ten: "Tinh", loai: "Hung", cotCach: "Cá tính độc đáo, yêu thích tự do, thích tự đi con đường riêng.", dinhHuong: "Định hướng start-up công nghệ, phát minh sáng chế hoặc nghệ sĩ độc lập." },
  { ten: "Trương", loai: "Cát", cotCach: "Khéo giao tiếp, gia đạo hiển đạt, tài lộc hanh thông nhờ sự trợ giúp của bạn bè.", dinhHuong: "Phù hợp bán hàng, truyền thông, marketing hoặc dịch vụ khách hàng." },
  { ten: "Dực", loai: "Cát", cotCach: "Tâm hồn bay bổng, yêu thiên nhiên, cuộc đời nhiều may mắn và được mọi người yêu mến.", dinhHuong: "Phù hợp sinh học, môi trường, thiết kế cảnh quan hoặc sáng tác văn học." },
  { ten: "Chẩn", loai: "Cát", cotCach: "Điềm tĩnh, chu đáo, làm việc có kế hoạch, hậu vận thịnh vượng bền vững.", dinhHuong: "Phù hợp quy hoạch chiến lược, quản lý dự án, bác sĩ hoặc tài chính doanh nghiệp." }
];

export function laySaoNhiThapBatTu(jd) {
  if (!jd || isNaN(jd)) return null;
  const index = (jd + 4) % 28;
  const adjustedIndex = index < 0 ? index + 28 : index;
  return NHI_THAP_BAT_TU[adjustedIndex];
}

export function layDanhSachSaoCat(lunarMonth, dayChi, dayCan) {
  const list = ["Hoàng Đạo", "Thiên Ân", "Kính Tâm"];
  
  const thienHyList = ["Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu"];
  if (dayChi === thienHyList[lunarMonth - 1]) {
    list.push("Thiên Hỷ", "Phúc Tinh");
  }
  
  const thienDucList = ["Đinh", "Thân", "Nhâm", "Tân", "Hợi", "Giáp", "Quý", "Dần", "Bính", "Ất", "Tỵ", "Canh"];
  if (dayCan === thienDucList[lunarMonth - 1]) {
    list.push("Thiên Đức");
  }
  
  const nguyetDucList = ["Bính", "Giáp", "Nhâm", "Canh", "Bính", "Giáp", "Nhâm", "Canh", "Bính", "Giáp", "Nhâm", "Canh"];
  if (dayCan === nguyetDucList[lunarMonth - 1]) {
    list.push("Nguyệt Đức");
  }
  
  const tamHopMap = {
    1: ["Ngọ", "Tuất"],
    2: ["Mão", "Mùi"],
    3: ["Thân", "Tý"],
    4: ["Dậu", "Sửu"],
    5: ["Tuất", "Dần"],
    6: ["Hợi", "Mão"],
    7: ["Tý", "Thìn"],
    8: ["Tỵ", "Sửu"],
    9: ["Dần", "Ngọ"],
    10: ["Mão", "Mùi"],
    11: ["Thân", "Thìn"],
    12: ["Tỵ", "Dậu"]
  };
  const th = tamHopMap[lunarMonth];
  if (th && th.includes(dayChi)) {
    list.push("Tam Hợp");
  }

  const extraStars = ["Sinh Khí", "Địa Tài", "Mẫu Thương", "Thiên Giải", "Dịch Mã", "Giải Thần", "Ngọc Đường"];
  const seed = dayChi.charCodeAt(0) + (dayCan ? dayCan.charCodeAt(0) : 0);
  const extra1 = extraStars[seed % extraStars.length];
  const extra2 = extraStars[(seed + 3) % extraStars.length];
  if (!list.includes(extra1)) list.push(extra1);
  if (!list.includes(extra2)) list.push(extra2);
  
  return list;
}

export function layDinhHuongTen(name) {
  const triTueNames = [
    "Anh", "Triết", "Tuệ", "Minh", "Khoa", "Học", "Trí", "Văn", "Chí", "Nhân", "Nghĩa", "Lễ", "Tín", 
    "Hiền", "Đức", "Dung", "Thư", "Nhã", "Khang", "An", "Bình", "Tĩnh", "Uyển", "Thanh", "Lâm", 
    "Khuê", "Thảo", "Trúc", "Cầm", "Thi", "Họa", "Vân", "Kiều", "Mai", "Lan", "Cúc", "Huệ", "Quỳnh"
  ];
  
  const cleanName = name.trim();
  const words = cleanName.split(/\s+/);
  const mainName = words[words.length - 1];
  const formattedName = mainName.charAt(0).toUpperCase() + mainName.slice(1).toLowerCase();
  
  if (triTueNames.includes(formattedName)) {
    return {
      cat: "HỌC THỨC & TRÍ TUỆ",
      desc: "Minh triết vững cơ sở. Tên này giúp củng cố bản nguyên Nhật chủ, gia tăng tư duy mẫn tiệp, hỗ trợ đường học vấn sâu rộng, rất thích hợp phát triển làm học giả, chuyên gia, bác sĩ, giáo sư."
    };
  } else {
    return {
      cat: "CÔNG DANH & SỰ NGHIỆP",
      desc: "Phú quý & Hiển đạt. Tên này mang trường khí quang minh, vương giả, kích hoạt mạnh mẽ trục tài lộc, nâng đỡ đường quan lộ và định hình tư chất lãnh đạo, ngoại giao lớn."
    };
  }
}

export function tinhTuoiVoChong({ chongYear, voYear }) {
  const chongInfo = getCanChiNapAm(chongYear);
  const voInfo = getCanChiNapAm(voYear);

  if (!chongInfo || !voInfo) return null;

  const chongParts = chongInfo.canChi.split(" ");
  const chongCan = chongParts[0];
  const chongChi = chongParts[1];

  const voParts = voInfo.canChi.split(" ");
  const voCan = voParts[0];
  const voChi = voParts[1];

  let scoreHanh = 0;
  let detailHanh = "";
  if (isSinh(chongInfo.hanh, voInfo.hanh)) {
    scoreHanh = 4.0;
    detailHanh = `Mệnh chồng tương sinh cho mệnh vợ (${chongInfo.hanh} sinh ${voInfo.hanh}) - Rất tốt (+4.0đ)`;
  } else if (isSinh(voInfo.hanh, chongInfo.hanh)) {
    scoreHanh = 4.0;
    detailHanh = `Mệnh vợ tương sinh cho mệnh chồng (${voInfo.hanh} sinh ${chongInfo.hanh}) - Rất tốt (+4.0đ)`;
  } else if (chongInfo.hanh === voInfo.hanh) {
    scoreHanh = 2.5;
    detailHanh = `Mệnh hai vợ chồng bình hòa (Cùng hành ${chongInfo.hanh}) - Tốt (+2.5đ)`;
  } else if (TUONG_KHAC[chongInfo.hanh] === voInfo.hanh) {
    scoreHanh = 1.5;
    detailHanh = `Mệnh chồng khắc mệnh vợ (${chongInfo.hanh} khắc ${voInfo.hanh}). Theo quan niệm 'Chồng khắc vợ thì thuận' - Bình thường (+1.5đ)`;
  } else {
    scoreHanh = 0.5;
    detailHanh = `Mệnh vợ khắc mệnh chồng (${voInfo.hanh} khắc ${chongInfo.hanh}). Theo quan niệm 'Vợ khắc chồng là nghịch' - Cần nhường nhịn (+0.5đ)`;
  }

  let scoreCan = 1.0;
  let detailCan = `Thiên can ${chongCan} và ${voCan} bình hòa (+1.0đ)`;

  const canHop = {
    "Giáp": "Kỷ", "Kỷ": "Giáp",
    "Ất": "Canh", "Canh": "Ất",
    "Bính": "Tân", "Tân": "Bính",
    "Đinh": "Nhâm", "Nhâm": "Đinh",
    "Mậu": "Quý", "Quý": "Mậu"
  };
  const canKhac = {
    "Giáp": ["Canh", "Mậu"], "Ất": ["Tân", "Kỷ"],
    "Bính": ["Nhâm", "Canh"], "Đinh": ["Quý", "Tân"],
    "Mậu": ["Giáp", "Nhâm"], "Kỷ": ["Ất", "Quý"],
    "Canh": ["Bính", "Giáp"], "Tân": ["Đinh", "Ất"],
    "Nhâm": ["Mậu", "Bính"], "Quý": ["Kỷ", "Đinh"]
  };

  if (canHop[chongCan] === voCan) {
    scoreCan = 2.0;
    detailCan = `Thiên can tương hợp (${chongCan} hợp ${voCan}) - Rất tốt (+2.0đ)`;
  } else if (canKhac[chongCan]?.includes(voCan) || canKhac[voCan]?.includes(chongCan)) {
    scoreCan = 0.0;
    detailCan = `Thiên can xung khắc (${chongCan} khắc ${voCan}) - Cần thận trọng (+0đ)`;
  }

  let scoreChi = 1.0;
  let detailChi = `Địa chi ${chongChi} và ${voChi} bình hòa (+1.0đ)`;

  if (chongChi === voChi) {
    scoreChi = 2.0;
    detailChi = `Địa chi hai vợ chồng đồng tuổi (${chongChi}) - Bình hòa (+2.0đ)`;
  } else {
    const tamHop = [
      ["Dần", "Ngọ", "Tuất"],
      ["Hợi", "Mão", "Mùi"],
      ["Thân", "Tý", "Thìn"],
      ["Tỵ", "Dậu", "Sửu"]
    ];
    let isTamHop = false;
    for (const group of tamHop) {
      if (group.includes(chongChi) && group.includes(voChi)) {
        isTamHop = true;
        break;
      }
    }

    const lucHop = {
      "Tý": "Sửu", "Sửu": "Tý",
      "Dần": "Hợi", "Hợi": "Dần",
      "Mão": "Tuất", "Tuất": "Mão",
      "Thìn": "Dậu", "Dậu": "Thìn",
      "Tỵ": "Thân", "Thân": "Tỵ",
      "Ngọ": "Mùi", "Mùi": "Ngọ"
    };

    const tuHanhXung = [
      ["Tý", "Ngọ"], ["Mão", "Dậu"],
      ["Dần", "Thân"], ["Tỵ", "Hợi"],
      ["Thìn", "Tuất"], ["Sửu", "Mùi"]
    ];
    let isXung = false;
    for (const pair of tuHanhXung) {
      if (pair.includes(chongChi) && pair.includes(voChi)) {
        isXung = true;
        break;
      }
    }

    const lucHai = {
      "Tý": "Mùi", "Mùi": "Tý",
      "Sửu": "Ngọ", "Ngọ": "Sửu",
      "Dần": "Tỵ", "Tỵ": "Dần",
      "Mão": "Thìn", "Thìn": "Mão",
      "Thân": "Hợi", "Hợi": "Thân",
      "Dậu": "Tuất", "Tuất": "Dậu"
    };

    if (isTamHop) {
      scoreChi = 4.0;
      detailChi = `Địa chi Tam Hợp (${chongChi} - ${voChi}) - Rất tốt (+4.0đ)`;
    } else if (lucHop[chongChi] === voChi) {
      scoreChi = 3.0;
      detailChi = `Địa chi Nhị Hợp (${chongChi} hợp ${voChi}) - Tốt (+3.0đ)`;
    } else if (isXung) {
      scoreChi = 0.0;
      detailChi = `Địa chi Tứ Hành Xung đối khắc (${chongChi} xung ${voChi}) - Cần đề phòng xung khẩu (+0đ)`;
    } else if (lucHai[chongChi] === voChi) {
      scoreChi = 0.2;
      detailChi = `Địa chi phạm Lục Hại (${chongChi} hại ${voChi}) - Cần thận trọng (+0.2đ)`;
    }
  }

  const totalScore = scoreHanh + scoreCan + scoreChi;

  let xepLoai = "Bình thường";
  let loiKhuyen = "Tuổi hai vợ chồng ở mức bình hòa, không quá xung cũng không quá hợp. Cuộc sống gia đạo có êm ấm, thuận lợi hay không phụ thuộc lớn vào sự nhường nhịn, biết lắng nghe và thấu hiểu lẫn nhau giữa hai người.";
  let hoaGiai = "";

  if (totalScore >= 8.5) {
    xepLoai = "Rất Hợp";
    loiKhuyen = "Duyên lành tiền định, gia đạo vô cùng hòa hợp cát lợi. Hai bạn có sự đồng điệu lớn cả về suy nghĩ lẫn hành động, cuộc sống sau kết hôn nhiều may mắn, tài lộc dồi dào, con cái thuận lợi.";
  } else if (totalScore >= 6.0) {
    xepLoai = "Hợp";
    loiKhuyen = "Tuổi hai vợ chồng tương hợp khá tốt. Gia đình hòa thuận, công việc làm ăn dễ gặp hanh thông thuận lợi. Dù thỉnh thoảng có bất đồng nhỏ nhưng dễ dàng giải quyết nhờ sự bao dung.";
  } else if (totalScore < 4.0) {
    xepLoai = "Nên Cân Nhắc";
    loiKhuyen = "Tuổi hai vợ chồng phạm nhiều xung khắc về bản mệnh hoặc địa chi. Cuộc sống hôn nhân dễ phát sinh mâu thuẫn, khắc khẩu hoặc gặp khó khăn trong công việc làm ăn. Hai bạn cần hết sức kiên nhẫn, học cách kiểm soát cái tôi.";
    
    const bridgeElement = {
      "Kim-Mộc": "Thủy",
      "Mộc-Thổ": "Hỏa",
      "Thổ-Thủy": "Kim",
      "Thủy-Hỏa": "Mộc",
      "Hỏa-Kim": "Thổ"
    };
    
    const pair1 = `${chongInfo.hanh}-${voInfo.hanh}`;
    const pair2 = `${voInfo.hanh}-${chongInfo.hanh}`;
    const bridge = bridgeElement[pair1] || bridgeElement[pair2];
    
    if (bridge) {
      hoaGiai = `Hai bạn có mệnh ngũ hành xung khắc (${chongInfo.hanh} khắc ${voInfo.hanh}). Cách hóa giải tốt nhất là tạo ra cầu nối hành ${bridge} bằng cách: sinh con mang mệnh ${bridge}, hoặc chọn hướng bếp, hướng phòng ngủ tương sinh cho mệnh của cả hai.`;
    } else {
      hoaGiai = "Bố mẹ nên chọn sinh con vào năm có ngũ hành nạp âm tương sinh với cả hai vợ chồng để làm cầu nối hóa giải xung khắc, đồng thời thiết kế hướng nhà, hướng bếp quay về hướng tốt theo cung mệnh cát lành.";
    }
  }

  return {
    chong: { year: chongYear, canChi: chongInfo.canChi, napAm: chongInfo.napAm, hanh: chongInfo.hanh },
    vo: { year: voYear, canChi: voInfo.canChi, napAm: voInfo.napAm, hanh: voInfo.hanh },
    diem: parseFloat(totalScore.toFixed(1)),
    xepLoai,
    details: [detailHanh, detailCan, detailChi],
    loiKhuyen,
    hoaGiai
  };
}

export function tinhNgayTotXau({ userYear, workType, year, month }) {
  const userBranchInfo = getCanChiNapAm(userYear);
  if (!userBranchInfo) return [];
  const userBranchParts = userBranchInfo.canChi.split(" ");
  const userChi = userBranchParts[1];
  const userHanh = userBranchInfo.hanh;

  const daysInMonth = new Date(year, month, 0).getDate();
  const results = [];

  for (let d = 1; d <= daysInMonth; d++) {
    try {
      const sd = new SolarDate({ day: d, month: month, year: year });
      const ld = sd.toLunarDate();
      
      const dayCanChi = ld.getDayName();
      const dayParts = dayCanChi.split(" ");
      const dayCan = dayParts[0];
      const dayChi = dayParts[1];
      
      const dayInfo = canChiNapAmList.find(item => item.canChi === dayCanChi);
      const dayHanh = dayInfo ? dayInfo.hanh : "Chưa rõ";
      const dayNapAm = dayInfo ? dayInfo.napAm : "Chưa rõ";

      const tuHanhXung = [
        ["Tý", "Ngọ"], ["Mão", "Dậu"],
        ["Dần", "Thân"], ["Tỵ", "Hợi"],
        ["Thìn", "Tuất"], ["Sửu", "Mùi"]
      ];
      let isXungTuoi = false;
      for (const pair of tuHanhXung) {
        if (pair.includes(userChi) && pair.includes(dayChi)) {
          isXungTuoi = true;
          break;
        }
      }
      
      if (isXungTuoi) continue;

      const HOANG_DAO_MAP = {
        1: ["Tý", "Sửu", "Tỵ", "Mùi", "Dậu", "Hợi"],
        2: ["Dần", "Mão", "Ngọ", "Thân", "Tuất", "Hợi"],
        3: ["Thìn", "Tỵ", "Thân", "Tuất", "Tý", "Sửu"],
        4: ["Ngọ", "Mùi", "Tuất", "Tý", "Dần", "Mão"],
        5: ["Thân", "Dậu", "Tý", "Dần", "Thìn", "Tỵ"],
        6: ["Tuất", "Hợi", "Dần", "Thìn", "Ngọ", "Mùi"],
        7: ["Tý", "Sửu", "Tỵ", "Mùi", "Dậu", "Hợi"],
        8: ["Dần", "Mão", "Ngọ", "Thân", "Tuất", "Hợi"],
        9: ["Thìn", "Tỵ", "Thân", "Tuất", "Tý", "Sửu"],
        10: ["Ngọ", "Mùi", "Tuất", "Tý", "Dần", "Mão"],
        11: ["Thân", "Dậu", "Tý", "Dần", "Thìn", "Tỵ"],
        12: ["Tuất", "Hợi", "Dần", "Thìn", "Ngọ", "Mùi"]
      };
      
      const lunarMonth = ld.month;
      const hoangDaoList = HOANG_DAO_MAP[lunarMonth] || [];
      const isHoangDao = hoangDaoList.includes(dayChi);
      
      let baseScore = isHoangDao ? 7.0 : 4.0;

      let matchScore = 0;
      if (isSinh(dayHanh, userHanh)) {
        matchScore = 2.0;
      } else if (isSinh(userHanh, dayHanh)) {
        matchScore = 1.0;
      } else if (dayHanh === userHanh) {
        matchScore = 1.5;
      } else if (TUONG_KHAC[dayHanh] === userHanh) {
        matchScore = -1.0;
      } else {
        matchScore = 0.5;
      }

      let activityScore = 0;
      if (workType === "dong_tho" || workType === "nhap_trach") {
        if (dayHanh === "Thổ" || dayHanh === "Hỏa") activityScore = 1.0;
      } else if (workType === "khai_truong" || workType === "mua_xe_ky_hop_dong") {
        if (dayHanh === "Kim" || dayHanh === "Thủy") activityScore = 1.0;
      } else if (workType === "xuat_hanh") {
        if (dayHanh === "Thủy" || dayHanh === "Mộc") activityScore = 1.0;
      }

      const totalScore = baseScore + matchScore + activityScore;
      
      const formattedDate = `${d}/${month}/${year}`;
      const lunarDateStr = `${ld.day}/${ld.month}/${ld.year}`;
      const luckyHoursStr = ld.getLuckyHours().map(h => `${h.name} (${h.time[0]}h-${h.time[1]}h)`).join(", ");

      results.push({
        dateStr: `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        formattedDate,
        lunarDateStr,
        lunarYearName: ld.getYearName(),
        dayCanChi,
        napAm: dayNapAm,
        hanh: dayHanh,
        isHoangDao,
        luckyHours: luckyHoursStr,
        diem: parseFloat(totalScore.toFixed(1))
      });
    } catch (err) {
      console.error(err);
    }
  }

  results.sort((a, b) => b.diem - a.diem);
  return results.slice(0, 10);
}
