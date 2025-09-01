/**
 * 계약 관련 비즈니스 로직
 * 웹/모바일에서 공통으로 사용되는 순수 함수들
 */

// 거래 유형 관련 로직은 transaction.js로 통합됨
import { getTransactionTypeText } from "./transaction.js";

/**
 * @deprecated 이 함수는 transaction.js의 getTransactionTypeText를 사용하세요
 */
export function getContractTypeText(contractType) {
  return getTransactionTypeText(contractType);
}

/**
 * 계약 상태 코드를 한글 텍스트로 변환합니다.
 * @param {string|null} statusCode - 계약 상태 코드 ("ACTIVE", "COMPLETED", "TERMINATED", "EXPIRED")
 * @returns {string} 계약 상태 텍스트 ("계약중", "계약완료", "계약파기", "계약만료")
 */
export function getContractStatusText(statusCode) {
  switch (statusCode) {
    case "ACTIVE":
      return "계약중";
    case "COMPLETED":
      return "계약완료";
    case "TERMINATED":
      return "계약파기";
    case "EXPIRED":
      return "계약만료";
    default:
      return statusCode || "-";
  }
}

/**
 * 계약 기간이 만료 임박인지 확인합니다.
 * @param {string|Date} dueDate - 계약 만료일
 * @param {number} [warningDays=30] - 경고 일수 (기본 30일)
 * @returns {boolean} 만료 임박 여부
 */
export function isContractExpiringSoon(dueDate, warningDays = 30) {
  if (!dueDate) return false;

  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= warningDays;
}
