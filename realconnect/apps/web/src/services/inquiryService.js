import { createApiService } from "@realconnect/shared-utils";
import api from "./api";

// 문의 서비스용 API 헬퍼 생성
const inquiryApi = createApiService(api, "InquiryService");

/**
 * 문의 목록을 조회하는 함수
 * @param {object} params - 필터링 및 정렬을 위한 파라미터
 * @returns {Promise<Array>} - 문의 목록
 */
export const getInquiries = async (params) => {
  return inquiryApi.get("/api/inquiries", params);
};

/**
 * 문의 정보를 수정하는 함수
 * @param {string} inquiryId - 문의 ID
 * @param {object} inquiryData - 수정할 문의 데이터
 * @returns {Promise<object>} - 수정된 문의 정보
 */
export const updateInquiry = async (inquiryId, inquiryData) => {
  return inquiryApi.put(`/api/inquiries/${inquiryId}`, inquiryData);
};

/**
 * 새로운 문의를 생성합니다.
 * @param {object} inquiryData - 생성할 문의 데이터
 * @returns {Promise<object>} - 생성된 문의 정보
 */
export const createInquiry = async (inquiryData) => {
  return inquiryApi.post("/api/inquiries", inquiryData);
};

/**
 * 문의를 삭제합니다.
 * @param {string} inquiryId - 삭제할 문의 ID
 * @returns {Promise<void>}
 */
export const deleteInquiry = async (inquiryId) => {
  return inquiryApi.delete(`/api/inquiries/${inquiryId}`);
};
