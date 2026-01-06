/**
 * 문의 관리 관련 타입 정의
 */

// 거래 유형
export type TradeType = "ALL" | "SALE" | "JEONSE" | "MONTHLY";

// 의뢰 유형
export type InquiryRequestType =
  | "NONE"
  | "SALE"
  | "JEONSE"
  | "MONTHLY"
  | "NOT_RECEIVED"
  | "THINKING";

// 의뢰 상태
export type InquiryStatus =
  | "GENERAL"
  | "INTRODUCTION"
  | "CO_BROKERAGE"
  | "COMPLETED";

// 물건 종류
export type PropertyType = "APARTMENT" | "OFFICETEL" | "COMMERCIAL" | "VILLA";

// 문의 데이터 타입
export interface Inquiry {
  inquiryId: number;
  // 기본 정보
  region: string; // 지역
  complex: string; // 단지
  propertyType: PropertyType; // 물건 종류
  registeredDate: string; // 등록일
  title: string; // 문의 제목
  // 의뢰 정보
  requestType: InquiryRequestType; // 의뢰 유형
  status: InquiryStatus; // 의뢰 상태
  // 면적
  area1?: number; // 면적1
  area2?: number; // 면적2
  // 가격 정보
  deposit1?: number; // 보증금1
  deposit2?: number; // 보증금2
  purchasePrice1?: number; // 매수가1
  purchasePrice2?: number; // 매수가2
  monthlyRent1?: number; // 월세1
  monthlyRent2?: number; // 월세2
  inquirer: string; // 문의자
  inquirerPhone: string; // 연락처
  // 즐겨찾기
  isFavorite: boolean;
  // 메모
  memo?: string;
}

// 문의 목록 응답 타입
export interface InquiriesResponse {
  content: Inquiry[];
  nextCursor: number | null;
  hasNext: boolean;
}

// 테이블 필터 상태
export interface InquiryFilterState {
  tradeType?: TradeType;
  requestType?: InquiryRequestType;
  status?: InquiryStatus;
  searchKeyword?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
}
