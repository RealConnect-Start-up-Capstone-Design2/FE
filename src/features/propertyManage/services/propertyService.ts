import apiClient from "@/shared/api/client";
import type {
  PropertiesResponse,
  PropertiesApiResponse,
  PropertiesQueryParams,
  ApartmentWithProperty,
  PropertyApiResponse,
  PropertyDetailResponse,
  PropertyRequestInfoResponse,
  ConsultationResponse,
  ConsultationPayload,
  ConsultationLogPayload,
  PropertyImageResponse,
  PresignImageRequest,
  PropertyStatus,
  RequestType,
  ManageType,
} from "../types";

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
  params: PropertiesQueryParams,
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

interface PropertiesPhoneQueryParams {
  apartmentComplexId: number;
  cursorId?: number;
  size?: number;
  phone?: string;
}

export const fetchPropertiesByPhone = async (
  params: PropertiesPhoneQueryParams,
): Promise<PropertiesResponse> => {
  const response = await apiClient.get<PropertiesResponse>(
    "/api/properties/phone",
    {
      params: {
        apartmentComplexId: params.apartmentComplexId,
        cursorId: params.cursorId,
        size: params.size || 30,
        phone: params.phone,
      },
    },
  );
  return response.data;
};

/**
 * 특정 아파트 조회 API
 * GET /api/property/detail/:apartmentId
 */
export const fetchApartmentById = async (
  apartmentId: number,
): Promise<ApartmentWithProperty> => {
  const response = await apiClient.get<ApartmentWithProperty>(
    `/api/property/detail/${apartmentId}`,
  );
  return response.data;
};

/**
 * 매물 상세 조회 API
 * GET /api/property/detail/:apartmentId
 * (방향, 층, 구조, 입구타입, 주용도 등 상세 필드)
 */
export const fetchPropertyDetail = async (
  apartmentId: number,
): Promise<PropertyDetailResponse> => {
  const response = await apiClient.get<PropertyDetailResponse>(
    `/api/property/detail/${apartmentId}`,
  );
  return response.data;
};

/**
 * 매물 상세 수정 API
 * PUT /api/property/detail/:apartmentId
 */
export const updatePropertyDetail = async (
  apartmentId: number,
  data: PropertyDetailResponse,
): Promise<PropertyDetailResponse> => {
  const response = await apiClient.put<PropertyDetailResponse>(
    `/api/property/detail/${apartmentId}`,
    data,
  );
  return response.data;
};

/**
 * 의뢰정보 조회 API
 * GET /api/property/requestInfo/:apartmentId
 */
export const fetchRequestInfo = async (
  apartmentId: number,
): Promise<PropertyRequestInfoResponse> => {
  const response = await apiClient.get<PropertyRequestInfoResponse>(
    `/api/property/requestInfo/${apartmentId}`,
  );
  return response.data;
};

/**
 * 의뢰정보 생성/수정 API
 * PUT /api/property/requestInfo/:apartmentId
 */
export const updateRequestInfo = async (
  apartmentId: number,
  data: PropertyRequestInfoResponse,
): Promise<PropertyRequestInfoResponse> => {
  const response = await apiClient.put<PropertyRequestInfoResponse>(
    `/api/property/requestInfo/${apartmentId}`,
    data,
  );
  return response.data;
};

/**
 * 고객 상담 카드 조회 API
 * GET /api/property/consultation/:apartmentId
 */
export const fetchConsultation = async (
  apartmentId: number,
): Promise<ConsultationResponse> => {
  const response = await apiClient.get<ConsultationResponse>(
    `/api/property/consultation/${apartmentId}`,
  );
  return response.data;
};

/**
 * 고객 상담 생성/수정 API
 * PUT /api/property/consultation/:apartmentId
 */
export const updateConsultation = async (
  apartmentId: number,
  data: ConsultationPayload,
): Promise<ConsultationResponse> => {
  const response = await apiClient.put<ConsultationResponse>(
    `/api/property/consultation/${apartmentId}`,
    data,
  );
  return response.data;
};

/**
 * 상담 로그 추가 API
 * POST /api/property/consultation/:apartmentId
 */
export const createConsultationLog = async (
  apartmentId: number,
  data: ConsultationLogPayload,
): Promise<ConsultationResponse> => {
  const response = await apiClient.post<ConsultationResponse>(
    `/api/property/consultation/${apartmentId}`,
    data,
  );
  return response.data;
};

/**
 * 매물 사진 조회 API
 * GET /api/property/image/:apartmentId
 * 이미지 없으면 빈 배열 반환
 */
export const fetchPropertyImages = async (
  apartmentId: number,
): Promise<PropertyImageResponse[]> => {
  const response = await apiClient.get<PropertyImageResponse[]>(
    `/api/property/image/${apartmentId}`,
  );
  return response.data;
};

/**
 * 매물 사진 Presigned URL 발급 API
 * POST /api/property/image/:apartmentId
 * params: originalFileName, contentType (image/jpeg, image/png, image/webp 등, ; 앞부분만 사용)
 * 발급 후 S3에 form-data file 필드로 업로드, 완료 후 confirm 호출 필요
 */
export const createPropertyImagePresign = async (
  apartmentId: number,
  data: PresignImageRequest,
): Promise<PropertyImageResponse> => {
  const response = await apiClient.post<PropertyImageResponse>(
    `/api/property/image/${apartmentId}`,
    undefined,
    {
      params: {
        originalFileName: data.originalFileName,
        contentType: data.contentType,
      },
    },
  );
  return response.data;
};

/**
 * 매물 사진 업로드 확정 API
 * POST /api/property/image/confirm/:imageId
 * S3 업로드 완료 후 호출해야 조회 시 이미지 포함됨
 */
export const confirmPropertyImage = async (
  imageId: number,
): Promise<PropertyImageResponse> => {
  const response = await apiClient.post<PropertyImageResponse>(
    `/api/property/image/confirm/${imageId}`,
  );
  return response.data;
};

/**
 * 아파트 단지의 총 아파트 수 조회
 * GET /api/apartment-complex/totalCnt
 * @param apartmentComplexId
 * @returns 총 아파트 수
 */
export const fetchTotalApartmentCount = async (
  apartmentComplexId: number,
): Promise<number> => {
  const response = await apiClient.get<{ totalCount: number }>(
    `/api/apartment-complex/totalCnt`,
    {
      params: {
        apartmentComplexId,
      },
    },
  );
  return response.data.totalCount;
};

/**
 * 메모 조회 API
 * GET /memo?apartmentId={apartmentId}
 */
export const getMemoAPI = async (
  apartmentId: number,
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
  content: string,
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
  content: string,
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
  data: PropertyMutationPayload,
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
 * 매물 등록 API
 * POST /api/properties
 */
export const createPropertyAPI = async (
  data: PropertyMutationPayload,
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
 * 즐겨찾기 토글 API
 * PATCH /api/properties/:apartmentId/favorite
 */
export const toggleFavoriteAPI = async (
  apartmentId: number,
  isFavorite: boolean,
): Promise<{ apartmentId: number; isFavorite: boolean }> => {
  const response = await apiClient.patch(
    `/api/properties/${apartmentId}/favorite`,
    { isFavorite },
  );
  return response.data;
};

/**
 * API 응답을 내부 타입으로 변환
 */
const mapApiResponseToApartment = (
  apiData: PropertyApiResponse,
  apartmentName?: string,
): ApartmentWithProperty => {
  return {
    apartmentId: apiData.apartmentId,
    apartmentName: apartmentName || "",
    dong: apiData.dong,
    ho: apiData.ho,
    area: apiData.supplyArea,
    direction: apiData.direction,
    img: "",
    type: apiData.supplyType,
    property: {
      salePrice: apiData.requestSalePrice,
      jeonsePrice: apiData.requestJeonsePrice,
      deposit: apiData.requestMonthlyDeposit,
      monthPrice: apiData.requestMonthlyRent,
      propertyStatus: "NONE" as PropertyStatus,
      requestType: apiData.requestType,
      manageType: apiData.manageType,
      ownerName: apiData.ownerName,
      ownerPhone: apiData.ownerPhone,
      contractDate: "",
      occupancyStatus: apiData.contractOccupancyStatus,
      contractSalePrice: apiData.contractSalePrice, // 기매입금
      contractJeonsePrice: apiData.contractJeonsePrice,
      contractDeposit: apiData.contractDeposit,
      contractMonthlyRent: apiData.contractMonthlyRent,
      expireDate: apiData.contractExpireDate,
      requestRegistrationDate: apiData.requestRegisteredAt,
    },
  };
};

/**
 * 매물 목록 조회 API (읽기 전용)
 * GET /api/property
 */
export const fetchPropertyList = async (
  params: PropertiesQueryParams,
): Promise<PropertiesResponse> => {
  const response = await apiClient.get<PropertiesApiResponse>("/api/property", {
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

  // API 응답을 내부 타입으로 변환
  return {
    content: response.data.content.map((item) =>
      mapApiResponseToApartment(item),
    ),
    nextCursor: response.data.nextCursor,
    hasNext: response.data.hasNext,
  };
};

/**
 * 즐겨찾기 관리 API
 * POST /api/property/manage/{apartmentId}
 */
export const updatePropertyManage = async (
  apartmentId: number,
  manageType: ManageType,
): Promise<{ apartmentId: number; manageType: ManageType }> => {
  const response = await apiClient.post(`/api/property/manage/${apartmentId}`, {
    manageType,
  });
  return response.data;
};
