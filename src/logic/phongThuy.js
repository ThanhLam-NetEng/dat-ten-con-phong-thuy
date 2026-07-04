import { getCanChiNapAm } from "../data/canChiNapAm";
import { danhSachTen } from "../data/danhSachTen";

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

      result.push({
        ten: item.ten,
        nghia: item.nghia,
        hanh: hanh,
        diem: evaluation.totalScore,
        badges: evaluation.badges,
        status: evaluation.status,
        chiTiet: evaluation.chiTiet,
        giaiThich: taoLoiGiaiThichChiTiet(item.ten, hanh, babyInfo, fatherInfo, motherInfo, surname)
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
