/**
 * 억 단위 입력값을 원 단위 정수로 변환
 * 입력: 17 (억) → 출력: 1700000000 (원)
 */
export const parsePrice = (
  value: string | number | null | undefined
): number | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(num)) {
    return undefined;
  }

  // 억 단위를 원 단위로 변환 (1억 = 100,000,000)
  return Math.floor(num * 100000000);
};

/**
 * 원 단위 정수를 표시용 문자열로 변환
 * 1억 이상: "17.94억" (소수점 2자리)
 * 1억 미만: "8,000만" (만원 단위, 쉼표)
 */
export const formatPrice = (
  value: number | null | undefined
): string | undefined => {
  if (!value) {
    return undefined;
  }

  // 1억 이상이면 억 단위로 표시
  if (value >= 100000000) {
    const eokValue = Math.floor((value / 100000000) * 100) / 100;
    return `${eokValue.toLocaleString("ko-KR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}억`;
  }

  // 1억 미만이면 만원 단위로 표시
  const manValue = Math.floor(value / 10000);
  return `${manValue.toLocaleString("ko-KR")}만`;
};

/**
 * Input 필드에 표시할 값 (원 단위를 억 단위로 변환)
 * 입력: 1794000000 (원) → 출력: "17.94"
 * 0이나 undefined면 빈 문자열 (placeholder 표시용)
 */
export const formatPriceInput = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) {
    return "";
  }
  // 억 단위로 변환하고 소수점 2자리까지만 (반올림 없이 버림)
  const eokValue = Math.floor((value / 100000000) * 100) / 100;
  return eokValue.toString();
};

/**
 * 만원 단위 입력값을 원 단위 정수로 변환
 * 입력: 500 (만원) → 출력: 5000000 (원)
 */
export const parseMonthPrice = (
  value: string | number | null | undefined
): number | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(num)) {
    return undefined;
  }

  // 만원 단위를 원 단위로 변환 (1만 = 10,000)
  return Math.floor(num * 10000);
};

/**
 * 원 단위 정수를 만원 단위로 표시 + "만"
 * 입력: 5000000 (원) → 출력: "500만"
 */
export const formatMonthPrice = (
  value: number | null | undefined
): string | undefined => {
  if (!value) {
    return undefined;
  }

  // 만원 단위로 변환
  const manValue = Math.floor(value / 10000);

  return `${manValue.toLocaleString("ko-KR")}만`;
};

/**
 * Input 필드에 표시할 값 (원 단위를 만원 단위로 변환)
 * 입력: 5000000 (원) → 출력: "500"
 * 0이나 undefined면 빈 문자열 (placeholder 표시용)
 */
export const formatMonthPriceInput = (
  value: number | null | undefined
): string => {
  if (value === null || value === undefined || value === 0) {
    return "";
  }
  // 만원 단위로 변환
  const manValue = Math.floor(value / 10000);
  return manValue.toString();
};

/**
 * 원 단위 숫자를 쉼표로 구분된 문자열로 변환 (계약 관리용)
 * 입력: 17000000 → 출력: "17,000,000"
 */
export const formatNumberWithComma = (
  value: number | string | null | undefined
): string => {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  const numValue =
    typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(numValue)) {
    return "";
  }
  return numValue.toLocaleString("ko-KR");
};

/**
 * 쉼표로 구분된 문자열을 숫자로 변환 (계약 관리용)
 * 입력: "17,000,000" → 출력: 17000000
 */
export const parseNumberWithComma = (value: string): number | undefined => {
  if (!value || value === "") {
    return undefined;
  }
  // 쉼표 제거
  const numStr = value.replace(/,/g, "");
  const num = parseFloat(numStr);
  if (isNaN(num)) {
    return undefined;
  }
  return num;
};
