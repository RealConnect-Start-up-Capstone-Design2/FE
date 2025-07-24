import api from "./api";

/**
 * 매물 목록을 조회하는 함수
 * @param {object} params - 필터링 및 정렬을 위한 파라미터 (e.g., { page: 0, size: 30 })
 * @returns {Promise<object>} - 매물 목록과 페이징 정보를 포함하는 객체
 */
export const getProperties = async (params) => {
  try {
    const response = await api.get("/api/apartments-properties", { params });
    return response.data;
  } catch (error) {
    console.error("매물 목록 조회에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 매물 정보를 수정하는 함수
 * @param {string} propertyId - 매물 ID
 * @param {object} propertyData - 수정할 매물 데이터
 * @returns {Promise<object>} - 수정된 매물 정보
 */
export const updateProperty = async (propertyId, propertyData) => {
  try {
    const response = await api.put(
      `/api/properties/${propertyId}`,
      propertyData
    );
    return response.data;
  } catch (error) {
    console.error("매물 정보 업데이트에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 새로운 매물을 생성합니다. (Endpoint is an assumption)
 * @param {object} propertyData - 생성할 매물 데이터
 * @returns {Promise<object>} - 생성된 매물 정보
 */
export const createProperty = async (propertyData) => {
  try {
    const response = await api.post("/api/properties", propertyData);
    return response.data;
  } catch (error) {
    console.error("매물 생성에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 매물을 삭제합니다. (Endpoint is an assumption)
 * @param {string} propertyId - 삭제할 매물 ID
 * @returns {Promise<void>}
 */
export const deleteProperty = async (propertyId) => {
  try {
    await api.delete(`/api/properties/${propertyId}`);
  } catch (error) {
    console.error("매물 삭제에 실패했습니다.", error);
    throw error;
  }
};
