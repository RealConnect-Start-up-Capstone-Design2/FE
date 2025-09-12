import { createApiService } from "@realconnect/shared-utils";
import api from "./api";

// 매물 서비스용 API 헬퍼 생성
const propertyApi = createApiService(api, "PropertyService");

/**
 * 매물 목록을 조회하는 함수
 * @param {object} params - 필터링 및 정렬을 위한 파라미터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @param {string} params.sort - 정렬 기준 (DONG_HO, END_DATE, CREATED_AT)
 * @param {string} params.view - 뷰 필터 (전체, 내 물건)
 * @param {string} params.transactionType - 거래 유형 필터 (BUY, JEONSE, MONTH_RENT)
 * @returns {Promise<object>} - 매물 목록과 페이징 정보를 포함하는 객체
 */
export const getProperties = async (params) => {
  return propertyApi.get("/api/apartments-properties", params);
};

/**
 * 매물을 검색하는 함수
 * @param {object} params - 검색을 위한 파라미터
 * @param {string} params.q - 검색어
 * @param {number} params.page - 페이지 번호 (기본값 0)
 * @param {number} params.size - 페이지 크기 (기본값 1000)
 * @returns {Promise<object>} - 검색된 매물 목록과 페이징 정보를 포함하는 객체
 */
export const searchProperties = async (params) => {
  return propertyApi.get("/api/apartments-properties/search", params);
};

/**
 * 매물 정보를 수정하는 함수
 * @param {string} propertyId - 매물 ID
 * @param {object} propertyData - 수정할 매물 데이터
 * @returns {Promise<object>} - 수정된 매물 정보
 */
export const updateProperty = async (propertyId, propertyData) => {
  return propertyApi.put(`/api/properties/${propertyId}`, propertyData);
};

/**
 * 새로운 매물을 생성합니다. (Endpoint is an assumption)
 * @param {object} propertyData - 생성할 매물 데이터
 * @returns {Promise<object>} - 생성된 매물 정보
 */
export const createProperty = async (propertyData) => {
  return propertyApi.post("/api/properties", propertyData);
};

/**
 * 매물을 삭제합니다. (Endpoint is an assumption)
 * @param {string} propertyId - 삭제할 매물 ID
 * @returns {Promise<void>}
 */
export const deleteProperty = async (propertyId) => {
  return propertyApi.delete(`/api/properties/${propertyId}`);
};
