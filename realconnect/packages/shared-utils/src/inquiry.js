/**
 * 문의 상태 관련 로직
 * 문의 처리 상태를 통합 관리
 */

// 문의 상태 상수 정의
export const INQUIRY_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

// 문의 상태 한글 매핑
export const INQUIRY_STATUS_LABELS = {
  [INQUIRY_STATUS.IN_PROGRESS]: "진행 중",
  [INQUIRY_STATUS.COMPLETED]: "완료",
};

// 역방향 매핑 (한글 → 코드)
export const INQUIRY_STATUS_CODES = {
  "진행 중": INQUIRY_STATUS.IN_PROGRESS,
  완료: INQUIRY_STATUS.COMPLETED,
};

/**
 * 문의 상태 코드를 한글 텍스트로 변환합니다.
 * @param {string|null} statusCode - 문의 상태 코드 ("IN_PROGRESS", "COMPLETED")
 * @returns {string} 문의 상태 텍스트 ("진행 중", "완료", "-")
 */
export function getInquiryStatusText(statusCode) {
  return INQUIRY_STATUS_LABELS[statusCode] || statusCode || "-";
}

/**
 * 한글 문의 상태를 코드로 변환합니다.
 * @param {string} displayText - 한글 문의 상태 ("진행 중", "완료")
 * @returns {string} 문의 상태 코드 ("IN_PROGRESS", "COMPLETED")
 */
export function getInquiryStatusCode(displayText) {
  return (
    INQUIRY_STATUS_CODES[displayText] ||
    displayText ||
    INQUIRY_STATUS.IN_PROGRESS
  );
}

/**
 * 문의 상태 옵션 배열을 반환합니다.
 * @returns {Array<{value: string, label: string}>} 문의 상태 옵션 배열
 */
export function getInquiryStatusOptions() {
  return Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
}
