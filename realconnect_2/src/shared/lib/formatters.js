/**
 * 포맷팅 유틸리티 함수들
 */

// 가격 포맷팅 (천단위 콤마)
export const formatPrice = (price) => {
  if (!price || price === 0) return "-";
  return `${price.toLocaleString()}만원`;
};

// 전화번호 포맷팅
export const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

// 날짜 포맷팅
export const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// 면적 포맷팅
export const formatArea = (area) => {
  if (!area) return "-";
  return `${area}㎡`;
};
