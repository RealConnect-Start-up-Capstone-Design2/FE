import { createApiService } from "@realconnect/shared-utils";
import api from "./api";

// 공유 서비스용 API 헬퍼 생성
const shareApi = createApiService(api, "ShareService");

/**
 * 필터링된 전체 공유 문의 목록을 조회합니다.
 * @param {object} params - 필터링 파라미터 (e.g., region, inquiryType)
 * @returns {Promise<Array>} - 공유 문의 목록
 */
export const getSharedInquiries = async (params) => {
  return shareApi.get("/api/shares", params);
};

/**
 * 내가 공유한 문의 목록을 조회합니다.
 * @returns {Promise<Array>} - 내가 공유한 문의 목록
 */
export const getMySharedInquiries = async () => {
  return shareApi.get("/api/shares/my");
};

/**
 * 특정 공유 문의의 상세 정보를 조회합니다.
 * @param {string} inquiryId - 조회할 문의의 ID
 * @returns {Promise<object>} - 공유 문의 상세 정보
 */
export const getSharedInquiryById = async (inquiryId) => {
  return shareApi.get(`/api/shares/${inquiryId}`);
};
