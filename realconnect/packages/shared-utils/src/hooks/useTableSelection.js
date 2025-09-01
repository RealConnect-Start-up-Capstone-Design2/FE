import { useState } from "react";

/**
 * 테이블 행 선택 기능을 위한 커스텀 훅
 * 모든 테이블 컴포넌트에서 공통으로 사용되는 선택 로직을 추상화
 *
 * @param {Array} data - 테이블 데이터 배열
 * @param {string} idKey - 각 항목의 고유 ID 필드명 (기본값: 'id')
 * @returns {Object} 선택 관련 상태와 함수들
 */
export function useTableSelection(data = [], idKey = "id") {
  const [selectedItems, setSelectedItems] = useState([]);

  /**
   * 전체 선택/해제 토글
   * @param {Event} e - 체크박스 이벤트
   */
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(data.map((item) => item[idKey]));
    } else {
      setSelectedItems([]);
    }
  };

  /**
   * 개별 항목 선택/해제 토글
   * @param {Event} e - 체크박스 이벤트
   * @param {string|number} id - 항목 ID
   */
  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  /**
   * 선택된 항목들 초기화
   */
  const clearSelection = () => {
    setSelectedItems([]);
  };

  /**
   * 특정 항목들을 선택 상태로 설정
   * @param {Array} ids - 선택할 항목 ID 배열
   */
  const setSelection = (ids) => {
    setSelectedItems(ids);
  };

  /**
   * 전체 선택 체크박스의 상태 계산
   */
  const isAllSelected = selectedItems.length === data.length && data.length > 0;

  /**
   * 부분 선택 상태 (일부만 선택된 상태)
   */
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < data.length;

  /**
   * 특정 항목이 선택되었는지 확인
   * @param {string|number} id - 확인할 항목 ID
   * @returns {boolean}
   */
  const isSelected = (id) => selectedItems.includes(id);

  return {
    selectedItems,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
    setSelection,
    isAllSelected,
    isIndeterminate,
    isSelected,
    selectedCount: selectedItems.length,
  };
}
