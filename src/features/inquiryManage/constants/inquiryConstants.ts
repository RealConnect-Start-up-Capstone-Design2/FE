import type { InquiryStatus, RequestType, PropertyType } from "../types/inquiry";

// 의뢰 유형 옵션 (필터용)
export const REQUEST_TYPE_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "전체", value: "" },
  { label: "매매", value: "SALE" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY" },
  { label: "생각중", value: "THINKING" },
  { label: "보증금", value: "DEPOSIT" },
];

// 의뢰 상태 옵션
export const INQUIRY_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "일반", value: "GENERAL" },
  { label: "공동중개", value: "ANOTHER" },
  { label: "소개", value: "SHARED" },
  { label: "완료", value: "COMPLETED" },
];

// 의뢰 상태별 스타일
const defaultStatusStyle = { bg: "bg-[#EDEDED]", text: "text-[#1B1B1B]" };
export const INQUIRY_STATUS_STYLES: Record<
  InquiryStatus,
  { bg: string; text: string }
> = {
  GENERAL: defaultStatusStyle,
  ANOTHER: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
  SHARED: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
  COMPLETED: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
};

// 물건 종류 라벨
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: "아파트",
  OFFICETEL: "오피스텔",
  COMMERCIAL: "상가",
  VILLA: "빌라",
};

// 의뢰 유형 라벨
export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  SALE: "매매",
  JEONSE: "전세",
  MONTHLY: "월세",
  THINKING: "생각중",
  DEPOSIT: "보증금",
};
