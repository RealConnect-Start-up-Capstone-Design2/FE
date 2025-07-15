import api from "./api";

/**
 * 문의 목록을 조회하는 함수
 * @param {object} params - 필터링 및 정렬을 위한 파라미터
 * @returns {Promise<Array>} - 문의 목록
 */
export const getInquiries = async (params) => {
  try {
    const response = await api.get("/api/inquiries", { params });
    return response.data;
  } catch (error) {
    console.error("문의 목록 조회에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 문의 정보를 수정하는 함수
 * @param {string} inquiryId - 문의 ID
 * @param {object} inquiryData - 수정할 문의 데이터
 * @returns {Promise<object>} - 수정된 문의 정보
 */
export const updateInquiry = async (inquiryId, inquiryData) => {
  try {
    const response = await api.put(`/api/inquiries/${inquiryId}`, inquiryData);
    return response.data;
  } catch (error) {
    console.error("문의 정보 업데이트에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 새로운 문의를 생성합니다.
 * @param {object} inquiryData - 생성할 문의 데이터
 * @returns {Promise<object>} - 생성된 문의 정보
 */
export const createInquiry = async (inquiryData) => {
  try {
    const response = await api.post("/api/inquiries", inquiryData);
    return response.data;
  } catch (error) {
    console.error("문의 생성에 실패했습니다.", error);
    throw error;
  }
};

/**
 * 문의를 삭제합니다.
 * @param {string} inquiryId - 삭제할 문의 ID
 * @returns {Promise<void>}
 */
export const deleteInquiry = async (inquiryId) => {
  try {
    await api.delete(`/api/inquiries/${inquiryId}`);
  } catch (error) {
    console.error("문의 삭제에 실패했습니다.", error);
    throw error;
  }
}; 