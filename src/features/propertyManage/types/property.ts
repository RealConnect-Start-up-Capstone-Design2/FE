import type {
  PropertyStatus,
  RequestType,
  Direction,
  ManageType,
  OccupancyStatus,
  ContractOccupancyStatus,
} from "./enums";

export type {
  PropertyStatus,
  RequestType,
  Direction,
  ManageType,
  OccupancyStatus,
  ContractOccupancyStatus,
};

/**
 * API 응답의 매물 정보 (실제 API 응답 구조)
 */
export interface PropertyApiResponse {
  contractOccupancyStatus: OccupancyStatus; // 점유 상태
  contractSalePrice: number;
  contractJeonsePrice: number;
  contractDeposit: number;
  contractMonthlyRent: number;
  contractExpireDate: string;
  requestSalePrice: number;
  requestJeonsePrice: number;
  requestMonthlyDeposit: number;
  requestMonthlyRent: number;
  requestRegisteredAt: string;
  dong: string;
  manageType: ManageType;
  requestType: RequestType;
  apartmentId: number;
  ho: string;
  supplyArea: number;
  supplyType: string;
  direction: Direction;
  ownerPhone: string;
  ownerName: string;
}

/**
 * 매물 정보
 */
export interface PropertyInfo {
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  propertyStatus: PropertyStatus;
  requestType: RequestType;
  manageType: ManageType;
  ownerName: string;
  ownerPhone: string;
  contractDate: string;
  memo?: string;
  occupancyStatus?: OccupancyStatus;
  downPayment?: number;
  contractSalePrice?: number;
  currentTenant?: string;
  contractJeonsePrice?: number;
  contractDeposit?: number;
  contractMonthlyRent?: number;
  expireDate?: string;
  requestRegistrationDate?: string;
}

export type PropertyDetailDirection =
  | "NONE"
  | "NORTH"
  | "SOUTH"
  | "EAST"
  | "WEST"
  | "NORTHEAST"
  | "SOUTHEAST"
  | "SOUTHWEST"
  | "NORTHWEST";

export type PropertyDetailDirectionBase = "LIVING_ROOM" | "BEDROOM";
export type PropertyDetailFloorLevel = "LOW" | "MIDDLE" | "HIGH";
export type PropertyDetailStructureType = "SINGLE" | "DUPLEX";
export type PropertyDetailEntranceType =
  | "NONE"
  | "STAIR"
  | "CORRIDOR"
  | "MIXED";
export type PropertyDetailMainUsage =
  | "NONE"
  | "RESIDENTIAL"
  | "ACCOMMODATION"
  | "OFFICE";

export interface PropertyDetailInfo {
  direction: PropertyDetailDirection;
  directionBase: PropertyDetailDirectionBase;
  floorLevel: PropertyDetailFloorLevel;
  roomCount: number;
  bathroomCount: number;
  totalParking: number;
  parkingPerHousehold: number;
  structureType: PropertyDetailStructureType;
  entranceType: PropertyDetailEntranceType;
  mainUsage: PropertyDetailMainUsage;
}

/**
 * 아파트 정보 + 매물 정보
 * 목록 조회 시 반환되는 주요 데이터 타입
 */
export interface ApartmentWithProperty {
  apartmentId: number;
  apartmentName: string;
  dong: string;
  ho: string;
  area: number;
  direction: Direction;
  img: string;
  type: string;
  property: PropertyInfo | null;
  isFavorite?: boolean;
}

/**
 */
export interface PropertiesApiResponse {
  content: PropertyApiResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}

/**
 * 매물 목록 조회 응답
 */
export interface PropertiesResponse {
  content: ApartmentWithProperty[];
  nextCursor: number | null;
  hasNext: boolean;
}

/**
 * 매물 목록 조회 파라미터
 */
export interface PropertiesQueryParams {
  apartmentComplexId: number;
  cursorId?: number;
  size?: number;
  dong?: string;
  ho?: string;
  area?: number;
  propertyStatus?: PropertyStatus;
  requestType?: RequestType;
  manageType?: ManageType;
}

/**
 * 매물 필드 기본값
 */
export const propertyFieldDefaults = {
  ownerName: "",
  ownerPhone: "",
  salePrice: 0,
  jeonsePrice: 0,
  deposit: 0,
  monthPrice: 0,
  contractDate: "",
} as const;

/**
 * 매물 정보 전체 기본값 (property가 null일 때 사용)
 */
export const propertyInfoDefaults: PropertyInfo = {
  salePrice: 0,
  jeonsePrice: 0,
  deposit: 0,
  monthPrice: 0,
  propertyStatus: "NONE" as const,
  requestType: "NONE" as const,
  manageType: "NONE" as const,
  ownerName: "",
  ownerPhone: "",
  contractDate: "",
};

/**
 * 빈 값을 허용하는 필드 목록
 */
export const emptyAllowedFields = [
  "salePrice",
  "jeonsePrice",
  "deposit",
  "monthPrice",
  "ownerName",
  "ownerPhone",
  "contractDate",
];

/**
 * 가상 스크롤 행 높이 (픽셀)
 */
export const ESTIMATED_ROW_HEIGHT = 72;

/**
 * 매물 필드 키 타입
 */
export type PropertyFieldKey = keyof typeof propertyFieldDefaults;
