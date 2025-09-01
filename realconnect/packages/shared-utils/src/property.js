/**
 * 매물 관련 비즈니스 로직
 * 웹/모바일에서 공통으로 사용되는 순수 함수들
 */

/**
 * 매물 상태 코드를 한글 텍스트로 변환합니다.
 * @param {string|null|undefined} statusCode - 상태 코드
 * @returns {string} 상태 텍스트
 */
export function getPropertyStatusText(statusCode) {
  if (!statusCode) return "미등록";
  switch (statusCode) {
    case "CONTRACTED":
      return "계약 완료";
    case "RESERVED":
      return "계약 중";
    case "WAITING":
      return "계약 전";
    default:
      return statusCode;
  }
}
