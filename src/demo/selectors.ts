import type {
  DemoComplex,
  DemoConsultationListQuery,
  DemoConsultationLog,
  DemoDashboardMetrics,
  DemoInquiry,
  DemoInquiryListQuery,
  DemoPage,
  DemoProperty,
  DemoPropertyListQuery,
  DemoState,
  DemoContract,
} from "./types";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export function selectComplexById(
  state: DemoState,
  complexId: string,
): DemoComplex | null {
  return state.complexes.find((complex) => complex.id === complexId) ?? null;
}

export function selectPropertyById(
  state: DemoState,
  propertyId: string,
): DemoProperty | null {
  return state.properties.find((property) => property.id === propertyId) ?? null;
}

export function selectInquiryById(
  state: DemoState,
  inquiryId: string,
): DemoInquiry | null {
  return state.inquiries.find((inquiry) => inquiry.id === inquiryId) ?? null;
}

export function selectContractByPropertyId(
  state: DemoState,
  propertyId: string,
): DemoContract | null {
  return (
    state.contracts.find((contract) => contract.propertyId === propertyId) ?? null
  );
}

export function selectConsultations(
  state: DemoState,
  query: DemoConsultationListQuery = {},
): DemoConsultationLog[] {
  return state.consultations
    .filter((log) => {
      if (query.targetType && log.targetType !== query.targetType) return false;
      if (query.targetId && log.targetId !== query.targetId) return false;
      if (query.channel && log.channel !== query.channel) return false;
      return true;
    })
    .sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt) ||
        left.id.localeCompare(right.id),
    );
}

export function getPropertyPrimaryPrice(property: DemoProperty): number {
  if (property.transactionType === "SALE") return property.price.sale;
  if (property.transactionType === "JEONSE") return property.price.jeonse;
  return property.price.monthlyRent;
}

export function selectPropertiesPage(
  state: DemoState,
  query: DemoPropertyListQuery = {},
): DemoPage<DemoProperty> {
  const complexesById = new Map(
    state.complexes.map((complex) => [complex.id, complex]),
  );
  const normalizedSearch = normalizeSearch(query.search);

  const items = state.properties
    .filter((property) => {
      const complex = complexesById.get(property.complexId);
      if (
        normalizedSearch &&
        !propertySearchText(property, complex).includes(normalizedSearch)
      ) {
        return false;
      }
      if (query.complexId && property.complexId !== query.complexId) return false;
      if (
        query.transactionType &&
        property.transactionType !== query.transactionType
      ) {
        return false;
      }
      if (query.status && property.status !== query.status) return false;
      if (query.priority && property.priority !== query.priority) return false;
      if (query.favoriteOnly && !property.isFavorite) return false;
      if (
        query.minArea !== undefined &&
        property.exclusiveArea < query.minArea
      ) {
        return false;
      }
      if (
        query.maxArea !== undefined &&
        property.exclusiveArea > query.maxArea
      ) {
        return false;
      }

      const price = getPropertyPrimaryPrice(property);
      if (query.minPrice !== undefined && price < query.minPrice) return false;
      if (query.maxPrice !== undefined && price > query.maxPrice) return false;
      return true;
    })
    .sort(propertyComparator(query));

  return paginate(items, query.page, query.pageSize);
}

export function selectInquiriesPage(
  state: DemoState,
  query: DemoInquiryListQuery = {},
): DemoPage<DemoInquiry> {
  const normalizedSearch = normalizeSearch(query.search);
  const items = state.inquiries
    .filter((inquiry) => {
      if (
        normalizedSearch &&
        !inquirySearchText(inquiry).includes(normalizedSearch)
      ) {
        return false;
      }
      if (
        query.transactionType &&
        inquiry.transactionType !== query.transactionType
      ) {
        return false;
      }
      if (query.status && inquiry.status !== query.status) return false;
      if (query.priority && inquiry.priority !== query.priority) return false;
      if (
        query.complexId &&
        !inquiry.desiredComplexIds.includes(query.complexId)
      ) {
        return false;
      }
      if (
        query.minArea !== undefined &&
        inquiry.area.max < query.minArea
      ) {
        return false;
      }
      if (
        query.maxArea !== undefined &&
        inquiry.area.min > query.maxArea
      ) {
        return false;
      }
      return true;
    })
    .sort(inquiryComparator(query));

  return paginate(items, query.page, query.pageSize);
}

export function selectDashboardMetrics(state: DemoState): DemoDashboardMetrics {
  return {
    totalProperties: state.properties.length,
    activeProperties: state.properties.filter(
      (property) =>
        property.status !== "COMPLETED" && property.status !== "HOLD",
    ).length,
    favoriteProperties: state.properties.filter(
      (property) => property.isFavorite,
    ).length,
    activeInquiries: state.inquiries.filter(
      (inquiry) =>
        inquiry.status !== "COMPLETED" && inquiry.status !== "ON_HOLD",
    ).length,
    scheduledVisits: state.inquiries.filter(
      (inquiry) => inquiry.status === "VISIT_SCHEDULED",
    ).length,
    contractsInProgress: state.contracts.filter(
      (contract) =>
        contract.status === "DRAFT" || contract.status === "IN_PROGRESS",
    ).length,
    completedContracts: state.contracts.filter(
      (contract) => contract.status === "SIGNED",
    ).length,
    consultationCount: state.consultations.length,
  };
}

function normalizeSearch(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase("ko-KR") ?? "";
}

function propertySearchText(
  property: DemoProperty,
  complex: DemoComplex | undefined,
): string {
  return normalizeSearch(
    [
      property.id,
      complex?.name,
      complex?.address,
      complex?.legalDong,
      property.building,
      property.unit,
      property.owner.name,
      property.owner.phone,
      property.memo,
      ...property.tags,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function inquirySearchText(inquiry: DemoInquiry): string {
  return normalizeSearch(
    [
      inquiry.id,
      inquiry.title,
      inquiry.customer.name,
      inquiry.customer.phone,
      inquiry.publicDescription,
      inquiry.privateNote,
      ...inquiry.desiredDistricts,
      ...inquiry.desiredDongs,
    ].join(" "),
  );
}

function propertyComparator(query: DemoPropertyListQuery) {
  const sortBy = query.sortBy ?? "updatedAt";
  const direction = query.sortOrder === "asc" ? 1 : -1;

  return (left: DemoProperty, right: DemoProperty): number => {
    let comparison: number;
    if (sortBy === "area") {
      comparison = left.exclusiveArea - right.exclusiveArea;
    } else if (sortBy === "price") {
      comparison =
        getPropertyPrimaryPrice(left) - getPropertyPrimaryPrice(right);
    } else {
      comparison = left[sortBy].localeCompare(right[sortBy]);
    }

    return comparison * direction || left.id.localeCompare(right.id);
  };
}

function inquiryComparator(query: DemoInquiryListQuery) {
  const sortBy = query.sortBy ?? "updatedAt";
  const direction = query.sortOrder === "asc" ? 1 : -1;

  return (left: DemoInquiry, right: DemoInquiry): number => {
    const comparison =
      sortBy === "area"
        ? rangeMidpoint(left.area) - rangeMidpoint(right.area)
        : left[sortBy].localeCompare(right[sortBy]);
    return comparison * direction || left.id.localeCompare(right.id);
  };
}

function rangeMidpoint(range: { min: number; max: number }): number {
  return (range.min + range.max) / 2;
}

function paginate<T>(
  items: T[],
  requestedPage = 1,
  requestedPageSize = DEFAULT_PAGE_SIZE,
): DemoPage<T> {
  const pageSize = positiveInteger(
    requestedPageSize,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = positiveInteger(requestedPage, 1, totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };
}

function positiveInteger(value: number, fallback: number, maximum: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(1, Math.trunc(value)));
}
