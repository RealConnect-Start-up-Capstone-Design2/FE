/**
 * 숫자를 쉼표로 구분된 문자열로 변환
 * @param value - 변환할 숫자
 * @param options - 포맷 옵션
 * @returns 쉼표로 구분된 문자열 또는 undefined
 *
 * @example
 * formatNumber(220000) // "220,000"
 * formatNumber(0) // undefined
 * formatNumber(220000, { allowZero: true }) // "220,000"
 * formatNumber(0, { allowZero: true }) // "0"
 */
export const formatNumber = (
  value: number | null | undefined,
  options?: { allowZero?: boolean; returnEmptyString?: boolean }
): string | undefined => {
  const { allowZero = false, returnEmptyString = false } = options || {};

  if (value === null || value === undefined) {
    return returnEmptyString ? "" : undefined;
  }

  if (value === 0) {
    if (returnEmptyString) return "";
    if (allowZero) return "0";
    return undefined;
  }

  return value.toLocaleString("ko-KR");
};

/**
 * 문자열(쉼표 포함 가능)을 숫자로 변환
 * @param value - 변환할 문자열 또는 숫자
 * @returns 숫자 또는 undefined
 *
 * @example
 * parseNumber("220,000") // 220000
 * parseNumber(220000) // 220000
 * parseNumber("") // undefined
 */
export const parseNumber = (
  value: string | number | null | undefined
): number | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  // 문자열이면 쉼표 제거
  const cleanValue =
    typeof value === "string" ? value.replace(/,/g, "") : value;
  const num =
    typeof cleanValue === "number"
      ? cleanValue
      : parseFloat(String(cleanValue));

  if (isNaN(num)) {
    return undefined;
  }

  return Math.floor(num);
};

/**
 * 전화번호 문자열을 하이픈 포함 포맷으로 변환
 * 기본: 11자리 → "010-1234-5678"
 * 10자리 → "010-123-4567"
 */
export const formatPhoneNumber = (
  value: string | number | null | undefined
): string | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 0) {
    return undefined;
  }

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // 그 외 자리수는 원본 숫자만 반환
  return digits;
};
