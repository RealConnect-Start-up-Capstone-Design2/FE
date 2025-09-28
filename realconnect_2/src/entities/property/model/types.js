/**
 * Property 엔티티 타입 정의
 */

// Property 기본 타입
export const PropertyType = {
  BUY: "BUY",
  JEONSE: "JEONSE",
  MONTH_RENT: "MONTH_RENT",
};

// Property 상태 (실제 API 응답값에 맞춤)
export const PropertyStatus = {
  WAITING: "WAITING", // 대기
  RESERVED: "RESERVED", // 예약
  OCCUPIED: "OCCUPIED", // 임대중
  VACANT: "VACANT", // 공실
};

// 상태 표시용 라벨 매핑
export const PropertyStatusLabels = {
  WAITING: "대기",
  RESERVED: "예약",
  OCCUPIED: "임대중",
  VACANT: "공실",
};

// Property 엔티티 인터페이스 (JSDoc으로 타입 힌트)
/**
 * @typedef {Object} Property
 * @property {number} id - 매물 ID
 * @property {string} apartmentName - 아파트명
 * @property {string} dong - 동
 * @property {string} ho - 호
 * @property {number} area - 면적
 * @property {PropertyType} transactionType - 거래 유형
 * @property {PropertyStatus} status - 매물 상태
 * @property {number} salePrice - 매매가
 * @property {number} jeonsePrice - 전세가
 * @property {number} deposit - 보증금
 * @property {number} monthPrice - 월세
 * @property {string} ownerName - 소유자명
 * @property {string} ownerPhone - 소유자 연락처
 * @property {string} memo - 메모
 * @property {Date|null} startDate - 계약 시작일
 * @property {Date|null} endDate - 계약 종료일
 */
