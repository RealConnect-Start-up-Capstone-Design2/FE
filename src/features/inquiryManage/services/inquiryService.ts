import apiClient from "@/shared/api/client";
import type {
  InquiriesResponse,
  InquiriesQueryParams,
  CreateInquiryPayload,
  CreateInquiryResponse,
} from "../types/inquiry";

/**
 * 문의 목록 조회 API (페이지 기반 페이지네이션)
 * GET /api/inquiries
 *
 * @param params 조회 파라미터
 * @param params.keyword 검색 키워드 (제목, 내용, 매물명 등)
 * @param params.minArea 최소 전용 면적 (단위: m²)
 * @param params.maxArea 최대 전용 면적 (단위: m²)
 * @param params.requestType 의뢰 유형 (MONTHLY, JEONSE, SALE, THINKING, DEPOSIT)
 * @param params.minPrice 최소 가격 (단위: 원)
 * @param params.maxPrice 최대 가격 (단위: 원)
 * @param params.page 페이지 번호 (기본: 0)
 * @param params.size 페이지 크기 (기본: 10)
 * @param params.sort 정렬 기준 (기본: createdDate,DESC)
 * @returns 문의 목록 + 페이지네이션 정보
 */
export const fetchInquiries = async (
  params: InquiriesQueryParams = {}
): Promise<InquiriesResponse> => {
  const response = await apiClient.get<InquiriesResponse>("/api/inquiries", {
    params: {
      keyword: params.keyword,
      manageType: params.manageType,
      minArea: params.minArea,
      maxArea: params.maxArea,
      requestType: params.requestType,
      inquiryStatus: params.inquiryStatus,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      page: params.page ?? 0,
      size: params.size ?? 10,
      sort: params.sort ?? ["createdDate,DESC"],
    },
  });
  return response.data;
};

/**
 * 문의 등록 API
 * POST /api/inquiries/create
 *
 * @param payload 문의 등록 데이터
 * @returns { message: string, data: number } - data는 생성된 문의 ID
 */
export const createInquiry = async (
  payload: CreateInquiryPayload
): Promise<CreateInquiryResponse> => {
  const response = await apiClient.post<CreateInquiryResponse>(
    "/api/inquiries/create",
    payload
  );
  return response.data;
};
