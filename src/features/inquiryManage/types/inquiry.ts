// Enum 타입들은 enums.ts에서 import
import type {
  RequestType,
  PropertyType,
  InquiryStatus,
  ManageType,
  InquirerRelation,
} from "./enums";

export type {
  RequestType,
  PropertyType,
  InquiryStatus,
  ManageType,
  InquirerRelation,
};

export interface InquirerInfo {
  inquirerName: string;
  inquirerRelation?: string;
  contractPhone: string;
}

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

export interface InquiriesResponse {
  content: Inquiry[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CreateInquiryResponse {
  message: string;
  data: number; // 생성된 문의 ID
}

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
