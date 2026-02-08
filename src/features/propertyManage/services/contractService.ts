import apiClient from "@/shared/api/client";
import type {
  ContractInfo,
  ContractInfoInput,
  ContractInfoByApartmentResponse,
} from "../types";

/**
 * 계약 정보 생성
 * POST /api/properties/contractInfo
 */
export const createContractAPI = async (
  apartmentId: number,
  contract: Partial<ContractInfoInput>,
): Promise<ContractInfo> => {
  const response = await apiClient.post<ContractInfo>(
    "/api/properties/contractInfo",
    {
      apartmentId,
      ...contract,
    },
  );
  return response.data;
};

/**
 * 계약 정보 수정
 * PUT /api/properties/contractInfo
 */
export const updateContractAPI = async (
  apartmentId: number,
  contract: Partial<ContractInfoInput>,
): Promise<ContractInfo> => {
  const response = await apiClient.put<ContractInfo>(
    "/api/properties/contractInfo",
    {
      apartmentId,
      ...contract,
    },
  );
  return response.data;
};

/**
 * 계약 정보 조회
 * GET /api/properties/contractInfo/:apartmentId
 */
export const fetchContractAPI = async (
  apartmentId: number,
): Promise<ContractInfoByApartmentResponse> => {
  const response = await apiClient.get<ContractInfoByApartmentResponse>(
    `/api/properties/contractInfo/${apartmentId}`,
  );
  return response.data;
};

/**
 * 계약 정보 생성/수정 (apartmentId 경로)
 * PUT /api/properties/contractInfo/:apartmentId
 */
export const updateContractInfo = async (
  apartmentId: number,
  data: ContractInfoByApartmentResponse,
): Promise<ContractInfoByApartmentResponse> => {
  const response = await apiClient.put<ContractInfoByApartmentResponse>(
    `/api/properties/contractInfo/${apartmentId}`,
    data,
  );
  return response.data;
};
