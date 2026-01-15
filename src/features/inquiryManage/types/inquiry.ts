export type RequestType =
  | "MONTHLY"
  | "JEONSE"
  | "SALE"
  | "THINKING"
  | "DEPOSIT";

export type PropertyType = "APARTMENT" | "OFFICETEL" | "COMMERCIAL" | "VILLA";

export type InquiryStatus = "GENERAL" | "ANOTHER" | "SHARED" | "COMPLETED";

export type ManageType = "NONE" | "ATTENTION" | "CAUTION";

export type InquirerRelation = "SELF" | "PARENTS" | "CHILDREN" | "OTHER";

// 문의자 정보
export interface InquirerInfo {
  inquirerName: string;
  inquirerRelation?: string;
  contractPhone: string;
}

// ============================================
// 문의 조회 관련
// ============================================

// 문의 데이터 (GET 응답)
export interface Inquiry {
  inquiryId: number;
  requestType: RequestType;
  propertyType: PropertyType;
  inquirerInfo: InquirerInfo;
  inquiryStatus: InquiryStatus | null;
  createdDate: string;
  manageType: ManageType;
  dong: string;
  title: string;
  specs: {
    minArea: number;
    maxArea: number;
    minSalePrice: number;
    maxSalePrice: number;
    minDeposit: number;
    maxDeposit: number;
    minMonthlyPrice: number;
    maxMonthlyPrice: number;
  };
}

// 문의 목록 조회 파라미터
export interface InquiriesQueryParams {
  keyword?: string;
  manageType?: ManageType;
  minArea?: number;
  maxArea?: number;
  requestType?: RequestType;
  inquiryStatus?: InquiryStatus;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string[];
}

// 문의 목록 조회 응답 (페이지네이션)
export interface InquiriesResponse {
  content: Inquiry[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ============================================
// 문의 등록 관련
// ============================================

// 문의 등록 응답 (POST)
export interface CreateInquiryResponse {
  message: string;
  data: number; // 생성된 문의 ID
}

// 문의 등록 요청 payload (POST)
export interface CreateInquiryPayload {
  requestType: RequestType;
  propertyType: PropertyType;
  inquirerInfo: InquirerInfo[];
  inquirerAddress: string;
  sido: string;
  sigungu: string;
  dong: string;
  complexName: string;
  minArea: number;
  maxArea: number;
  minSalePrice: number;
  maxSalePrice: number;
  minDeposit: number;
  maxDeposit: number;
  minMonthlyPrice: number;
  maxMonthlyPrice: number;
  title: string;
  publicDescription: string;
  privateNote: string;
}
