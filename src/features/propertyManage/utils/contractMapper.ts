/**
 * 계약 정보 필드명 매핑 유틸리티
 * 프론트엔드 필드명 ↔ 백엔드 API 필드명 변환
 */

import type {
  ContractInfo,
  ContractType as ApiContractType,
} from "../stores/contractStore";
import type { ContractType as UIContractType } from "../stores/propertyStore";

/**
 * UI 계약 타입 → API 계약 타입
 */
export const mapUIContractTypeToAPI = (
  uiType: UIContractType
): ApiContractType => {
  if (uiType === "RENTAL") return "LEASE";
  if (uiType === "SALE") return "SALE";
  return "LEASE"; // default
};

/**
 * API 계약 타입 → UI 계약 타입
 */
export const mapAPIContractTypeToUI = (
  apiType: ApiContractType
): UIContractType => {
  if (apiType === "LEASE") return "RENTAL";
  if (apiType === "SALE") return "SALE";
  return "RENTAL"; // default
};

/**
 * 프론트엔드 필드명 → 백엔드 필드명 매핑
 */
export const FIELD_MAPPING = {
  // 기본 정보
  ownerName: "gapName",
  ownerPhone: "gapPhone",
  tenantName: "eulName",
  tenantPhone: "eulPhone",
  startDate: "contractDate",

  // 금액 정보
  deposit: "deposit",
  downPayment: "downPayment",
  downPaymentDate: "downPaymentDueDate",
  interimPayment: "interimPayment",
  interimPaymentDate: "interimPaymentDueDate",
  balance: "balance",
  balanceDate: "balanceDueDate",
  monthPrice: "monthlyRent",
  monthlyPaymentDay: "monthlyRentDueDate",
} as const;

/**
 * UI 필드명을 API 필드명으로 변환
 */
export const mapUIFieldToAPI = (
  uiFieldName: keyof typeof FIELD_MAPPING
): keyof Omit<ContractInfo, "apartmentId" | "contractType"> => {
  return FIELD_MAPPING[uiFieldName] as keyof Omit<
    ContractInfo,
    "apartmentId" | "contractType"
  >;
};

/**
 * API 필드명을 UI 필드명으로 변환
 */
export const mapAPIFieldToUI = (
  apiFieldName: string
): keyof typeof FIELD_MAPPING | null => {
  const entries = Object.entries(FIELD_MAPPING);
  const found = entries.find(([_, value]) => value === apiFieldName);
  return found ? (found[0] as keyof typeof FIELD_MAPPING) : null;
};
