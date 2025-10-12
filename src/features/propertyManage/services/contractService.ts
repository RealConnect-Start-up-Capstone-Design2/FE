import type { ContractInfo, ContractInfoInput } from "../stores/contractStore";

/**
 * 계약 정보 조회
 * GET /api/properties/contractInfo
 */
export const getContractAPI = async (
  apartmentId: number
): Promise<ContractInfo | null> => {
  // TODO: API 구현
  throw new Error("Not implemented yet");
};

/**
 * 계약 정보 생성
 * Post /api/properties/contractInfo
 */
export const createContractAPI = async (
  apartmentId: number,
  contract: Partial<ContractInfoInput>
): Promise<ContractInfo> => {
  // TODO: API 구현
  throw new Error("Not implemented yet");
};

/**
 * 계약 정보 수정
 * Put /api/properties/contractInfo
 */
export const saveContractAPI = async (
  apartmentId: number,
  contract: Partial<ContractInfoInput>
): Promise<ContractInfo> => {
  // TODO: API 구현
  throw new Error("Not implemented yet");
};
