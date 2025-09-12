/**
 * @deprecated 이 파일의 기능들이 별도 모듈로 분리되었습니다.
 * - 거래 유형 관련: transaction.js 사용
 * - 문의 상태 관련: inquiry.js 사용
 */

// 새로운 모듈에서 import
import {
  getTransactionTypeText,
  getTransactionTypeCode,
  getTransactionTypeOptions,
} from "./transaction.js";
import {
  getInquiryStatusText,
  getInquiryStatusCode,
  getInquiryStatusOptions,
} from "./inquiry.js";

// 기존 상수들 (호환성을 위해 유지, deprecated)
/** @deprecated transaction.js의 TRANSACTION_TYPE_LABELS 사용 */
export const INQUIRY_TYPE_MAP = {
  BUY: "매매",
  JEONSE: "전세",
  MONTH_RENT: "월세",
};

/** @deprecated transaction.js의 TRANSACTION_TYPE_CODES 사용 */
export const INQUIRY_TYPE_MAP_REVERSE = {
  매매: "BUY",
  전세: "JEONSE",
  월세: "MONTH_RENT",
};

/** @deprecated inquiry.js의 INQUIRY_STATUS_LABELS 사용 */
export const STATUS_MAP = {
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

/** @deprecated inquiry.js의 INQUIRY_STATUS_CODES 사용 */
export const STATUS_MAP_REVERSE = {
  "진행 중": "IN_PROGRESS",
  완료: "COMPLETED",
};

// 변환 함수들 (새로운 모듈 함수들로 래핑, deprecated)
/** @deprecated transaction.js의 getTransactionTypeText 사용 */
export function toDisplayInquiryType(type) {
  return getTransactionTypeText(type);
}

/** @deprecated transaction.js의 getTransactionTypeCode 사용 */
export function toApiInquiryType(display) {
  return getTransactionTypeCode(display);
}

/** @deprecated inquiry.js의 getInquiryStatusText 사용 */
export function toDisplayStatus(status) {
  return getInquiryStatusText(status);
}

/** @deprecated inquiry.js의 getInquiryStatusCode 사용 */
export function toApiStatus(display) {
  return getInquiryStatusCode(display);
}

// 옵션 배열 반환 함수들 (새로운 모듈 함수들로 래핑, deprecated)
/** @deprecated transaction.js의 getTransactionTypeOptions 사용 */
export function getInquiryTypeOptions() {
  return getTransactionTypeOptions();
}

/** @deprecated inquiry.js의 getInquiryStatusOptions 사용 */
export function getStatusOptions() {
  return getInquiryStatusOptions();
}
