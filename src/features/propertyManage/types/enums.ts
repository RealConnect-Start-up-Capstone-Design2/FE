import type { DropdownOption } from "@/shared/ui/dropdown-menu";
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";
import Caution from "@/assets/Caution.svg";

export const OCCUPANCY_STATUS = {
  NONE: "NONE",
  SELF: "SELF",
  JEONSE: "JEONSE",
  MONTHLY_RENT: "MONTHLY_RENT",
  VACANT: "VACANT",
} as const;

export type OccupancyStatus =
  (typeof OCCUPANCY_STATUS)[keyof typeof OCCUPANCY_STATUS];

export const OCCUPANCY_STATUS_LABELS: Record<OccupancyStatus, string> = {
  NONE: "없음",
  SELF: "자가",
  JEONSE: "전세",
  MONTHLY_RENT: "월세",
  VACANT: "공실",
};

/** 계약 정보 - 계약 구분 (본인/타사/공동중개/소개) */
export const CONTRACT_RELATION_TYPE = {
  MY_CONTRACT: "MY_CONTRACT",
  OTHER_CONTRACT: "OTHER_CONTRACT",
  CO_BROKERAGE: "CO_BROKERAGE",
  INTRODUCTION: "INTRODUCTION",
} as const;

export type ContractRelationType =
  (typeof CONTRACT_RELATION_TYPE)[keyof typeof CONTRACT_RELATION_TYPE];

export const CONTRACT_RELATION_TYPE_LABELS: Record<
  ContractRelationType,
  string
> = {
  MY_CONTRACT: "본인 계약",
  OTHER_CONTRACT: "타사 계약",
  CO_BROKERAGE: "공동 중개",
  INTRODUCTION: "소개",
};

export const PROPERTY_STATUS = {
  NONE: "NONE",
  BEFORE: "BEFORE",
  ADVERTISING: "ADVERTISING",
  COMPLETED: "COMPLETED",
  PROGRESS: "PROGRESS",
} as const;

export type PropertyStatus =
  (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS];

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  NONE: "미등록",
  BEFORE: "진행 전",
  ADVERTISING: "광고 중",
  COMPLETED: "완료",
  PROGRESS: "진행중",
};

export const REQUEST_TYPE = {
  NONE: "NONE",
  SALE: "SALE",
  JEONSE: "JEONSE",
  MONTHLY: "MONTHLY",
  SALE_JEONSE: "SALE_JEONSE",
  SALE_MONTHLY: "SALE_MONTHLY",
  JEONSE_MONTHLY: "JEONSE_MONTHLY",
  SALE_JEONSE_MONTHLY: "SALE_JEONSE_MONTHLY",
  HOLD: "HOLD",
} as const;

export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE];

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  NONE: "없음",
  SALE: "매",
  JEONSE: "전",
  MONTHLY: "월",
  SALE_JEONSE: "매/전",
  SALE_MONTHLY: "매/월",
  JEONSE_MONTHLY: "전/월",
  SALE_JEONSE_MONTHLY: "매/전/월",
  HOLD: "보류",
};

export const REQUEST_TYPE_DROPDOWN_LABELS: Record<RequestType, string> = {
  NONE: "없음",
  SALE: "매도",
  JEONSE: "전세",
  MONTHLY: "월세",
  SALE_JEONSE: "매도/전세",
  SALE_MONTHLY: "매도/월세",
  JEONSE_MONTHLY: "전세/월세",
  SALE_JEONSE_MONTHLY: "매도/전세/월세",
  HOLD: "보류",
};

export const DIRECTION = {
  NONE: "NONE",
  EAST: "EAST",
  WEST: "WEST",
  SOUTH: "SOUTH",
  NORTH: "NORTH",
  SOUTHEAST: "SOUTHEAST",
  SOUTHWEST: "SOUTHWEST",
  NORTHEAST: "NORTHEAST",
  NORTHWEST: "NORTHWEST",
} as const;

export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];

export const DIRECTION_LABELS: Record<Direction, string> = {
  NONE: "없음",
  EAST: "동",
  WEST: "서",
  SOUTH: "남",
  NORTH: "북",
  SOUTHEAST: "남동",
  SOUTHWEST: "남서",
  NORTHEAST: "북동",
  NORTHWEST: "북서",
};

/** 매물 상세 - 방향 기준 (거실/침실) */
export const DIRECTION_BASE = {
  LIVING_ROOM: "LIVING_ROOM",
  BEDROOM: "BEDROOM",
} as const;

export type DirectionBase =
  (typeof DIRECTION_BASE)[keyof typeof DIRECTION_BASE];

export const DIRECTION_BASE_LABELS: Record<DirectionBase, string> = {
  LIVING_ROOM: "거실",
  BEDROOM: "침실",
};

/** 매물 상세 - 층 위치 */
export const FLOOR_LEVEL = {
  LOW: "LOW",
  MIDDLE: "MIDDLE",
  HIGH: "HIGH",
} as const;

export type FloorLevel = (typeof FLOOR_LEVEL)[keyof typeof FLOOR_LEVEL];

export const FLOOR_LEVEL_LABELS: Record<FloorLevel, string> = {
  LOW: "저층",
  MIDDLE: "중층",
  HIGH: "고층",
};

/** 매물 상세 - 구조 타입 */
export const STRUCTURE_TYPE = {
  SINGLE: "SINGLE",
  DUPLEX: "DUPLEX",
} as const;

export type StructureType =
  (typeof STRUCTURE_TYPE)[keyof typeof STRUCTURE_TYPE];

export const STRUCTURE_TYPE_LABELS: Record<StructureType, string> = {
  SINGLE: "단층",
  DUPLEX: "복층",
};

/** 매물 상세 - 입구 타입 */
export const ENTRANCE_TYPE = {
  NONE: "NONE",
  STAIR: "STAIR",
  CORRIDOR: "CORRIDOR",
  MIXED: "MIXED",
} as const;

export type EntranceType = (typeof ENTRANCE_TYPE)[keyof typeof ENTRANCE_TYPE];

export const ENTRANCE_TYPE_LABELS: Record<EntranceType, string> = {
  NONE: "없음",
  STAIR: "계단식",
  CORRIDOR: "복도식",
  MIXED: "혼합",
};

/** 매물 상세 - 주용도 */
export const MAIN_USAGE = {
  NONE: "NONE",
  RESIDENTIAL: "RESIDENTIAL",
  ACCOMMODATION: "ACCOMMODATION",
  OFFICE: "OFFICE",
} as const;

export type MainUsage = (typeof MAIN_USAGE)[keyof typeof MAIN_USAGE];

export const MAIN_USAGE_LABELS: Record<MainUsage, string> = {
  NONE: "없음",
  RESIDENTIAL: "주거",
  ACCOMMODATION: "숙박",
  OFFICE: "사무",
};

export const MANAGE_TYPE = {
  NONE: "NONE",
  ATTENTION: "ATTENTION",
  CAUTION: "CAUTION",
} as const;

export type ManageType = (typeof MANAGE_TYPE)[keyof typeof MANAGE_TYPE];

export const MANAGE_TYPE_LABELS: Record<ManageType, string> = {
  NONE: "기본",
  ATTENTION: "관심",
  CAUTION: "주의",
};

// ============================================
// 드롭다운 옵션
// ============================================

export const occupancyStatusOptions: DropdownOption[] = [
  { label: "없음", value: "NONE" },
  { label: "자가", value: "SELF" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY_RENT" },
  { label: "공실", value: "VACANT" },
];

export const propertyStatusOptions: DropdownOption[] = [
  { label: "미등록", value: "NONE" },
  { label: "완료", value: "COMPLETED" },
  { label: "진행중", value: "PROGRESS" },
];

export const requestTypeOptions: DropdownOption[] = [
  { label: REQUEST_TYPE_DROPDOWN_LABELS.NONE, value: "NONE" },
  { label: REQUEST_TYPE_DROPDOWN_LABELS.SALE, value: "SALE" },
  { label: REQUEST_TYPE_DROPDOWN_LABELS.JEONSE, value: "JEONSE" },
  { label: REQUEST_TYPE_DROPDOWN_LABELS.MONTHLY, value: "MONTHLY" },
  { label: REQUEST_TYPE_DROPDOWN_LABELS.SALE_JEONSE, value: "SALE_JEONSE" },
  { label: REQUEST_TYPE_DROPDOWN_LABELS.SALE_MONTHLY, value: "SALE_MONTHLY" },
  { label: REQUEST_TYPE_DROPDOWN_LABELS.JEONSE_MONTHLY, value: "JEONSE_MONTHLY" },
  {
    label: REQUEST_TYPE_DROPDOWN_LABELS.SALE_JEONSE_MONTHLY,
    value: "SALE_JEONSE_MONTHLY",
  },
];

export const directionOptions: DropdownOption[] = [
  { label: "없음", value: "NONE" },
  { label: "동", value: "EAST" },
  { label: "서", value: "WEST" },
  { label: "남", value: "SOUTH" },
  { label: "북", value: "NORTH" },
  { label: "남동", value: "SOUTHEAST" },
  { label: "남서", value: "SOUTHWEST" },
  { label: "북동", value: "NORTHEAST" },
  { label: "북서", value: "NORTHWEST" },
];

export const manageTypeOptions: DropdownOption[] = [
  { label: "기본", value: "NONE", icon: UnfilledStar },
  { label: "관심", value: "ATTENTION", icon: FilledStar },
  { label: "주의", value: "CAUTION", icon: Caution },
];

export const manageTypeFilterOptions: DropdownOption[] = [
  { label: "전체", value: "ALL" },
  { label: "기본", value: "NONE", icon: UnfilledStar },
  { label: "관심", value: "ATTENTION", icon: FilledStar },
  { label: "주의", value: "CAUTION", icon: Caution },
];

export const propertyStatusFilterOptions: DropdownOption[] = [
  { label: "전체", value: "ALL" },
  { label: "미등록", value: "NONE" },
  { label: "완료", value: "COMPLETED" },
  { label: "진행중", value: "PROGRESS" },
];

export const requestTypeFilterOptions: DropdownOption[] = [
  { label: "전체", value: "ALL" },
  { label: "없음", value: "NONE" },
  { label: "월세", value: "MONTHLY" },
  { label: "전세", value: "JEONSE" },
  { label: "매매", value: "SALE" },
];

// ============================================
// 하위 호환성 (deprecated)
// ============================================

/** @deprecated OccupancyStatus를 사용하세요 */
export type ContractOccupancyStatus = OccupancyStatus;
