/**
 * UI 표시용 포맷팅 함수들
 * formatters.js의 기본 포맷팅을 확장하여 UI 특화 포맷팅 제공
 */

import { formatPrice, formatDate } from "./formatters.js";

/**
 * 면적을 표시용 텍스트로 포맷팅합니다.
 * @param {string|number|null} area - 면적 (단위: m²)
 * @returns {string} 포맷팅된 면적 텍스트 (예: "32 m²")
 */
export function formatArea(area) {
  if (!area || area === 0) return "-";
  return `${area} m²`;
}

/**
 * 동호수 정보를 표시용 텍스트로 포맷팅합니다.
 * @param {string|number} dong - 동
 * @param {string|number} ho - 호
 * @returns {object} 포맷팅된 동호수 객체 { dongText, hoText }
 */
export function formatDongHo(dong, ho) {
  return {
    dongText: dong ? `${dong}동` : "-",
    hoText: ho ? `${ho}호` : "-",
  };
}

/**
 * 월세 정보 (보증금/월세)를 표시용 텍스트로 포맷팅합니다.
 * @param {number|null} deposit - 보증금
 * @param {number|null} monthPrice - 월세
 * @returns {string} 포맷팅된 월세 텍스트 (예: "5,000만원/50만원")
 */
export function formatMonthlyRent(deposit, monthPrice) {
  const depositText = formatPrice(deposit);
  const monthText = monthPrice ? `${monthPrice}만원` : "-";

  if (depositText === "-" && monthText === "-") return "-";
  return `${depositText}/${monthText}`;
}

/**
 * 연락처를 표시용 텍스트로 포맷팅합니다.
 * @param {string|null} phone - 연락처
 * @returns {string} 포맷팅된 연락처 (예: "010-1234-5678")
 */
export function formatPhoneNumber(phone) {
  if (!phone) return "-";

  // 숫자만 추출
  const numbers = phone.replace(/[^0-9]/g, "");

  if (numbers.length === 11) {
    // 010-1234-5678 형식
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    // 02-1234-5678 형식 (서울 지역번호)
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  return phone; // 그대로 반환
}

/**
 * 파일 크기를 표시용 텍스트로 포맷팅합니다.
 * @param {number|string|null} sizeInBytes - 파일 크기 (바이트)
 * @returns {string} 포맷팅된 파일 크기 (예: "2.5MB")
 */
export function formatFileSize(sizeInBytes) {
  if (!sizeInBytes || sizeInBytes === 0) return "-";

  const size = Number(sizeInBytes);
  if (isNaN(size)) return "-";

  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  } else if (size >= 1024) {
    return `${(size / 1024).toFixed(1)}KB`;
  } else {
    return `${size}B`;
  }
}
