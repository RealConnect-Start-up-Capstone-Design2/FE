export type RealtorCertificationStatus =
  | "approved" // 승인
  | "pending" // 승인 대기
  | "rejected" // 반려
  | "not_certified"; // 인증 전

export interface RealtorMember {
  id: string;
  registrationDate: string; // 회원가입일
  ownerName: string; // 대표자 성명
  ownerPhone: string; // 대표자 연락처
  businessName: string | null; // 상호명
  businessPhone: string | null; // 사업장 대표 전화번호
  approvalRequestDate: string | null; // 승인 요청일
  certificationStatus: RealtorCertificationStatus; // 중개사 인증 상태
}
