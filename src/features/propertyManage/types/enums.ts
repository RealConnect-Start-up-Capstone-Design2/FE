import type { DropdownOption } from "@/shared/ui/dropdown-menu";
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";
import Caution from "@/assets/Caution.svg";

export const OCCUPANCY_STATUS = {
  NONE: "NONE",
  SELF: "SELF",
  JEONSE: "JEONSE",
  MONTHLY_RENT: "MONTHLY_RENT",
} as const;

export type OccupancyStatus =
  (typeof OCCUPANCY_STATUS)[keyof typeof OCCUPANCY_STATUS];

export const OCCUPANCY_STATUS_LABELS: Record<OccupancyStatus, string> = {
  NONE: "없음",
  SELF: "자가",
  JEONSE: "전세",
  MONTHLY_RENT: "월세",
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
  MONTHLY: "MONTHLY",
  JEONSE: "JEONSE",
  SALE: "SALE",
  SALE_JEONSE: "SALE_JEONSE",
  SALE_MONTHLY: "SALE_MONTHLY",
  JEONSE_MONTHLY: "JEONSE_MONTHLY",
  SALE_JEONSE_MONTHLY: "SALE_JEONSE_MONTHLY",
  HOLD: "HOLD",
} as const;

export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE];

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  NONE: "없음",
  MONTHLY: "월세",
  JEONSE: "전세",
  SALE: "매도",
  SALE_JEONSE: "매/전",
  SALE_MONTHLY: "매/월",
  JEONSE_MONTHLY: "전/월",
  SALE_JEONSE_MONTHLY: "매/전/월",
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
];

export const propertyStatusOptions: DropdownOption[] = [
  { label: "미등록", value: "NONE" },
  { label: "완료", value: "COMPLETED" },
  { label: "진행중", value: "PROGRESS" },
];

export const requestTypeOptions: DropdownOption[] = [
  { label: "없음", value: "NONE" },
  { label: "월세", value: "MONTHLY" },
  { label: "전세", value: "JEONSE" },
  { label: "매매", value: "SALE" },
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
