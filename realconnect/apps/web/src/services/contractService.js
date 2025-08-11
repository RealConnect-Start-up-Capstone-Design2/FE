import api from "./api";

/**
 * 계약 목록을 조회하는 함수
 * @param {object} params - 필터링 및 정렬을 위한 파라미터
 * @returns {Promise<Array>} - 계약 목록
 */
export const getContracts = async (params) => {
  try {
    const response = await api.get("/api/contract/searchContracts", { params });
    return response.data;
  } catch (error) {
    console.error("계약 목록 조회에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 즐겨찾기된 계약 목록을 조회하는 함수
 * @returns {Promise<Array>} - 즐겨찾기된 계약 목록
 */
export const getFavoriteContracts = async () => {
  try {
    const response = await api.get("/api/contract/searchContracts", {
      params: { favorite: true },
    });
    return response.data;
  } catch (error) {
    console.error("즐겨찾기 계약 목록 조회에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 계약 정보를 수정하는 함수
 * @param {string} id - 계약 ID
 * @param {object} contractData - 수정할 계약 데이터
 * @returns {Promise<object>} - 수정된 계약 정보
 */
export const updateContract = async (contractId, contractData) => {
  try {
    const response = await api.put(
      `/api/contract/update/${contractId}`,
      contractData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating contract:", error);
    throw error;
  }
};

/**
 * 새로운 계약을 생성합니다.
 * @param {object} contractData - 생성할 계약 데이터
 * @returns {Promise<object>} - 생성된 계약 정보
 */
export const createContract = async (contractData) => {
  try {
    const response = await api.post("/api/contract", contractData);
    return response.data;
  } catch (error) {
    console.error("Error creating contract:", error);
    throw error;
  }
};
