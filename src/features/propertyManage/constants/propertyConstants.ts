import type { DropdownOption } from "@/components/ui/dropdown-menu";
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";
import Caution from "@/assets/Caution.svg";

/**
 * 의뢰 유형 드롭다운 옵션 (API 스펙 기준)
 */
export const requestTypeOptions: DropdownOption[] = [
  { label: "없음", value: "NONE" },
  { label: "입주", value: "SELF" },
  { label: "매도", value: "SALE" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY" },
  { label: "미수신", value: "NOT_RECEIVED" },
  { label: "고민중", value: "THINKING" },
];

/**
 * 의뢰 유형 필터 드롭다운 옵션 (전체 포함)
 */
export const requestTypeFilterOptions: DropdownOption[] = [
  { label: "전체", value: "ALL" },
  ...requestTypeOptions,
];

/**
 * 매물 상태 드롭다운 옵션 (API 스펙 기준)
 */
export const propertyStatusOptions: DropdownOption[] = [
  { label: "없음", value: "NONE" },
  { label: "거래 전", value: "BEFORE" },
  { label: "광고 중", value: "ADVERTISING" },
  { label: "거래 완료", value: "COMPLETED" },
];

/**
 * 매물 상태 필터 드롭다운 옵션 (전체 포함)
 */
export const propertyStatusFilterOptions: DropdownOption[] = [
  { label: "전체", value: "ALL" },
  ...propertyStatusOptions,
];

/**
 * 관리 타입 드롭다운 옵션 (즐겨찾기)
 */
export const manageTypeOptions: DropdownOption[] = [
  { label: "기본", value: "NONE", icon: UnfilledStar },
  { label: "관심", value: "ATTENTION", icon: FilledStar },
  { label: "주의", value: "CAUTION", icon: Caution },
];

/**
 * 관리 타입 필터 드롭다운 옵션 (전체 포함)
 */
export const manageTypeFilterOptions: DropdownOption[] = [
  { label: "전체", value: "ALL" },
  ...manageTypeOptions,
];

/**
 * 매물 필드 기본값
 */
export const propertyFieldDefaults: {
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  contractDate: string;
} = {
  ownerName: "",
  ownerPhone: "",
  salePrice: 0,
  jeonsePrice: 0,
  deposit: 0,
  monthPrice: 0,
  contractDate: "",
};

/**
 * 매물 정보 전체 기본값 (property가 null일 때 사용)
 */
export const propertyInfoDefaults = {
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
