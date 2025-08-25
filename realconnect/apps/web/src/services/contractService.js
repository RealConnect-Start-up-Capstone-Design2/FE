import { createApiService } from "@realconnect/shared-utils";
import api from "./api";

// 계약 서비스용 API 헬퍼 생성
const contractApi = createApiService(api, "ContractService");

/**
 * 계약 목록을 조회하는 함수
 * @param {object} params - 필터링 및 정렬을 위한 파라미터
 * @returns {Promise<Array>} - 계약 목록
 */
export const getContracts = async (params) => {
  return contractApi.get("/api/contract/searchContracts", params);
};

/**
 * 즐겨찾기된 계약 목록을 조회하는 함수
 * @returns {Promise<Array>} - 즐겨찾기된 계약 목록
 */
export const getFavoriteContracts = async () => {
  return contractApi.get("/api/contract/searchContracts", { favorite: true });
};

/**
 * 계약 정보를 수정하는 함수
 * @param {string} contractId - 계약 ID
 * @param {object} contractData - 수정할 계약 데이터
 * @returns {Promise<object>} - 수정된 계약 정보
 */
export const updateContract = async (contractId, contractData) => {
  return contractApi.put(`/api/contract/update/${contractId}`, contractData);
};

/**
 * 새로운 계약을 생성합니다.
 * @param {object} contractData - 생성할 계약 데이터
 * @returns {Promise<object>} - 생성된 계약 정보
 */
export const createContract = async (contractData) => {
  return contractApi.post("/api/contract", contractData);
};
