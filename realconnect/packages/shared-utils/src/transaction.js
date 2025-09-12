/**
 * 거래 유형 관련 통합 로직
 * 매물, 계약, 문의에서 사용하는 거래 유형을 통합 관리
 */

// 거래 유형 상수 정의
export const TRANSACTION_TYPES = {
  BUY: "BUY",
  JEONSE: "JEONSE",
  MONTH_RENT: "MONTH_RENT",
};

// 거래 유형 한글 매핑
export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.BUY]: "매매",
  [TRANSACTION_TYPES.JEONSE]: "전세",
  [TRANSACTION_TYPES.MONTH_RENT]: "월세",
};

// 역방향 매핑 (한글 → 코드)
export const TRANSACTION_TYPE_CODES = {
  매매: TRANSACTION_TYPES.BUY,
  전세: TRANSACTION_TYPES.JEONSE,
  월세: TRANSACTION_TYPES.MONTH_RENT,
};

/**
 * 거래 유형 코드를 한글 텍스트로 변환합니다.
 * @param {string|null} typeCode - 거래 유형 코드 ("BUY", "JEONSE", "MONTH_RENT")
 * @returns {string} 거래 유형 텍스트 ("매매", "전세", "월세", "-")
 */
export function getTransactionTypeText(typeCode) {
  return TRANSACTION_TYPE_LABELS[typeCode] || typeCode || "-";
}

/**
 * 한글 거래 유형을 코드로 변환합니다.
 * @param {string} displayText - 한글 거래 유형 ("매매", "전세", "월세")
 * @returns {string} 거래 유형 코드 ("BUY", "JEONSE", "MONTH_RENT")
 */
export function getTransactionTypeCode(displayText) {
  return (
    TRANSACTION_TYPE_CODES[displayText] || displayText || TRANSACTION_TYPES.BUY
  );
}

/**
 * 매물 가격 정보를 기반으로 거래 유형을 판단합니다.
 * PropertyCore 객체 또는 개별 가격 파라미터를 받을 수 있습니다.
 * @param {object|number|null} propertyOrSalePrice - PropertyCore 객체 또는 매매가
 * @param {number|null} [jeonsePrice] - 전세가 (첫 번째 파라미터가 객체가 아닐 때)
 * @param {number|null} [deposit] - 보증금 (첫 번째 파라미터가 객체가 아닐 때)
 * @param {number|null} [monthPrice] - 월세 (첫 번째 파라미터가 객체가 아닐 때)
 * @returns {string} 거래 유형 텍스트 ("매매", "전세", "월세", "-")
 */
export function determineTransactionType(
  propertyOrSalePrice,
  jeonsePrice,
  deposit,
  monthPrice
) {
  let salePrice, jeonse, dep, month;

  if (typeof propertyOrSalePrice === "object" && propertyOrSalePrice !== null) {
    // PropertyCore 객체가 전달된 경우
    const property = propertyOrSalePrice;
    salePrice = property.salePrice;
    jeonse = property.jeonsePrice;
    dep = property.deposit;
    month = property.monthPrice;
  } else {
    // 개별 파라미터가 전달된 경우
    salePrice = propertyOrSalePrice;
    jeonse = jeonsePrice;
    dep = deposit;
    month = monthPrice;
  }

  if (salePrice && salePrice > 0) return TRANSACTION_TYPE_LABELS.BUY;
  if (jeonse && jeonse > 0) return TRANSACTION_TYPE_LABELS.JEONSE;
  if (dep && month) return TRANSACTION_TYPE_LABELS.MONTH_RENT;
  return "-";
}

/**
 * 거래 유형 옵션 배열을 반환합니다.
 * @returns {Array<{value: string, label: string}>} 거래 유형 옵션 배열
 */
export function getTransactionTypeOptions() {
  return Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
}
