/**
 * API 엔드포인트 상수 정의
 */

// 인증 관련 엔드포인트
export const AUTH_ENDPOINTS = {
  LOGIN: "/login",
  REFRESH_TOKEN: "/api/refresh-token",
};

// 매물 관련 엔드포인트
export const PROPERTY_ENDPOINTS = {
  GET_PROPERTIES: "/api/apartments-properties",
  SEARCH_PROPERTIES: "/api/apartments-properties/search",
  UPDATE_PROPERTY: (id) => `/api/properties/${id}`,
  CREATE_PROPERTY: "/api/properties",
  DELETE_PROPERTY: (id) => `/api/properties/${id}`,
};

// 문의 관련 엔드포인트
export const INQUIRY_ENDPOINTS = {
  GET_INQUIRIES: "/api/inquiries",
  UPDATE_INQUIRY: (id) => `/api/inquiries/${id}`,
  CREATE_INQUIRY: "/api/inquiries",
  DELETE_INQUIRY: (id) => `/api/inquiries/${id}`,
};

// 계약 관련 엔드포인트
export const CONTRACT_ENDPOINTS = {
  GET_CONTRACTS: "/api/contract/searchContracts",
  GET_FAVORITE_CONTRACTS: "/api/contract/favorites",
  UPDATE_CONTRACT: (id) => `/api/contract/${id}`,
  CREATE_CONTRACT: "/api/contract",
  DELETE_CONTRACT: (id) => `/api/contract/${id}`,
};

// 공유 관련 엔드포인트
export const SHARE_ENDPOINTS = {
  GET_SHARED_INQUIRIES: "/api/shares",
  GET_MY_SHARED_INQUIRIES: "/api/shares/my",
  SHARE_INQUIRY: "/api/shares",
  DELETE_SHARED_INQUIRY: (id) => `/api/shares/${id}`,
};
