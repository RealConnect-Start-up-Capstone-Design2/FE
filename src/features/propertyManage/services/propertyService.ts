import apiClient from "@/shared/api/client";
import type {
  PropertiesResponse,
  PropertiesQueryParams,
  ApartmentWithProperty,
  PropertyStatus,
  RequestType,
  ManageType,
} from "../stores/propertyStore";

export interface PropertyMutationPayload {
  apartmentId: number;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  propertyStatus: PropertyStatus;
  requestType: RequestType;
  manageType: ManageType;
  contractDate: string | null;
}

/**
 * 아파트 목록 조회 API (커서 기반 페이지네이션)
 * GET /api/properties
 *
 * @param params 조회 파라미터
 * @param params.apartmentComplexId 단지 ID (필수)
 * @param params.cursorId 커서 ID (옵션, 첫 페이지는 생략)
 * @param params.size 페이지 크기 (기본 30, 최대 100)
 * @param params.dong 동 필터 (옵션)
 * @param params.area 면적 필터 (옵션)
 * @param params.propertyStatus 매물 상태 필터 (옵션)
 * @param params.requestType 의뢰 유형 필터 (옵션)
 * @returns 아파트 목록 + 페이지네이션 정보
 */
export const fetchProperties = async (
  params: PropertiesQueryParams
): Promise<PropertiesResponse> => {
  const response = await apiClient.get<PropertiesResponse>("/api/properties", {
    params: {
      apartmentComplexId: params.apartmentComplexId,
      cursorId: params.cursorId,
      size: params.size || 30,
      dong: params.dong,
      ho: params.ho,
      area: params.area,
      propertyStatus: params.propertyStatus,
      requestType: params.requestType,
      manageType: params.manageType,
    },
  });
  return response.data;
};

/**
 * 특정 아파트 조회 API
 * GET /api/properties/:apartmentId
 */
export const fetchApartmentById = async (
  apartmentId: number
): Promise<ApartmentWithProperty> => {
  const response = await apiClient.get<ApartmentWithProperty>(
    `/api/properties/${apartmentId}`
  );
  return response.data;
};

/**
 * 메모 조회 API
 * GET /memo?apartmentId={apartmentId}
 */
export const getMemoAPI = async (
  apartmentId: number
): Promise<{ apartmentId: number; content: string }> => {
  const response = await apiClient.get<{
    apartmentId: number;
    content: string;
  }>("/memo", {
    params: { apartmentId },
  });
  return response.data;
};

/**
 * 메모 등록 API
 * POST /memo
 */
export const createMemoAPI = async (
  apartmentId: number,
  content: string
): Promise<{ apartmentId: number; content: string }> => {
  const response = await apiClient.post<{
    apartmentId: number;
    content: string;
  }>("/memo", { apartmentId, content });
  return response.data;
};

/**
 * 메모 수정 API
 * PUT /memo
 */
export const updateMemoAPI = async (
  apartmentId: number,
  content: string
): Promise<{ apartmentId: number; content: string }> => {
  const response = await apiClient.put<{
    apartmentId: number;
    content: string;
  }>("/memo", { apartmentId, content });
  return response.data;
};

/**
 * 매물 정보 업데이트 API
 * PUT /api/properties
 */
export const updatePropertyAPI = async (
  data: PropertyMutationPayload
): Promise<{
  propertyStatus: string;
  requestType: string;
  manageType: string;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  apartmentId: number;
}> => {
  const response = await apiClient.put("/api/properties", data);
  return response.data;
};

/**
 * 의뢰 유형 업데이트 API (기존 매물)
 * PATCH /api/properties/requestType
 */
export const updateRequestTypeAPI = async (
  apartmentId: number,
  requestType: string
): Promise<{
  propertyStatus: string;
  requestType: string;
  manageType: string;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  apartmentId: number;
}> => {
  const response = await apiClient.patch("/api/properties/requestType", {
    apartmentId,
    requestType,
  });
  return response.data;
};

/**
 * 의뢰 유형으로 매물 생성 API (새 매물)
 * POST /api/properties/requestType
 */
export const createPropertyWithRequestTypeAPI = async (
  apartmentId: number,
  requestType: string
): Promise<{
  propertyStatus: string;
  requestType: string;
  manageType: string;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  apartmentId: number;
}> => {
  const response = await apiClient.post("/api/properties/requestType", {
    apartmentId,
    requestType,
  });
  return response.data;
};

/**
 * 매물 상태 업데이트 API (기존 매물)
 * PATCH /api/properties/status
 */
export const updatePropertyStatusAPI = async (
  apartmentId: number,
  propertyStatus: string
): Promise<{
  propertyStatus: string;
  requestType: string;
  manageType: string;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  apartmentId: number;
}> => {
  const response = await apiClient.patch("/api/properties/status", {
    apartmentId,
    propertyStatus,
  });
  return response.data;
};

/**
 * 매물 상태로 매물 생성 API (새 매물)
 * POST /api/properties/status
 */
export const createPropertyWithStatusAPI = async (
  apartmentId: number,
  propertyStatus: string
): Promise<{
  propertyStatus: string;
  requestType: string;
  manageType: string;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  apartmentId: number;
}> => {
  const response = await apiClient.post("/api/properties/status", {
    apartmentId,
    propertyStatus,
  });
  return response.data;
};

/**
 * 매물 등록 API
 * POST /api/properties
 */
export const createPropertyAPI = async (
  data: PropertyMutationPayload
): Promise<{
  propertyStatus: string;
  requestType: string;
  manageType: string;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  apartmentId: number;
}> => {
  const response = await apiClient.post("/api/properties", data);
  return response.data;
};

/**
 * 관리 타입 변경 API
 * PATCH /api/properties/manageType
 */
export const updateManageTypeAPI = async (
  apartmentId: number,
  manageType: string
): Promise<{
  propertyStatus: string;
  requestType: string;
  manageType: string;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  apartmentId: number;
}> => {
  const response = await apiClient.patch("/api/properties/manageType", {
    apartmentId,
    manageType,
  });
  return response.data;
};

/**
 * 관리 타입으로 매물 생성 API
 * POST /api/properties/manageType
 */
export const createPropertyWithManageTypeAPI = async (
  apartmentId: number,
  manageType: string
): Promise<{
  propertyStatus: string;
  requestType: string;
  manageType: string;
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  apartmentId: number;
}> => {
  const response = await apiClient.post("/api/properties/manageType", {
    apartmentId,
    manageType,
  });
  return response.data;
};

/**
 * 즐겨찾기 토글 API
 * PATCH /api/properties/:apartmentId/favorite
 */
export const toggleFavoriteAPI = async (
  apartmentId: number,
  isFavorite: boolean
): Promise<{ apartmentId: number; isFavorite: boolean }> => {
  const response = await apiClient.patch(
    `/api/properties/${apartmentId}/favorite`,
    { isFavorite }
  );
  return response.data;
};
