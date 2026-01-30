// ============================================
// 매물 데이터 타입 정의 (API 스펙 기준)
// ============================================

/**
 * 매물 상태
 */
export type PropertyStatus = "NONE" | "BEFORE" | "ADVERTISING" | "COMPLETED";

/**
 * 의뢰 유형
 */
export type RequestType =
  | "NONE"
  | "SALE"
  | "JEONSE"
  | "MONTHLY"
  | "SALE_JEONSE"
  | "SALE_MONTHLY"
  | "JEONSE_MONTHLY"
  | "SALE_JEONSE_MONTHLY";

/**
 * 방향 (API enum)
 */
export type Direction =
  | "NONE"
  | "NORTH"
  | "SOUTH"
  | "EAST"
  | "WEST"
  | "NORTHEAST"
  | "SOUTHEAST"
  | "SOUTHWEST"
  | "NORTHWEST";

/**
 * 관리 유형 (즐겨찾기)
 */
export type ManageType = "NONE" | "ATTENTION" | "CAUTION";

/**
 * 계약 점유 상태
 */
export type ContractOccupancyStatus =
  | "NONE"
  | "SELF"
  | "JEONSE"
  | "MONTHLY_RENT"
  | "VACANT";

/**
 * API 응답의 매물 정보 (실제 API 응답 구조)
 */
export interface PropertyApiResponse {
  contractOccupancyStatus: ContractOccupancyStatus; // 점유 상태
  contractSalePrice: number; // 계약 매도가
  contractJeonsePrice: number; // 계약 전세가
  contractDeposit: number; // 계약 보증금
  contractMonthlyRent: number; // 계약 월세
  contractExpireDate: string; // 만기일
  requestSalePrice: number; // 의뢰 매도가
  requestJeonsePrice: number; // 의뢰 전세가
  requestMonthlyDeposit: number; // 의뢰 보증금
  requestMonthlyRent: number; // 의뢰 월세
  requestRegisteredAt: string; // 의뢰 등록일
  dong: string; // 동
  manageType: ManageType; // 관리 타입 (즐겨찾기)
  requestType: RequestType; // 의뢰 유형
  apartmentId: number; // 아파트 ID
  ho: string; // 호수
  supplyArea: number; // 면적 (㎡)
  supplyType: string; // 타입
  direction: Direction; // 방향
  ownerPhone: string; // 연락처
  ownerName: string; // 소유자
}

/**
 * 매물 정보 (아파트에 등록된 내 매물)
 * property가 null이면 해당 아파트에 매물이 없는 것
 */
export interface PropertyInfo {
  salePrice: number; // 매매가 (의뢰 매도가)
  jeonsePrice: number; // 전세가 (의뢰 전세가)
  deposit: number; // 보증금 (의뢰 보증금)
  monthPrice: number; // 월세 (의뢰 월세)
  propertyStatus: PropertyStatus; // 매물 상태
  requestType: RequestType; // 의뢰 유형
  manageType: ManageType; // 관리 타입 (즐겨찾기)
  ownerName: string; // 소유자 이름
  ownerPhone: string; // 소유자 연락처
  contractDate: string; // 계약일
  memo?: string; // 메모 (optional)
  occupancyStatus?: ContractOccupancyStatus; // 점유 상태 (contractOccupancyStatus)
  downPayment?: number; // 기매입금 (레거시)
  contractSalePrice?: number; // 기매입금 (계약 매도가)
  currentTenant?: string; // 현임차 (레거시)
  contractJeonsePrice?: number; // 계약 전세가 (현임차 JEONSE 시)
  contractDeposit?: number; // 계약 보증금 (현임차 MONTHLY_RENT 시)
  contractMonthlyRent?: number; // 계약 월세 (현임차 MONTHLY_RENT 시)
  expireDate?: string; // 만기일
  requestRegistrationDate?: string; // 의뢰 등록일
}

/**
 * 아파트 정보 + 매물 정보
 * 목록 조회 시 반환되는 주요 데이터 타입
 */
export interface ApartmentWithProperty {
  apartmentId: number; // 아파트 ID (PK)
  apartmentName: string; // 아파트 단지명
  dong: string; // 동
  ho: string; // 호수
  area: number; // 면적 (㎡)
  direction: Direction; // 방향
  img: string; // 이미지 URL
  type: string; // 타입 (아파트, 빌라 등)
  property: PropertyInfo | null; // 매물 정보 (없으면 null)
  isFavorite?: boolean; // 즐겨찾기 여부 (UI 전용, 로컬 상태)
}

/**
 * API 응답의 매물 목록 조회 응답 (커서 기반 페이지네이션)
 */
export interface PropertiesApiResponse {
  content: PropertyApiResponse[]; // 아파트 목록 (API 응답 구조)
  nextCursor: number | null; // 다음 커서 (없으면 null)
  hasNext: boolean; // 다음 페이지 존재 여부
}

/**
 * 매물 목록 조회 응답 (커서 기반 페이지네이션)
 */
export interface PropertiesResponse {
  content: ApartmentWithProperty[]; // 아파트 목록
  nextCursor: number | null; // 다음 커서 (없으면 null)
  hasNext: boolean; // 다음 페이지 존재 여부
}

/**
 * 매물 목록 조회 파라미터
 */
export interface PropertiesQueryParams {
  apartmentComplexId: number; // 단지 ID (필수)
  cursorId?: number; // 커서 ID (첫 페이지는 생략)
  size?: number; // 페이지 크기 (기본 30, 최대 100)
  dong?: string; // 동 필터 ('dong%' 검색)
  ho?: string; // 호수 필터 ('ho%' 검색)
  area?: number; // 면적 필터
  propertyStatus?: PropertyStatus; // 매물 상태 필터
  requestType?: RequestType; // 의뢰 유형 필터
  manageType?: ManageType; // 관리 타입 필터 (즐겨찾기)
}
