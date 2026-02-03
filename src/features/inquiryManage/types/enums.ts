import type { DropdownOption } from "@/shared/ui/dropdown-menu";
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";
import Caution from "@/assets/Caution.svg";

export const createDropdownOptions = <T extends Record<string, string>>(
  labels: T
): DropdownOption[] => {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
};

export const REQUEST_TYPE = {
  MONTHLY: "MONTHLY",
  JEONSE: "JEONSE",
  SALE: "SALE",
  THINKING: "THINKING",
  DEPOSIT: "DEPOSIT",
} as const;

export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE];

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  MONTHLY: "월세",
  JEONSE: "전세",
  SALE: "매매",
  THINKING: "고민중",
  DEPOSIT: "보증금",
};

// ============================================
// 물건 종류
// ============================================

export const PROPERTY_TYPE = {
  APARTMENT: "APARTMENT",
  OFFICETEL: "OFFICETEL",
  COMMERCIAL: "COMMERCIAL",
  VILLA: "VILLA",
} as const;

export type PropertyType = (typeof PROPERTY_TYPE)[keyof typeof PROPERTY_TYPE];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: "아파트",
  OFFICETEL: "오피스텔",
  COMMERCIAL: "상가",
  VILLA: "빌라",
};

export const INQUIRY_STATUS = {
  GENERAL: "GENERAL",
  ANOTHER: "ANOTHER",
  SHARED: "SHARED",
  COMPLETED: "COMPLETED",
} as const;

export type InquiryStatus =
  (typeof INQUIRY_STATUS)[keyof typeof INQUIRY_STATUS];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  GENERAL: "일반",
  ANOTHER: "타중개사",
  SHARED: "공유",
  COMPLETED: "완료",
};

export const INQUIRY_STATUS_STYLES: Record<
  InquiryStatus,
  { bg: string; text: string }
> = {
  GENERAL: { bg: "bg-[#EDEDED]", text: "text-[#1B1B1B]" },
  ANOTHER: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
  SHARED: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
  COMPLETED: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
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

export const INQUIRER_RELATION = {
  SELF: "SELF",
  PARENTS: "PARENTS",
  CHILDREN: "CHILDREN",
  OTHER: "OTHER",
} as const;

export type InquirerRelation =
  (typeof INQUIRER_RELATION)[keyof typeof INQUIRER_RELATION];

export const INQUIRER_RELATION_LABELS: Record<InquirerRelation, string> = {
  SELF: "본인",
  PARENTS: "부모님",
  CHILDREN: "자녀",
  OTHER: "기타",
};

// ============================================
// 드롭다운 옵션
// ============================================

export const MANAGE_TYPE_OPTIONS: DropdownOption[] = [
  { label: "기본", value: "NONE", icon: UnfilledStar },
  { label: "관심", value: "ATTENTION", icon: FilledStar },
  { label: "주의", value: "CAUTION", icon: Caution },
];

export const REQUEST_TYPE_FILTER_OPTIONS: DropdownOption[] = [
  { label: "전체", value: "" },
  { label: "월세", value: "MONTHLY" },
  { label: "전세", value: "JEONSE" },
  { label: "매매", value: "SALE" },
  { label: "고민중", value: "THINKING" },
  { label: "보증금", value: "DEPOSIT" },
];

export const INQUIRY_STATUS_OPTIONS: DropdownOption[] = [
  { label: "일반", value: "GENERAL" },
  { label: "타중개사", value: "ANOTHER" },
  { label: "공유", value: "SHARED" },
  { label: "완료", value: "COMPLETED" },
];
