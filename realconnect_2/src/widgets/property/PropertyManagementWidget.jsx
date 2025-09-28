import React, { useState, useRef } from "react";
import { PropertyTable } from "@entities/property";
import {
  PropertyHeader,
  PropertyControls,
  PropertySidebar,
  useProperties,
  useUpdateProperty,
  useClearProperties,
} from "@features/property-management";

export const PropertyManagementWidget = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isClosingSidebar, setIsClosingSidebar] = useState(false);
  const [activeView, setActiveView] = useState("전체");
  const [sortStandard, setSortStandard] = useState("DONG_HO");
  const [transactionType, setTransactionType] = useState("ALL");
  const [selectedPropertyIds, setSelectedPropertyIds] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const closingSidebarRef = useRef(false);

  // API 훅들
  const filters = {
    sort: sortStandard,
    view: activeView === "전체" ? "ALL" : "MY",
    transactionType: transactionType,
    q: searchKeyword,
  };

  const { data, isLoading, error } = useProperties(filters);

  const updatePropertyMutation = useUpdateProperty();
  const clearPropertiesMutation = useClearProperties();

  const handlePropertySelect = (property) => {
    if (closingSidebarRef.current) return;

    // 같은 매물을 다시 클릭했을 때 사이드바 닫기
    if (
      selectedProperty &&
      selectedProperty.apartmentId === property.apartmentId
    ) {
      handleCloseSidebar();
    } else {
      setSelectedProperty(property);
      setIsEditMode(false);
      setIsClosingSidebar(false);
    }
  };

  const handleCloseSidebar = () => {
    setIsClosingSidebar(true);
    closingSidebarRef.current = true;
    setTimeout(() => {
      setSelectedProperty(null);
      setIsClosingSidebar(false);
      closingSidebarRef.current = false;
    }, 300);
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  // 매물 선택 변경 핸들러
  const handleSelectionChange = (propertyId, isSelected) => {
    if (propertyId === null || propertyId === undefined) {
      return;
    }

    setSelectedPropertyIds((prev) => {
      if (isSelected) {
        const alreadySelected = prev.some(
          (id) => String(id) === String(propertyId)
        );
        return alreadySelected ? prev : [...prev, propertyId];
      }
      return prev.filter((id) => String(id) !== String(propertyId));
    });
  };

  // 매물 삭제(초기화) 핸들러
  const handleDeleteProperties = () => {
    if (selectedPropertyIds.length === 0) {
      alert("삭제할 매물을 선택해주세요.");
      return;
    }

    const confirmMessage = `선택된 ${selectedPropertyIds.length}개 매물의 모든 정보를 빈값으로 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`;

    if (window.confirm(confirmMessage)) {
      clearPropertiesMutation.mutate(selectedPropertyIds, {
        onSuccess: () => {
          setSelectedPropertyIds([]);
          alert("선택된 매물들의 정보가 초기화되었습니다.");
        },
        onError: (error) => {
          alert(
            `매물 정보 초기화에 실패했습니다.\n오류: ${
              error.message || "알 수 없는 오류"
            }`
          );
        },
      });
    }
  };

  const selectedPropertyId = selectedProperty
    ? selectedProperty.apartmentId
    : null;

  return (
    <div className={`page_section ${selectedProperty ? "with-sidebar" : ""}`}>
      {/* 페이지 헤더 */}
      <PropertyHeader activeView={activeView} onViewChange={setActiveView} />

      {/* 컨트롤 영역 */}
      <PropertyControls
        onSearch={setSearchKeyword}
        sortStandard={sortStandard}
        onSortStandardChange={setSortStandard}
        transactionType={transactionType}
        onTransactionTypeChange={setTransactionType}
        onAddProperty={() => console.log("Add property")}
        onDeleteProperties={handleDeleteProperties}
        selectedCount={selectedPropertyIds.length}
      />

      {/* 테이블 영역 */}
      <div className="content_wrap">
        <PropertyTable
          data={data}
          isLoading={isLoading}
          error={error}
          onPropertySelect={handlePropertySelect}
          selectedPropertyId={selectedPropertyId}
          onSelectionChange={handleSelectionChange}
          selectedPropertyIds={selectedPropertyIds}
        />
      </div>

      {/* 사이드바 */}
      {selectedProperty && (
        <PropertySidebar
          property={selectedProperty}
          isEditMode={isEditMode}
          isClosing={isClosingSidebar}
          onClose={handleCloseSidebar}
          onEdit={handleEditMode}
        />
      )}
    </div>
  );
};
