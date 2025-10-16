import type { MainComplexItem } from "@/shared/types/complex";

/**
 * MainComplexModal 내부에서 사용하는 주거래 단지 확장 타입
 */
export interface ExtendedMainComplexItem extends MainComplexItem {
  preferredComplexId?: number;
  apartmentComplexId?: number;
  apartmentName?: string;
  isExisting?: boolean;
}
