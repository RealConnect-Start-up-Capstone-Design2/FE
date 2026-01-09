import type { PropertyType, InquiryRequestType } from "../../types/inquiry";

// 문의자 관계 타입
export type InquirerRelation = "SELF" | "PARENT" | "CHILD" | "OTHER_REALTOR";

// 문의 추가 폼 데이터
export interface AddInquiryFormData {
  // 유형 & 물건 종류
  requestType: InquiryRequestType;
  propertyType: PropertyType;

  // 문의자 1
  inquirer1Name: string;
  inquirer1Phone: string;
  inquirer1Relation: InquirerRelation | "";

  // 문의자 2
  inquirer2Name: string;
  inquirer2Phone: string;
  inquirer2Relation: InquirerRelation | "";

  // 지역
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  complexName: string; // 단지명 직접 입력

  // 문의자 주소
  inquirerAddress: string;

  // 면적 (평 또는 면적으로 입력 가능)
  area1: string;
  area2: string;
  isAreaInPyeong: boolean; // true: 평, false: ㎡

  // 가격
  purchasePrice1: string;
  purchasePrice2: string;
  deposit1: string;
  deposit2: string;
  monthlyRent1: string;
  monthlyRent2: string;

  // 메모
  title: string; // 문의 제목 (40자 이하)
  publicDescription: string; // 문의 상세 설명 (공개)
  privateNote: string; // 중개사 상담 내용 (비공개)
}

// 지역 옵션 타입
export interface RegionOption {
  label: string;
  value: string;
}

// 모달 Props
export interface AddInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddInquiryFormData) => Promise<void>;
}
