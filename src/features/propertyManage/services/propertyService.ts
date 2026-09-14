import apiClient from "@/shared/api/client";
import {
  apartmentComplexIdToDemoComplexId,
  apartmentIdToDemoPropertyId,
  demoPropertyIdToApartmentId,
} from "@/demo/ids";
import {
  getDemoContractByPropertyId,
  getDemoOffice,
  getDemoProperty,
  getDemoState,
  upsertDemoConsultation,
  upsertDemoContract,
  upsertDemoProperty,
} from "@/demo/repository";
import { isDemoRuntime } from "@/demo/session";
import type {
  DemoConsultationLog,
  DemoContract,
  DemoOccupancyStatus,
  DemoPriority,
  DemoProperty,
  DemoPropertyStatus,
  DemoState,
  DemoTransactionType,
} from "@/demo/types";
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
  "MY_CONTRACT" | "OTHER_CONTRACT" | "CO_BROKERAGE" | "INTRODUCTION";

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
  if (isDemoRuntime()) {
    return buildDemoPropertiesResponse(params);
  }

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
  if (isDemoRuntime()) {
    return buildDemoPropertiesResponse(params, params.phone);
  }

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
  apartmentId: number,
): Promise<PropertyDetailInfo> => {
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    return mapDemoPropertyDetail(property, getDemoState());
  }

  const response = await apiClient.get<PropertyDetailInfo>(
    `/api/property/detail/${apartmentId}`,
  );
  return response.data;
};

/**
 * 의뢰 정보 조회 API
 * GET /api/property/requestInfo/:apartmentId
 */
export const fetchPropertyRequestInfo = async (
  apartmentId: number,
): Promise<PropertyRequestInfo> => {
  if (isDemoRuntime()) {
    return mapDemoPropertyRequestInfo(requireDemoProperty(apartmentId));
  }

  const response = await apiClient.get<PropertyRequestInfo>(
    `/api/property/requestInfo/${apartmentId}`,
  );
  return response.data;
};

/**
 * 의뢰 정보 수정 API
 * PUT /api/property/requestInfo/:apartmentId
 */
export const updatePropertyRequestInfoAPI = async (
  apartmentId: number,
  data: PropertyRequestInfo,
): Promise<PropertyRequestInfo> => {
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    const metadata = readPropertyMetadata(property);
    const updatedProperty = upsertDemoProperty({
      ...property,
      transactionType: requestTypeToDemoTransaction(
        data.requestType,
        property.transactionType,
      ),
      price: {
        sale: data.salePrice,
        jeonse: data.jeonsePrice,
        monthlyDeposit: data.monthlyDeposit,
        monthlyRent: data.monthlyRent,
      },
      availableFrom: data.availableMoveInDate || property.availableFrom,
      tags: writePropertyMetadata(property, {
        ...metadata,
        requestType: data.requestType,
        requestInfo: { ...data },
      }),
    });
    return mapDemoPropertyRequestInfo(updatedProperty);
  }

  const response = await apiClient.put<PropertyRequestInfo>(
    `/api/property/requestInfo/${apartmentId}`,
    data,
  );
  return response.data;
};

/**
 * 고객 상담 조회 API
 * GET /api/property/consultation/:apartmentId
 */
export const fetchPropertyConsultation = async (
  apartmentId: number,
): Promise<PropertyConsultationInfo> => {
  if (isDemoRuntime()) {
    return mapDemoPropertyConsultation(requireDemoProperty(apartmentId));
  }

  const response = await apiClient.get<PropertyConsultationInfo>(
    `/api/property/consultation/${apartmentId}`,
  );
  return response.data;
};

/**
 * 고객 상담 연락처 수정 API
 * PUT /api/property/consultation/:apartmentId
 */
export const updatePropertyConsultationAPI = async (
  apartmentId: number,
  data: PropertyConsultationUpdatePayload,
): Promise<PropertyConsultationInfo> => {
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    const metadata = readPropertyMetadata(property);
    const updatedProperty = upsertDemoProperty({
      ...property,
      owner: {
        ...property.owner,
        name: data.ownerName,
        phone: data.ownerPhone,
      },
      tags: writePropertyMetadata(property, {
        ...metadata,
        consultationContacts: { ...data },
      }),
    });
    const contract = getDemoContractByPropertyId(updatedProperty.id);
    if (contract) {
      upsertDemoContract({
        ...contract,
        lessorOrSeller: { ...updatedProperty.owner },
        lesseeOrBuyer:
          data.tenantName || data.tenantPhone
            ? { name: data.tenantName, phone: data.tenantPhone }
            : contract.lesseeOrBuyer,
      });
    }
    return mapDemoPropertyConsultation(updatedProperty);
  }

  const response = await apiClient.put<PropertyConsultationInfo>(
    `/api/property/consultation/${apartmentId}`,
    data,
  );
  return response.data;
};

/**
 * 고객 상담 로그 등록 API
 * POST /api/property/consultation/:apartmentId
 */
export const createPropertyConsultationLogAPI = async (
  apartmentId: number,
  data: PropertyConsultationLogPayload,
): Promise<PropertyConsultationLog> => {
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    const log = upsertDemoConsultation({
      targetType: "PROPERTY",
      targetId: property.id,
      customerType: consultationCustomerTypeToDemo(data.customerType),
      channel: "PHONE",
      content: data.content,
      writerName: getDemoOffice().representativeName,
    });
    return mapDemoConsultationLog(log);
  }

  const response = await apiClient.post<PropertyConsultationLog>(
    `/api/property/consultation/${apartmentId}`,
    data,
  );
  return response.data;
};

/**
 * 계약 정보 조회 API
 * GET /api/properties/contractInfo/:apartmentId
 */
export const fetchPropertyContractInfo = async (
  apartmentId: number,
): Promise<PropertyContractInfo> => {
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    return mapDemoPropertyContractInfo(
      property,
      getDemoContractByPropertyId(property.id),
    );
  }

  const response = await apiClient.get<PropertyContractInfo>(
    `/api/properties/contractInfo/${apartmentId}`,
  );
  return response.data;
};

/**
 * 계약 정보 수정 API
 * PUT /api/properties/contractInfo/:apartmentId
 */
export const updatePropertyContractInfoAPI = async (
  apartmentId: number,
  data: PropertyContractInfo,
): Promise<PropertyContractInfo> => {
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    const existingContract = getDemoContractByPropertyId(property.id);
    const metadata = readPropertyMetadata(property);
    const consultationContacts = metadata.consultationContacts;
    const contract = upsertDemoContract({
      ...(existingContract ?? {}),
      propertyId: property.id,
      transactionType: contractTransactionType(data, property.transactionType),
      status: existingContract?.status ?? "IN_PROGRESS",
      lessorOrSeller: { ...property.owner },
      lesseeOrBuyer: existingContract?.lesseeOrBuyer ?? {
        name: consultationContacts?.tenantName ?? "",
        phone: consultationContacts?.tenantPhone ?? "",
      },
      price: {
        sale: data.salePrice,
        jeonse: data.jeonsePrice,
        monthlyDeposit: data.deposit,
        monthlyRent: data.monthlyRent,
      },
      contractDate: data.registrationDate,
      moveInDate: existingContract?.moveInDate ?? property.availableFrom,
      expiresAt: data.expireDate,
      memo: writeContractMetadata(existingContract?.memo ?? "", data),
    });
    upsertDemoProperty({
      ...property,
      occupancyStatus: occupancyStatusToDemo(
        data.occupancyStatus,
        property.occupancyStatus,
      ),
    });
    return mapDemoPropertyContractInfo(property, contract);
  }

  const response = await apiClient.put<PropertyContractInfo>(
    `/api/properties/contractInfo/${apartmentId}`,
    data,
  );
  return response.data;
};

/**
 * 매물 상세 수정 API
 * PUT /api/property/detail/:apartmentId
 */
export const updatePropertyDetailAPI = async (
  apartmentId: number,
  data: PropertyDetailInfo,
): Promise<PropertyDetailInfo> => {
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    const metadata = readPropertyMetadata(property);
    const updatedProperty = upsertDemoProperty({
      ...property,
      direction:
        data.direction === "NONE" ? property.direction : data.direction,
      rooms: data.roomCount,
      bathrooms: data.bathroomCount,
      tags: writePropertyMetadata(property, {
        ...metadata,
        detail: { ...data },
      }),
    });
    return mapDemoPropertyDetail(updatedProperty, getDemoState());
  }

  const response = await apiClient.put<PropertyDetailInfo>(
    `/api/property/detail/${apartmentId}`,
    data,
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
  if (isDemoRuntime()) {
    const state = getDemoState();
    const complexId = apartmentComplexIdToDemoComplexId(
      apartmentComplexId,
      state.complexes.map((complex) => complex.id),
    );
    return complexId
      ? state.properties.filter((property) => property.complexId === complexId)
          .length
      : 0;
  }

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
  if (isDemoRuntime()) {
    return { apartmentId, content: requireDemoProperty(apartmentId).memo };
  }

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
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    upsertDemoProperty({ ...property, memo: content });
    return { apartmentId, content };
  }

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
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    upsertDemoProperty({ ...property, memo: content });
    return { apartmentId, content };
  }

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
  if (isDemoRuntime()) {
    return updateDemoPropertyMutation(data);
  }

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
  if (isDemoRuntime()) {
    return updateDemoPropertyMutation(data);
  }

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
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    upsertDemoProperty({
      ...property,
      isFavorite,
      priority:
        isFavorite && property.priority === "NORMAL"
          ? "ATTENTION"
          : !isFavorite && property.priority === "ATTENTION"
            ? "NORMAL"
            : property.priority,
    });
    return { apartmentId, isFavorite };
  }

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
  if (isDemoRuntime()) {
    return buildDemoPropertiesResponse(params);
  }

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
  if (isDemoRuntime()) {
    const property = requireDemoProperty(apartmentId);
    upsertDemoProperty({
      ...property,
      priority: manageTypeToDemoPriority(manageType),
      isFavorite:
        manageType === "ATTENTION"
          ? true
          : manageType === "NONE"
            ? false
            : property.isFavorite,
    });
    return { apartmentId, manageType };
  }

  const response = await apiClient.post(`/api/property/manage/${apartmentId}`, {
    manageType,
  });
  return response.data;
};

const PROPERTY_METADATA_PREFIX = "__realconnect_adapter__:";
const CONTRACT_METADATA_PREFIX = "[[realconnect_adapter:";
const CONTRACT_METADATA_SUFFIX = "]]";

interface DemoPropertyAdapterMetadata {
  propertyStatus?: PropertyStatus;
  requestType?: RequestType;
  contractDate?: string | null;
  detail?: PropertyDetailInfo;
  requestInfo?: PropertyRequestInfo;
  consultationContacts?: PropertyConsultationUpdatePayload;
}

interface DemoContractAdapterMetadata {
  contractInfo: PropertyContractInfo;
}

type DemoListParams = Pick<
  PropertiesQueryParams,
  "apartmentComplexId" | "cursorId" | "size"
> &
  Partial<
    Pick<
      PropertiesQueryParams,
      "dong" | "ho" | "area" | "propertyStatus" | "requestType" | "manageType"
    >
  >;

function buildDemoPropertiesResponse(
  params: DemoListParams,
  phone?: string,
): PropertiesResponse {
  const state = getDemoState();
  const complexId = apartmentComplexIdToDemoComplexId(
    params.apartmentComplexId,
    state.complexes.map((complex) => complex.id),
  );
  if (!complexId) return { content: [], nextCursor: null, hasNext: false };

  const normalizedPhone = normalizePhone(phone);
  const filtered = state.properties
    .filter((property) => property.complexId === complexId)
    .map((property) => mapDemoPropertyToApartment(property, state))
    .filter((apartment) => {
      const property = apartment.property;
      if (!property) return false;
      if (
        params.dong &&
        !apartment.dong.includes(stripUnitSuffix(params.dong))
      ) {
        return false;
      }
      if (params.ho && !apartment.ho.includes(stripUnitSuffix(params.ho))) {
        return false;
      }
      if (params.area !== undefined && apartment.area !== params.area) {
        return false;
      }
      if (
        params.propertyStatus !== undefined &&
        property.propertyStatus !== params.propertyStatus
      ) {
        return false;
      }
      if (
        params.requestType !== undefined &&
        property.requestType !== params.requestType
      ) {
        return false;
      }
      if (
        params.manageType !== undefined &&
        property.manageType !== params.manageType
      ) {
        return false;
      }
      if (
        normalizedPhone &&
        !demoPropertyPhoneValues(apartment.apartmentId, state).some((value) =>
          normalizePhone(value).includes(normalizedPhone),
        )
      ) {
        return false;
      }
      return true;
    });

  const cursorIndex = params.cursorId
    ? filtered.findIndex(
        (apartment) => apartment.apartmentId === params.cursorId,
      )
    : -1;
  const start = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  const size = Math.min(Math.max(Math.trunc(params.size ?? 30), 1), 100);
  const content = filtered.slice(start, start + size);
  const hasNext = start + content.length < filtered.length;

  return {
    content,
    nextCursor:
      hasNext && content.length > 0
        ? content[content.length - 1].apartmentId
        : null,
    hasNext,
  };
}

function mapDemoPropertyToApartment(
  property: DemoProperty,
  state: DemoState,
): ApartmentWithProperty {
  const complex = state.complexes.find(
    (candidate) => candidate.id === property.complexId,
  );
  const contract = state.contracts.find(
    (candidate) => candidate.propertyId === property.id,
  );
  const metadata = readPropertyMetadata(property);

  return {
    apartmentId: demoPropertyIdToApartmentId(property.id),
    apartmentName: complex?.name ?? "",
    dong: stripUnitSuffix(property.building),
    ho: stripUnitSuffix(property.unit),
    area: property.supplyArea,
    direction: property.direction,
    img: "",
    type: `전용 ${property.exclusiveArea}㎡`,
    isFavorite: property.isFavorite,
    property: {
      salePrice: property.price.sale,
      jeonsePrice: property.price.jeonse,
      deposit: property.price.monthlyDeposit,
      monthPrice: property.price.monthlyRent,
      propertyStatus:
        metadata.propertyStatus ?? demoStatusToPropertyStatus(property.status),
      requestType:
        metadata.requestType ??
        demoTransactionToRequestType(property.transactionType),
      manageType: demoPriorityToManageType(property.priority),
      ownerName: property.owner.name,
      ownerPhone: property.owner.phone,
      contractDate: metadata.contractDate ?? contract?.contractDate ?? "",
      memo: property.memo,
      occupancyStatus: demoOccupancyToOccupancyStatus(property.occupancyStatus),
      contractSalePrice: contract?.price.sale ?? 0,
      currentTenant: contract?.lesseeOrBuyer.name ?? "",
      contractJeonsePrice: contract?.price.jeonse ?? 0,
      contractDeposit: contract?.price.monthlyDeposit ?? 0,
      contractMonthlyRent: contract?.price.monthlyRent ?? 0,
      expireDate: contract?.expiresAt ?? "",
      requestRegistrationDate:
        metadata.requestInfo?.registeredAt ?? dateOnly(property.registeredAt),
    },
  };
}

function mapDemoPropertyDetail(
  property: DemoProperty,
  state: DemoState,
): PropertyDetailInfo {
  const complex = state.complexes.find(
    (candidate) => candidate.id === property.complexId,
  );
  const stored = readPropertyMetadata(property).detail;
  const derivedFloorLevel =
    property.floor / Math.max(property.totalFloor, 1) >= 0.67
      ? "HIGH"
      : property.floor / Math.max(property.totalFloor, 1) >= 0.34
        ? "MIDDLE"
        : "LOW";

  return {
    direction: property.direction,
    directionBase: "LIVING_ROOM",
    floorLevel: derivedFloorLevel,
    roomCount: property.rooms,
    bathroomCount: property.bathrooms,
    totalParking: Math.round(
      (complex?.totalHouseholds ?? 0) * (complex?.parkingPerHousehold ?? 0),
    ),
    parkingPerHousehold: complex?.parkingPerHousehold ?? 0,
    structureType: "SINGLE",
    entranceType: "STAIR",
    mainUsage: "RESIDENTIAL",
    ...stored,
  };
}

function mapDemoPropertyRequestInfo(
  property: DemoProperty,
): PropertyRequestInfo {
  const metadata = readPropertyMetadata(property);
  return {
    requestType:
      metadata.requestType ??
      demoTransactionToRequestType(property.transactionType),
    loanAmount: 0,
    loanState: "NONE",
    immediateMoveIn: property.tags.includes("즉시입주"),
    availableMoveInDate: property.availableFrom,
    registeredAt: dateOnly(property.registeredAt),
    salePrice: property.price.sale,
    existingJeonseDeposit: 0,
    existingMonthlyRent: 0,
    jeonsePrice: property.price.jeonse,
    monthlyDeposit: property.price.monthlyDeposit,
    monthlyRent: property.price.monthlyRent,
    ...metadata.requestInfo,
  };
}

function mapDemoPropertyConsultation(
  property: DemoProperty,
): PropertyConsultationInfo {
  const state = getDemoState();
  const metadata = readPropertyMetadata(property);
  const contract = state.contracts.find(
    (candidate) => candidate.propertyId === property.id,
  );
  const contacts = metadata.consultationContacts;
  const logs = state.consultations
    .filter(
      (log) => log.targetType === "PROPERTY" && log.targetId === property.id,
    )
    .sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt) ||
        left.id.localeCompare(right.id),
    )
    .map(mapDemoConsultationLog);

  return {
    id: demoPropertyIdToApartmentId(property.id),
    ownerName: contacts?.ownerName ?? property.owner.name,
    ownerPhone: contacts?.ownerPhone ?? property.owner.phone,
    tenantName: contacts?.tenantName ?? contract?.lesseeOrBuyer.name ?? "",
    tenantPhone: contacts?.tenantPhone ?? contract?.lesseeOrBuyer.phone ?? "",
    etcName: contacts?.etcName ?? "",
    etcPhone: contacts?.etcPhone ?? "",
    createdAt: property.registeredAt,
    updatedAt: logs[0]?.createdAt ?? property.updatedAt,
    logs,
  };
}

function mapDemoConsultationLog(
  log: DemoConsultationLog,
): PropertyConsultationLog {
  return {
    id: trailingDemoEntityNumber(log.id),
    customerType:
      log.customerType === "OWNER"
        ? "OWNER"
        : log.customerType === "TENANT"
          ? "TENENT"
          : "ETC",
    content: log.content,
    writerName: log.writerName,
    createdAt: log.createdAt,
  };
}

function mapDemoPropertyContractInfo(
  property: DemoProperty,
  contract: DemoContract | null,
): PropertyContractInfo {
  const stored = contract ? readContractMetadata(contract.memo) : null;
  if (stored) return stored.contractInfo;

  return {
    occupancyStatus: demoOccupancyToOccupancyStatus(property.occupancyStatus),
    salePrice: contract?.price.sale ?? 0,
    loanAmount: 0,
    jeonsePrice: contract?.price.jeonse ?? 0,
    deposit: contract?.price.monthlyDeposit ?? 0,
    monthlyRent: contract?.price.monthlyRent ?? 0,
    maintenanceFee: 0,
    expireDate: contract?.expiresAt ?? "",
    registrationDate: contract?.contractDate ?? "",
    contractOffice: contract ? getDemoOffice().name : "",
    contractType: "MY_CONTRACT",
  };
}

function updateDemoPropertyMutation(data: PropertyMutationPayload) {
  const property = requireDemoProperty(data.apartmentId);
  const metadata = readPropertyMetadata(property);
  const requestInfo = metadata.requestInfo
    ? {
        ...metadata.requestInfo,
        requestType: data.requestType,
        salePrice: data.salePrice,
        jeonsePrice: data.jeonsePrice,
        monthlyDeposit: data.deposit,
        monthlyRent: data.monthPrice,
      }
    : undefined;

  upsertDemoProperty({
    ...property,
    transactionType: requestTypeToDemoTransaction(
      data.requestType,
      property.transactionType,
    ),
    status: propertyStatusToDemoStatus(data.propertyStatus),
    priority: manageTypeToDemoPriority(data.manageType),
    isFavorite:
      data.manageType === "ATTENTION"
        ? true
        : data.manageType === "NONE"
          ? false
          : property.isFavorite,
    price: {
      sale: data.salePrice,
      jeonse: data.jeonsePrice,
      monthlyDeposit: data.deposit,
      monthlyRent: data.monthPrice,
    },
    owner: {
      ...property.owner,
      name: data.ownerName,
      phone: data.ownerPhone,
    },
    tags: writePropertyMetadata(property, {
      ...metadata,
      propertyStatus: data.propertyStatus,
      requestType: data.requestType,
      contractDate: data.contractDate,
      requestInfo,
    }),
  });

  const contract = getDemoContractByPropertyId(property.id);
  if (contract && data.contractDate) {
    upsertDemoContract({ ...contract, contractDate: data.contractDate });
  }

  return {
    propertyStatus: data.propertyStatus,
    requestType: data.requestType,
    manageType: data.manageType,
    ownerName: data.ownerName,
    ownerPhone: data.ownerPhone,
    salePrice: data.salePrice,
    jeonsePrice: data.jeonsePrice,
    deposit: data.deposit,
    monthPrice: data.monthPrice,
    apartmentId: data.apartmentId,
  };
}

function requireDemoProperty(apartmentId: number): DemoProperty {
  const property = getDemoProperty(apartmentIdToDemoPropertyId(apartmentId));
  if (!property) {
    throw new Error(`Demo property not found: ${apartmentId}`);
  }
  return property;
}

function readPropertyMetadata(
  property: DemoProperty,
): DemoPropertyAdapterMetadata {
  const encoded = property.tags
    .find((tag) => tag.startsWith(PROPERTY_METADATA_PREFIX))
    ?.slice(PROPERTY_METADATA_PREFIX.length);
  if (!encoded) return {};

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(encoded));
    return isRecord(parsed) ? (parsed as DemoPropertyAdapterMetadata) : {};
  } catch {
    return {};
  }
}

function writePropertyMetadata(
  property: DemoProperty,
  metadata: DemoPropertyAdapterMetadata,
): string[] {
  const visibleTags = property.tags.filter(
    (tag) => !tag.startsWith(PROPERTY_METADATA_PREFIX),
  );
  return [
    ...visibleTags,
    `${PROPERTY_METADATA_PREFIX}${encodeURIComponent(JSON.stringify(metadata))}`,
  ];
}

function readContractMetadata(
  memo: string,
): DemoContractAdapterMetadata | null {
  const start = memo.lastIndexOf(CONTRACT_METADATA_PREFIX);
  if (start < 0 || !memo.endsWith(CONTRACT_METADATA_SUFFIX)) return null;
  const encoded = memo.slice(
    start + CONTRACT_METADATA_PREFIX.length,
    -CONTRACT_METADATA_SUFFIX.length,
  );

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(encoded));
    return isRecord(parsed) && isRecord(parsed.contractInfo)
      ? (parsed as unknown as DemoContractAdapterMetadata)
      : null;
  } catch {
    return null;
  }
}

function writeContractMetadata(
  memo: string,
  contractInfo: PropertyContractInfo,
): string {
  const markerIndex = memo.lastIndexOf(CONTRACT_METADATA_PREFIX);
  const visibleMemo = (
    markerIndex >= 0 ? memo.slice(0, markerIndex) : memo
  ).trimEnd();
  const encoded = encodeURIComponent(JSON.stringify({ contractInfo }));
  return `${visibleMemo}${visibleMemo ? "\n\n" : ""}${CONTRACT_METADATA_PREFIX}${encoded}${CONTRACT_METADATA_SUFFIX}`;
}

function demoPropertyPhoneValues(
  apartmentId: number,
  state: DemoState,
): string[] {
  const propertyId = apartmentIdToDemoPropertyId(apartmentId);
  const property = state.properties.find(
    (candidate) => candidate.id === propertyId,
  );
  if (!property) return [];
  const contacts = readPropertyMetadata(property).consultationContacts;
  const contract = state.contracts.find(
    (candidate) => candidate.propertyId === propertyId,
  );
  return [
    property.owner.phone,
    contacts?.ownerPhone,
    contacts?.tenantPhone,
    contacts?.etcPhone,
    contract?.lessorOrSeller.phone,
    contract?.lesseeOrBuyer.phone,
  ].filter((value): value is string => Boolean(value));
}

function normalizePhone(value?: string): string {
  return value?.replace(/[^0-9]/g, "") ?? "";
}

function stripUnitSuffix(value: string): string {
  return value.trim().replace(/[동호]$/, "");
}

function dateOnly(value: string): string {
  return value.includes("T") ? value.slice(0, 10) : value;
}

function trailingDemoEntityNumber(id: string): number {
  const match = id.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function demoTransactionToRequestType(
  transactionType: DemoTransactionType,
): RequestType {
  return transactionType;
}

function requestTypeToDemoTransaction(
  requestType: RequestType,
  fallback: DemoTransactionType,
): DemoTransactionType {
  if (requestType.includes("SALE")) return "SALE";
  if (requestType.includes("JEONSE")) return "JEONSE";
  if (requestType.includes("MONTHLY")) return "MONTHLY";
  return fallback;
}

function demoPriorityToManageType(priority: DemoPriority): ManageType {
  if (priority === "ATTENTION") return "ATTENTION";
  if (priority === "CAUTION") return "CAUTION";
  return "NONE";
}

function manageTypeToDemoPriority(manageType: ManageType): DemoPriority {
  if (manageType === "ATTENTION") return "ATTENTION";
  if (manageType === "CAUTION") return "CAUTION";
  return "NORMAL";
}

function demoStatusToPropertyStatus(
  status: DemoPropertyStatus,
): PropertyStatus {
  if (status === "COMPLETED") return "COMPLETED";
  if (status === "CONSULTING" || status === "CONTRACTING") return "PROGRESS";
  if (status === "HOLD") return "BEFORE";
  return "ADVERTISING";
}

function propertyStatusToDemoStatus(
  status: PropertyStatus,
): DemoPropertyStatus {
  if (status === "COMPLETED") return "COMPLETED";
  if (status === "PROGRESS") return "CONSULTING";
  if (status === "BEFORE" || status === "NONE") return "HOLD";
  return "AVAILABLE";
}

function demoOccupancyToOccupancyStatus(
  status: DemoOccupancyStatus,
): OccupancyStatus {
  if (status === "OWNER_OCCUPIED") return "SELF";
  if (status === "MONTHLY") return "MONTHLY_RENT";
  return status;
}

function occupancyStatusToDemo(
  status: OccupancyStatus,
  fallback: DemoOccupancyStatus,
): DemoOccupancyStatus {
  if (status === "SELF") return "OWNER_OCCUPIED";
  if (status === "MONTHLY_RENT") return "MONTHLY";
  if (status === "JEONSE" || status === "VACANT") return status;
  return fallback;
}

function consultationCustomerTypeToDemo(
  customerType: ConsultationCustomerType,
): DemoConsultationLog["customerType"] {
  if (customerType === "OWNER") return "OWNER";
  if (customerType === "TENENT") return "TENANT";
  return "OTHER";
}

function contractTransactionType(
  data: PropertyContractInfo,
  fallback: DemoTransactionType,
): DemoTransactionType {
  if (data.salePrice > 0) return "SALE";
  if (data.jeonsePrice > 0) return "JEONSE";
  if (data.deposit > 0 || data.monthlyRent > 0) return "MONTHLY";
  return fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
