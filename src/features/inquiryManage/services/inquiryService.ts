import {
  deleteDemoInquiry,
  getDemoInquiry,
  getDemoState,
  listDemoComplexes,
  listDemoInquiries,
  upsertDemoInquiry,
} from "@/demo/repository";
import { rankPropertyMatches } from "@/demo/matching";
import { isDemoRuntime } from "@/demo/session";
import type {
  DemoInquiry,
  DemoInquiryBudget,
  DemoInquiryStatus,
  DemoPriority,
} from "@/demo/types";
import apiClient from "@/shared/api/client";
import type {
  CreateInquiryPayload,
  CreateInquiryResponse,
  InquiriesQueryParams,
  InquiriesResponse,
  Inquiry,
  InquiryStatus,
  ManageType,
} from "../types/inquiry";

export interface InquiryPropertyMatch {
  apartmentId: number;
  complexName: string;
  building: string;
  unit: string;
  transactionType: DemoInquiry["transactionType"];
  score: number;
  isRecommended: boolean;
  reasons: Array<{
    message: string;
    level: "match" | "partial" | "miss";
  }>;
  price: {
    sale: number;
    jeonse: number;
    monthlyDeposit: number;
    monthlyRent: number;
  };
  exclusiveArea: number;
}

export interface InquiryDetailData {
  inquiry: DemoInquiry;
  desiredComplexNames: string[];
  matches: InquiryPropertyMatch[];
}

export async function fetchInquiries(
  params: InquiriesQueryParams = {},
): Promise<InquiriesResponse> {
  if (!isDemoRuntime()) {
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
  }

  const requestedPage = Math.max(0, params.page ?? 0);
  const requestedSize = Math.max(1, params.size ?? 10);
  const demoPage = listDemoInquiries({
    search: params.keyword,
    transactionType: params.requestType,
    status: params.inquiryStatus as DemoInquiryStatus | undefined,
    priority: params.manageType as DemoPriority | undefined,
    minArea: params.minArea,
    maxArea: params.maxArea,
    page: 1,
    pageSize: 100,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });
  const filtered = demoPage.items.filter((inquiry) =>
    matchesPriceFilter(inquiry, params.minPrice, params.maxPrice),
  );
  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / requestedSize));
  const currentPage = Math.min(requestedPage, totalPages - 1);
  const start = currentPage * requestedSize;

  return {
    content: filtered.slice(start, start + requestedSize).map(toInquiryView),
    currentPage,
    totalPages,
    totalElements,
    size: requestedSize,
    first: currentPage === 0,
    last: currentPage >= totalPages - 1,
  };
}

export async function createInquiry(
  payload: CreateInquiryPayload,
): Promise<CreateInquiryResponse> {
  if (!isDemoRuntime()) {
    const response = await apiClient.post<CreateInquiryResponse>(
      "/api/inquiries/create",
      payload,
    );
    return response.data;
  }

  validateDemoCreatePayload(payload);

  const complexes = listDemoComplexes();
  const desiredComplexIds = complexes
    .filter((complex) => complex.name === payload.complexName)
    .map((complex) => complex.id);
  const customer = payload.inquirerInfo[0]!;
  const inquiry = upsertDemoInquiry({
    title: payload.title.trim() || "새 고객 문의",
    customer: {
      name: customer.inquirerName,
      phone: customer.contractPhone,
      relation: customer.inquirerRelation,
    },
    propertyType: "APARTMENT",
    transactionType: payload.requestType,
    status: "NEW",
    priority: "NORMAL",
    desiredComplexIds,
    desiredDistricts: [payload.sigungu].filter(Boolean),
    desiredDongs: [payload.dong].filter(Boolean),
    area: normalizeRange(payload.minArea, payload.maxArea),
    budget: createBudget(payload),
    moveInBy: payload.moveInBy?.trim() ?? "",
    publicDescription: payload.publicDescription,
    privateNote: payload.privateNote,
  });

  return {
    message: "문의가 샘플 원장에 저장되었습니다.",
    data: numericId(inquiry.id),
  };
}

export async function deleteInquiry(inquiryId: number): Promise<void> {
  if (isDemoRuntime()) {
    deleteDemoInquiry(entityId("inquiry", inquiryId));
    return;
  }
  await apiClient.delete(`/api/inquiries/${inquiryId}`);
}

export async function updateInquiryManageType(
  inquiryId: number,
  manageType: ManageType,
): Promise<void> {
  if (!isDemoRuntime()) {
    await apiClient.patch(`/api/inquiries/${inquiryId}`, { manageType });
    return;
  }
  const inquiry = requireDemoInquiry(inquiryId);
  upsertDemoInquiry({
    ...inquiry,
    priority: manageType === "NONE" ? "NORMAL" : manageType,
  });
}

export async function updateInquiryStatus(
  inquiryId: number,
  status: InquiryStatus,
): Promise<void> {
  if (!isDemoRuntime()) {
    await apiClient.patch(`/api/inquiries/${inquiryId}`, {
      inquiryStatus: status,
    });
    return;
  }
  const inquiry = requireDemoInquiry(inquiryId);
  upsertDemoInquiry({
    ...inquiry,
    status: status as DemoInquiryStatus,
  });
}

export async function fetchInquiryDetail(
  inquiryId: number,
): Promise<InquiryDetailData> {
  if (!isDemoRuntime()) {
    throw new Error("문의-매물 추천은 포트폴리오 데모 모드에서 제공됩니다.");
  }

  const state = getDemoState();
  const inquiry = state.inquiries.find(
    (candidate) => candidate.id === entityId("inquiry", inquiryId),
  );
  if (!inquiry) throw new Error("문의 정보를 찾을 수 없습니다.");

  const complexesById = new Map(
    state.complexes.map((complex) => [complex.id, complex]),
  );
  const propertiesById = new Map(
    state.properties.map((property) => [property.id, property]),
  );
  const matches = rankPropertyMatches(
    inquiry,
    state.properties.filter(
      (property) =>
        property.status !== "COMPLETED" && property.status !== "HOLD",
    ),
    state.complexes,
    { minimumScore: 35, limit: 5 },
  ).flatMap((match) => {
    const property = propertiesById.get(match.propertyId);
    if (!property) return [];
    return [
      {
        apartmentId: numericId(property.id),
        complexName:
          complexesById.get(property.complexId)?.name ?? "단지 정보 없음",
        building: property.building,
        unit: property.unit,
        transactionType: property.transactionType,
        score: match.score,
        isRecommended: match.isRecommended,
        reasons: match.reasons.map((reason) => ({
          message: reason.message,
          level: matchReasonLevel(reason.score, reason.maxScore),
        })),
        price: property.price,
        exclusiveArea: property.exclusiveArea,
      },
    ];
  });

  return {
    inquiry,
    desiredComplexNames: inquiry.desiredComplexIds.map(
      (id) => complexesById.get(id)?.name ?? id,
    ),
    matches,
  };
}

function toInquiryView(inquiry: DemoInquiry): Inquiry {
  return {
    inquiryId: numericId(inquiry.id),
    requestType: inquiry.transactionType,
    propertyType: inquiry.propertyType,
    inquirerInfo: {
      inquirerName: inquiry.customer.name,
      inquirerRelation: inquiry.customer.relation,
      contractPhone: inquiry.customer.phone,
    },
    inquiryStatus: inquiry.status,
    createdDate: inquiry.createdAt,
    manageType: inquiry.priority === "NORMAL" ? "NONE" : inquiry.priority,
    dong: inquiry.desiredDongs.join(", "),
    title: inquiry.title,
    specs: {
      minArea: inquiry.area.min,
      maxArea: inquiry.area.max,
      minSalePrice: inquiry.budget.sale?.min ?? 0,
      maxSalePrice: inquiry.budget.sale?.max ?? 0,
      minDeposit:
        inquiry.budget.jeonse?.min ?? inquiry.budget.monthlyDeposit?.min ?? 0,
      maxDeposit:
        inquiry.budget.jeonse?.max ?? inquiry.budget.monthlyDeposit?.max ?? 0,
      minMonthlyPrice: inquiry.budget.monthlyRent?.min ?? 0,
      maxMonthlyPrice: inquiry.budget.monthlyRent?.max ?? 0,
    },
  };
}

function createBudget(payload: CreateInquiryPayload): DemoInquiryBudget {
  return {
    sale:
      payload.requestType === "SALE"
        ? normalizeRange(payload.minSalePrice, payload.maxSalePrice)
        : null,
    jeonse:
      payload.requestType === "JEONSE"
        ? normalizeRange(payload.minDeposit, payload.maxDeposit)
        : null,
    monthlyDeposit:
      payload.requestType === "MONTHLY"
        ? normalizeRange(payload.minDeposit, payload.maxDeposit)
        : null,
    monthlyRent:
      payload.requestType === "MONTHLY"
        ? normalizeRange(payload.minMonthlyPrice, payload.maxMonthlyPrice)
        : null,
  };
}

function normalizeRange(min: number, max: number) {
  const normalizedMin = Math.max(0, Math.min(min || max, max || min));
  const normalizedMax = Math.max(normalizedMin, min, max);
  return { min: normalizedMin, max: normalizedMax };
}

function matchReasonLevel(
  score: number,
  maxScore: number,
): InquiryPropertyMatch["reasons"][number]["level"] {
  if (score === maxScore) return "match";
  return score > 0 ? "partial" : "miss";
}

function validateDemoCreatePayload(payload: CreateInquiryPayload): void {
  if (payload.propertyType !== "APARTMENT") {
    throw new Error("포트폴리오 데모는 아파트 문의만 지원합니다.");
  }

  const customer = payload.inquirerInfo[0];
  if (!customer?.inquirerName.trim() || !customer.contractPhone.trim()) {
    throw new Error("첫 번째 문의자의 이름과 연락처는 필수입니다.");
  }

  if (!payload.title.trim()) {
    throw new Error("문의 제목은 필수입니다.");
  }

  const numericValues = [
    payload.minArea,
    payload.maxArea,
    payload.minSalePrice,
    payload.maxSalePrice,
    payload.minDeposit,
    payload.maxDeposit,
    payload.minMonthlyPrice,
    payload.maxMonthlyPrice,
  ];
  if (numericValues.some((value) => !Number.isFinite(value))) {
    throw new Error("면적과 가격에는 유효한 숫자만 입력할 수 있습니다.");
  }

  if (
    payload.moveInBy &&
    !/^\d{4}-\d{2}-\d{2}$/.test(payload.moveInBy.trim())
  ) {
    throw new Error("입주 희망일 형식이 올바르지 않습니다.");
  }
}

function matchesPriceFilter(
  inquiry: DemoInquiry,
  minPrice?: number,
  maxPrice?: number,
): boolean {
  if (minPrice === undefined && maxPrice === undefined) return true;
  const range = getPrimaryBudget(inquiry);
  if (!range) return false;
  if (minPrice !== undefined && range.max < minPrice) return false;
  if (maxPrice !== undefined && range.min > maxPrice) return false;
  return true;
}

function getPrimaryBudget(inquiry: DemoInquiry) {
  if (inquiry.transactionType === "SALE") return inquiry.budget.sale;
  if (inquiry.transactionType === "JEONSE") return inquiry.budget.jeonse;
  return inquiry.budget.monthlyRent;
}

function requireDemoInquiry(inquiryId: number): DemoInquiry {
  const inquiry = getDemoInquiry(entityId("inquiry", inquiryId));
  if (!inquiry) throw new Error("문의 정보를 찾을 수 없습니다.");
  return inquiry;
}

function entityId(prefix: "inquiry", id: number): string {
  return `${prefix}-${String(id).padStart(3, "0")}`;
}

function numericId(id: string): number {
  const value = Number(id.match(/(\d+)$/)?.[1]);
  if (!Number.isFinite(value)) throw new Error(`Invalid demo entity id: ${id}`);
  return value;
}
