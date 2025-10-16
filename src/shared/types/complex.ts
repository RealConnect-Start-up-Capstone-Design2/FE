/**
 * 주거래 단지 데이터 타입
 * 회원가입, 매물관리 등 여러 feature에서 공유
 */
export interface ComplexData {
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  complex: string;
}

/**
 * 주거래 단지 아이템 (내부 상태용)
 */
export interface MainComplexItem extends ComplexData {
  id: number;
  isDirty: boolean; // 수정되었는지 여부
}

/**
 * 지역 드롭다운 옵션 타입
 */
export interface RegionOption {
  label: string;
  value: string;
}

/**
 * 주거래 단지 모달 Props
 */
export interface MainComplexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (complexes: ComplexData[]) => Promise<void>;
  initialData?: ComplexData[];
}
