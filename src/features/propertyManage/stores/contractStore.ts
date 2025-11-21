// ============================================
// 계약 정보 타입 정의 (백엔드 API 스펙 기준)
// ============================================

/**
 * 계약 타입
 */
export type ContractType = "SALE" | "JEONSE" | "MONTHLY";

export const DEFAULT_CONTRACT_TYPE: ContractType = "SALE";

/**
 * 계약 정보
 * apartmentId로 매물과 연결
 */
export interface ContractInfo {
  apartmentId: number;
  contractType: ContractType;
  gapName: string; // 갑 (소유자/임대인/매도인)
  gapPhone: string;
  eulName: string; // 을 (임차인/매수인)
  eulPhone: string;
  moveInDate: string; // 입주일
  expireDate: string; // 만기일
  contractDate: string; // 계약일 (YYYY-MM-DD)
  salePrice: number; // 매매가
  jeonsePayment: number; // 전세금
  jeonsePaymentDueDate: string; // 전세금 지급일
  deposit: number; // 보증금
  depositDueDate: string; // 보증금 지급일
  downPayment: number; // 계약금
  downPaymentDueDate: string; // 계약금 지급일
  interimPayment: number; // 중도금
  interimPaymentDueDate: string; // 중도금 지급일
  balance: number; // 잔금
  balanceDueDate: string; // 잔금 지급일
  monthlyRent: number; // 월세
  monthlyRentDueDate: string; // 월세 지급일 (예: "매월 25일" 또는 날짜)
}

/**
 * 계약 정보 생성/수정 DTO
 */
export type ContractInfoInput = Omit<ContractInfo, "apartmentId">;

// ============================================
// 더미 데이터 (개발용)
// TODO: API 연동 후 제거 예정
// ============================================
const dummyContracts: Map<number, ContractInfo> = new Map();

/**
 * 계약 정보 조회
 * TODO: API 연동 시 contractService.getContract()로 대체
 */
export const getContract = (apartmentId: number): ContractInfo | null => {
  return dummyContracts.get(apartmentId) || null;
};

/**
 * 계약 정보 저장
 * TODO: API 연동 시 contractService.saveContract()로 대체
 */
export const saveContract = (
  apartmentId: number,
  contract: Partial<ContractInfo>
): void => {
  const existing = dummyContracts.get(apartmentId);
  const updated: ContractInfo = {
    apartmentId,
    contractType: contract.contractType || DEFAULT_CONTRACT_TYPE,
    gapName: contract.gapName || "",
    gapPhone: contract.gapPhone || "",
    eulName: contract.eulName || "",
    eulPhone: contract.eulPhone || "",
    moveInDate: contract.moveInDate || "",
    expireDate: contract.expireDate || "",
    contractDate: contract.contractDate || "",
    salePrice: contract.salePrice || 0,
    jeonsePayment: contract.jeonsePayment || 0,
    jeonsePaymentDueDate: contract.jeonsePaymentDueDate || "",
    deposit: contract.deposit || 0,
    depositDueDate: contract.depositDueDate || "",
    downPayment: contract.downPayment || 0,
    downPaymentDueDate: contract.downPaymentDueDate || "",
    interimPayment: contract.interimPayment || 0,
    interimPaymentDueDate: contract.interimPaymentDueDate || "",
    balance: contract.balance || 0,
    balanceDueDate: contract.balanceDueDate || "",
    monthlyRent: contract.monthlyRent || 0,
    monthlyRentDueDate: contract.monthlyRentDueDate || "",
    ...existing,
    ...contract,
  };
  dummyContracts.set(apartmentId, updated);
};

/**
 * 계약 정보 삭제
 * TODO: API 연동 시 contractService.deleteContract()로 대체
 */
export const deleteContract = (apartmentId: number): void => {
  dummyContracts.delete(apartmentId);
};

/**
 * 계약 필드 업데이트 (단일 필드)
 */
export const updateContractField = (
  apartmentId: number,
  field: keyof Omit<ContractInfo, "apartmentId">,
  value: string | number
): void => {
  const existing = getContract(apartmentId);
  if (existing) {
    saveContract(apartmentId, { ...existing, [field]: value });
  } else {
    // 계약이 없으면 새로 생성
    saveContract(apartmentId, { [field]: value });
  }
};
