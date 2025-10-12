import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PropertyManagerHeader,
  PropertyManageTable,
} from "@/features/propertyManage";
import {
  DetailSidebar,
  SlidingSidebarLayout,
} from "@/components/common/detail-sidebar";
import { PropertyMemoBlock } from "@/features/propertyManage/components/blocks/PropertyMemoBlock";
import { PropertyContractBlock } from "@/features/propertyManage/components/blocks/PropertyContractBlock";
import { getApartments } from "@/features/propertyManage/stores/propertyStore";

/**
 * 매물 관리 페이지
 * 아파트 목록과 상세 정보(메모)를 관리
 */
export function PropertyManagePage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false); // 기본값: 닫힘
  const [selectedPropertyId, setSelectedPropertyId] = useState<
    string | number | undefined
  >();
  // "카드 닫기" 버튼으로 명시적으로 닫았는지 추적
  const [isManuallyClosedByButton, setIsManuallyClosedByButton] =
    useState(false);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);

  // 아파트 목록 조회 (메모 섹션에 전달할 데이터)
  const { data } = useQuery({
    queryKey: ["apartments"],
    queryFn: () => getApartments(),
  });

  const apartments = data?.content || [];
  const selectedApartment = apartments.find(
    (apt) => apt.apartmentId === selectedPropertyId
  );

  const closeSidebar = useCallback(() => {
    setIsDetailOpen(false);
    setIsManuallyClosedByButton(false);
  }, []);

  const handlePropertyClick = (propertyId: string | number) => {
    if (selectedPropertyId === propertyId && isDetailOpen) {
      // 같은 매물을 다시 클릭하면 사이드바만 닫음 (매물 선택은 유지, 버튼으로 닫은 상태 아님)
      closeSidebar();
    } else if (!isManuallyClosedByButton) {
      // "카드 닫기" 버튼으로 닫은 상태가 아닐 때만 다른 매물 클릭 시 사이드바 열림
      setSelectedPropertyId(propertyId);
      setIsDetailOpen(true);
    } else {
      // "카드 닫기" 버튼으로 닫은 상태일 때는 매물 ID만 변경하고 사이드바는 열지 않음
      setSelectedPropertyId(propertyId);
    }
  };

  const handleToggleSidebar = () => {
    setIsDetailOpen((prev) => {
      const newState = !prev;
      // "카드 닫기" 버튼으로 닫은 경우 상태 설정
      if (!newState) {
        setIsManuallyClosedByButton(true);
      } else {
        // "카드 열기" 버튼으로 열면 상태 해제
        setIsManuallyClosedByButton(false);
      }
      return newState;
    });
  };

  useEffect(() => {
    if (!isDetailOpen) {
      return;
    }

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (sidebarRef.current?.contains(target)) {
        return;
      }

      if (tableContainerRef.current?.contains(target)) {
        return;
      }

      if (
        target instanceof HTMLElement &&
        target.closest("[data-sidebar-toggle='true']")
      ) {
        return;
      }

      // 외부 클릭으로 닫은 경우에는 버튼으로 닫은 상태가 아님
      closeSidebar();
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [closeSidebar, isDetailOpen]);

  return (
    <SlidingSidebarLayout
      isOpen={isDetailOpen}
      onToggle={handleToggleSidebar}
      sidebarRef={sidebarRef}
      sidebar={
        <DetailSidebar title="매물 상세 정보">
          <PropertyMemoBlock apartment={selectedApartment} />
          <PropertyContractBlock apartment={selectedApartment} />
        </DetailSidebar>
      }
    >
      <div className="flex flex-col gap-6 h-full">
        <PropertyManagerHeader />
        <div ref={tableContainerRef} className="flex-1 overflow-hidden">
          <PropertyManageTable
            onPropertyClick={handlePropertyClick}
            selectedApartmentId={selectedPropertyId}
          />
        </div>
      </div>
    </SlidingSidebarLayout>
  );
}
