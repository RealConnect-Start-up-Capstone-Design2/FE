/**
 * 테이블 셀 클릭 이벤트 타입
 * 매물 관리, 문의 관리 등에서 공통으로 사용
 */
export interface CellClickEvent<TFieldKey extends string = string> {
  /** 클릭된 행의 ID */
  rowId: number | string;
  /** 클릭된 필드 키 */
  fieldKey: TFieldKey;
  /** 현재 필드의 값 (선택적) */
  currentValue?: unknown;
}

/**
 * 테이블 행 클릭 핸들러
 */
export type RowClickHandler = (rowId: number | string) => void;

/**
 * 테이블 셀 클릭 핸들러
 */
export type CellClickHandler<TFieldKey extends string = string> = (
  event: CellClickEvent<TFieldKey>
) => void;
