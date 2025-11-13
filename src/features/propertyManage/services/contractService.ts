import type { AxiosError } from "axios";
import apiClient from "@/shared/api/client";
import type {
  ContractInfo,
  ContractInfoInput,
  ContractType,
} from "../stores/contractStore";

/**
 * 계약 정보 조회
 * GET /api/properties/contractInfo
 */
export const getContractAPI = async (
  apartmentId: number,
  contractType: ContractType
): Promise<ContractInfo | null> => {
  try {
    const response = await apiClient.get<ContractInfo>(
      "/api/properties/contractInfo",
      {
        params: { apartmentId, contractType },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * 계약 정보 생성
 * POST /api/properties/contractInfo
 */
export const createContractAPI = async (
  apartmentId: number,
  contract: Partial<ContractInfoInput>
): Promise<ContractInfo> => {
  const response = await apiClient.post<ContractInfo>(
    "/api/properties/contractInfo",
    {
      apartmentId,
      ...contract,
    }
  );
  return response.data;
};

/**
 * 계약 정보 수정
 * PUT /api/properties/contractInfo
 */
export const saveContractAPI = async (
  apartmentId: number,
  contract: Partial<ContractInfoInput>
): Promise<ContractInfo> => {
  const response = await apiClient.put<ContractInfo>(
    "/api/properties/contractInfo",
    {
      apartmentId,
      ...contract,
    }
  );
  return response.data;
};
