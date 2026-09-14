export const DEMO_SCHEMA_VERSION = 1 as const;

export type DemoTransactionType = "SALE" | "JEONSE" | "MONTHLY";
export type DemoPropertyType = "APARTMENT";
export type DemoPriority = "NORMAL" | "ATTENTION" | "CAUTION";
export type DemoDirection =
  | "EAST"
  | "WEST"
  | "SOUTH"
  | "NORTH"
  | "SOUTHEAST"
  | "SOUTHWEST"
  | "NORTHEAST"
  | "NORTHWEST";
export type DemoOccupancyStatus =
  "OWNER_OCCUPIED" | "JEONSE" | "MONTHLY" | "VACANT";
export type DemoPropertyStatus =
  "AVAILABLE" | "CONSULTING" | "CONTRACTING" | "COMPLETED" | "HOLD";
export type DemoInquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "VISIT_SCHEDULED"
  | "NEGOTIATING"
  | "COMPLETED"
  | "ON_HOLD";
export type DemoContractStatus =
  "DRAFT" | "IN_PROGRESS" | "SIGNED" | "CANCELLED";

export interface DemoOffice {
  id: string;
  name: string;
  representativeName: string;
  registrationNumber: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  introduction: string;
}

export interface DemoComplex {
  id: string;
  name: string;
  address: string;
  district: string;
  legalDong: string;
  builtYear: number;
  totalHouseholds: number;
  parkingPerHousehold: number;
}

/** All monetary values are expressed in 만원 (KRW 10,000). */
export interface DemoPriceTerms {
  sale: number;
  jeonse: number;
  monthlyDeposit: number;
  monthlyRent: number;
}

export interface DemoContact {
  name: string;
  phone: string;
  relation?: string;
}

export interface DemoProperty {
  id: string;
  complexId: string;
  propertyType: DemoPropertyType;
  building: string;
  unit: string;
  floor: number;
  totalFloor: number;
  supplyArea: number;
  exclusiveArea: number;
  rooms: number;
  bathrooms: number;
  direction: DemoDirection;
  transactionType: DemoTransactionType;
  status: DemoPropertyStatus;
  priority: DemoPriority;
  price: DemoPriceTerms;
  owner: DemoContact;
  occupancyStatus: DemoOccupancyStatus;
  availableFrom: string;
  registeredAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
  memo: string;
}

export interface DemoRange {
  min: number;
  max: number;
}

export interface DemoInquiryBudget {
  sale: DemoRange | null;
  jeonse: DemoRange | null;
  monthlyDeposit: DemoRange | null;
  monthlyRent: DemoRange | null;
}

export interface DemoInquiry {
  id: string;
  title: string;
  customer: DemoContact;
  propertyType: DemoPropertyType;
  transactionType: DemoTransactionType;
  status: DemoInquiryStatus;
  priority: DemoPriority;
  desiredComplexIds: string[];
  desiredDistricts: string[];
  desiredDongs: string[];
  area: DemoRange;
  budget: DemoInquiryBudget;
  moveInBy: string;
  publicDescription: string;
  privateNote: string;
  createdAt: string;
  updatedAt: string;
}

export type DemoConsultationTargetType = "PROPERTY" | "INQUIRY";
export type DemoConsultationChannel = "PHONE" | "VISIT" | "MESSAGE" | "EMAIL";

export interface DemoConsultationLog {
  id: string;
  targetType: DemoConsultationTargetType;
  targetId: string;
  customerType: "OWNER" | "BUYER" | "TENANT" | "OTHER";
  channel: DemoConsultationChannel;
  content: string;
  writerName: string;
  createdAt: string;
}

export interface DemoContract {
  id: string;
  propertyId: string;
  inquiryId?: string;
  transactionType: DemoTransactionType;
  status: DemoContractStatus;
  lessorOrSeller: DemoContact;
  lesseeOrBuyer: DemoContact;
  price: DemoPriceTerms;
  contractDate: string;
  moveInDate: string;
  expiresAt: string;
  memo: string;
  updatedAt: string;
}

export interface DemoState {
  seedId: string;
  revision: number;
  office: DemoOffice;
  complexes: DemoComplex[];
  properties: DemoProperty[];
  inquiries: DemoInquiry[];
  consultations: DemoConsultationLog[];
  contracts: DemoContract[];
}

export interface PersistedDemoState {
  schemaVersion: typeof DEMO_SCHEMA_VERSION;
  savedAt: string;
  state: DemoState;
}

export type DemoSortOrder = "asc" | "desc";

export interface DemoPage<T> {
  items: T[];
  /** One-based page number. */
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface DemoPropertyListQuery {
  search?: string;
  complexId?: string;
  transactionType?: DemoTransactionType;
  status?: DemoPropertyStatus;
  priority?: DemoPriority;
  favoriteOnly?: boolean;
  minArea?: number;
  maxArea?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "registeredAt" | "updatedAt" | "area" | "price";
  sortOrder?: DemoSortOrder;
  /** One-based page number. Defaults to 1. */
  page?: number;
  pageSize?: number;
}

export interface DemoInquiryListQuery {
  search?: string;
  transactionType?: DemoTransactionType;
  status?: DemoInquiryStatus;
  priority?: DemoPriority;
  complexId?: string;
  minArea?: number;
  maxArea?: number;
  sortBy?: "createdAt" | "updatedAt" | "area";
  sortOrder?: DemoSortOrder;
  /** One-based page number. Defaults to 1. */
  page?: number;
  pageSize?: number;
}

export interface DemoConsultationListQuery {
  targetType?: DemoConsultationTargetType;
  targetId?: string;
  channel?: DemoConsultationChannel;
}

export type DemoPropertyUpsert = Omit<
  DemoProperty,
  "id" | "registeredAt" | "updatedAt"
> &
  Partial<Pick<DemoProperty, "id" | "registeredAt" | "updatedAt">>;

export type DemoInquiryUpsert = Omit<
  DemoInquiry,
  "id" | "createdAt" | "updatedAt"
> &
  Partial<Pick<DemoInquiry, "id" | "createdAt" | "updatedAt">>;

export type DemoConsultationUpsert = Omit<
  DemoConsultationLog,
  "id" | "createdAt"
> &
  Partial<Pick<DemoConsultationLog, "id" | "createdAt">>;

export type DemoContractUpsert = Omit<DemoContract, "id" | "updatedAt"> &
  Partial<Pick<DemoContract, "id" | "updatedAt">>;

export type DemoChangeAction =
  | "RESET"
  | "PROPERTY_UPSERTED"
  | "PROPERTY_DELETED"
  | "INQUIRY_UPSERTED"
  | "INQUIRY_DELETED"
  | "CONSULTATION_UPSERTED"
  | "CONSULTATION_DELETED"
  | "CONTRACT_UPSERTED"
  | "CONTRACT_DELETED"
  | "EXTERNAL_SYNC";

export interface DemoStateChange {
  action: DemoChangeAction;
  revision: number;
  entityId?: string;
}

export type DemoStateListener = (
  state: DemoState,
  change: DemoStateChange,
) => void;

export interface DemoDashboardMetrics {
  totalProperties: number;
  activeProperties: number;
  favoriteProperties: number;
  activeInquiries: number;
  scheduledVisits: number;
  contractsInProgress: number;
  completedContracts: number;
  consultationCount: number;
}

export type DemoMatchCriterion = "REQUEST_TYPE" | "LOCATION" | "AREA" | "PRICE";

export interface DemoMatchReason {
  criterion: DemoMatchCriterion;
  code: string;
  score: number;
  maxScore: number;
  message: string;
}

export interface DemoMatchResult {
  inquiryId: string;
  propertyId: string;
  score: number;
  maxScore: 100;
  isRecommended: boolean;
  reasons: DemoMatchReason[];
}

export interface DemoRankMatchesOptions {
  minimumScore?: number;
  limit?: number;
}
