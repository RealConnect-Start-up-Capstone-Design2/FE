import apiClient from "@/shared/api/client";
import type {
  PropertiesResponse,
  PropertiesApiResponse,
  PropertiesQueryParams,
  ApartmentWithProperty,
  PropertyApiResponse,
  PropertyStatus,
  RequestType,
  ManageType,
  PropertyDetailInfo,
  OccupancyStatus,
} from "../types";

export interface PropertyRequestInfo {
  requestType: RequestType;
  loanAmount: number;
  loanState: string;
  immediateMoveIn: boolean;
  availableMoveInDate: string;
  registeredAt: string;
  salePrice: number;
  existingJeonseDeposit: number;
  existingMonthlyRent: number;
  jeonsePrice: number;
  monthlyDeposit: number;
  monthlyRent: number;
}

export type ConsultationCustomerType = "OWNER" | "TENENT" | "ETC";

export interface PropertyConsultationLog {
  id: number;
  customerType: ConsultationCustomerType;
  content: string;
  writerName: string;
  createdAt: string;
}

export interface PropertyConsultationInfo {
  id: number;
  ownerName: string;
  ownerPhone: string;
  tenantName: string;
  tenantPhone: string;
  etcName: string;
  etcPhone: string;
  createdAt: string;
  updatedAt: string;
  logs: PropertyConsultationLog[];
}

export type PropertyConsultationUpdatePayload = Pick<
  PropertyConsultationInfo,
  | "ownerName"
  | "ownerPhone"
  | "tenantName"
  | "tenantPhone"
  | "etcName"
  | "etcPhone"
>;

export interface PropertyConsultationLogPayload {
  customerType: ConsultationCustomerType;
  content: string;
}

export type ContractType =
  | "MY_CONTRACT"
  | "OTHER_CONTRACT"
  | "CO_BROKERAGE"
  | "INTRODUCTION";

export interface PropertyContractInfo {
  occupancyStatus: OccupancyStatus;
  salePrice: number;
  loanAmount: number;
  jeonsePrice: number;
  deposit: number;
  monthlyRent: number;
  maintenanceFee: number;
  expireDate: string;
  registrationDate: string;
  contractOffice: string;
  contractType: ContractType;
}

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
  const response = await apiClient.get<PropertiesApiResponse>(
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

  return {
    content: response.data.content.map((item) =>
      mapApiResponseToApartment(item),
    ),
    nextCursor: response.data.nextCursor,
    hasNext: response.data.hasNext,
  };
};

/**
 * 특정 아파트 조회 API
 * GET /api/property/detail/:apartmentId
 */
export const fetchApartmentById = async (
  apartmentId: number
): Promise<PropertyDetailInfo> => {
  const response = await apiClient.get<PropertyDetailInfo>(
    `/api/property/detail/${apartmentId}`
  );
  return response.data;
};

/**
 * 의뢰 정보 조회 API
 * GET /api/property/requestInfo/:apartmentId
 */
export const fetchPropertyRequestInfo = async (
  apartmentId: number
): Promise<PropertyRequestInfo> => {
  const response = await apiClient.get<PropertyRequestInfo>(
    `/api/property/requestInfo/${apartmentId}`
  );
  return response.data;
};

/**
 * 의뢰 정보 수정 API
 * PUT /api/property/requestInfo/:apartmentId
 */
export const updatePropertyRequestInfoAPI = async (
  apartmentId: number,
  data: PropertyRequestInfo
): Promise<PropertyRequestInfo> => {
  const response = await apiClient.put<PropertyRequestInfo>(
    `/api/property/requestInfo/${apartmentId}`,
    data
  );
  return response.data;
};

/**
 * 고객 상담 조회 API
 * GET /api/property/consultation/:apartmentId
 */
export const fetchPropertyConsultation = async (
  apartmentId: number
): Promise<PropertyConsultationInfo> => {
  const response = await apiClient.get<PropertyConsultationInfo>(
    `/api/property/consultation/${apartmentId}`
  );
  return response.data;
};

/**
 * 고객 상담 연락처 수정 API
 * PUT /api/property/consultation/:apartmentId
 */
export const updatePropertyConsultationAPI = async (
  apartmentId: number,
  data: PropertyConsultationUpdatePayload
): Promise<PropertyConsultationInfo> => {
  const response = await apiClient.put<PropertyConsultationInfo>(
    `/api/property/consultation/${apartmentId}`,
    data
  );
  return response.data;
};

/**
 * 고객 상담 로그 등록 API
 * POST /api/property/consultation/:apartmentId
 */
export const createPropertyConsultationLogAPI = async (
  apartmentId: number,
  data: PropertyConsultationLogPayload
): Promise<PropertyConsultationLog> => {
  const response = await apiClient.post<PropertyConsultationLog>(
    `/api/property/consultation/${apartmentId}`,
    data
  );
  return response.data;
};

/**
 * 계약 정보 조회 API
 * GET /api/properties/contractInfo/:apartmentId
 */
export const fetchPropertyContractInfo = async (
  apartmentId: number
): Promise<PropertyContractInfo> => {
  const response = await apiClient.get<PropertyContractInfo>(
    `/api/properties/contractInfo/${apartmentId}`
  );
  return response.data;
};

/**
 * 계약 정보 수정 API
 * PUT /api/properties/contractInfo/:apartmentId
 */
export const updatePropertyContractInfoAPI = async (
  apartmentId: number,
  data: PropertyContractInfo
): Promise<PropertyContractInfo> => {
  const response = await apiClient.put<PropertyContractInfo>(
    `/api/properties/contractInfo/${apartmentId}`,
    data
  );
  return response.data;
};

/**
 * 매물 상세 수정 API
 * PUT /api/property/detail/:apartmentId
 */
export const updatePropertyDetailAPI = async (
  apartmentId: number,
  data: PropertyDetailInfo
): Promise<PropertyDetailInfo> => {
  const response = await apiClient.put<PropertyDetailInfo>(
    `/api/property/detail/${apartmentId}`,
    data
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
