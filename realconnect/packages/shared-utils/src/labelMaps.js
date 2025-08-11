// 문의 유형 매핑
export const INQUIRY_TYPE_MAP = {
  BUY: "매매",
  JEONSE: "전세",
  MONTH_RENT: "월세",
};

export const INQUIRY_TYPE_MAP_REVERSE = {
  매매: "BUY",
  전세: "JEONSE",
  월세: "MONTH_RENT",
};

// 상태 매핑
export const STATUS_MAP = {
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

export const STATUS_MAP_REVERSE = {
  "진행 중": "IN_PROGRESS",
  완료: "COMPLETED",
};

// 변환 함수들
export function toDisplayInquiryType(type) {
  return INQUIRY_TYPE_MAP[type] || type || "-";
}

export function toApiInquiryType(display) {
  return INQUIRY_TYPE_MAP_REVERSE[display] || display || "BUY";
}

export function toDisplayStatus(status) {
  return STATUS_MAP[status] || status || "-";
}

export function toApiStatus(display) {
  return STATUS_MAP_REVERSE[display] || display || "IN_PROGRESS";
}

// 모든 옵션 배열 반환
export function getInquiryTypeOptions() {
  return Object.entries(INQUIRY_TYPE_MAP).map(([value, label]) => ({
    value,
    label,
  }));
}

export function getStatusOptions() {
  return Object.entries(STATUS_MAP).map(([value, label]) => ({
    value,
    label,
  }));
}
