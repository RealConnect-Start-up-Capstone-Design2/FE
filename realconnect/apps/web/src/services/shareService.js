import api from "./api";

/**
 * 필터링된 전체 공유 문의 목록을 조회합니다.
 * @param {object} params - 필터링 파라미터 (e.g., region, inquiryType)
 * @returns {Promise<Array>} - 공유 문의 목록
 */
export const getSharedInquiries = async (params) => {
  try {
    const response = await api.get("/api/shares", { params });
    return response.data;
  } catch (error) {
    console.error("공유 문의 목록 조회에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 내가 공유한 문의 목록을 조회합니다.
 * @returns {Promise<Array>} - 내가 공유한 문의 목록
 */
export const getMySharedInquiries = async () => {
  try {
    const response = await api.get("/api/shares/my");
    return response.data;
  } catch (error) {
    console.error("내가 공유한 문의 목록 조회에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 특정 공유 문의의 상세 정보를 조회합니다.
 * @param {string} inquiryId - 조회할 문의의 ID
 * @returns {Promise<object>} - 공유 문의 상세 정보
 */
export const getSharedInquiryById = async (inquiryId) => {
  try {
    const response = await api.get(`/api/shares/${inquiryId}`);
    return response.data;
  } catch (error) {
    console.error("공유 문의 상세 정보 조회에 실패했습니다.", error);
    throw error;
  }
}; 