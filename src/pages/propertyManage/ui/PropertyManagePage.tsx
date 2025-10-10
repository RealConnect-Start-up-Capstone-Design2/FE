import { useState } from "react";
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
import { getApartments } from "@/features/propertyManage/stores/propertyStore";

/**
 * 매물 관리 페이지
 * 아파트 목록과 상세 정보(메모)를 관리
 */
export function PropertyManagePage() {
  const [isDetailOpen, setIsDetailOpen] = useState(true); // 기본값: 열림
  const [selectedPropertyId, setSelectedPropertyId] = useState<
    string | number | undefined
  >();

  // 아파트 목록 조회 (메모 섹션에 전달할 데이터)
  const { data } = useQuery({
    queryKey: ["apartments"],
    queryFn: () => getApartments(),
  });

  const apartments = data?.content || [];
  const selectedApartment = apartments.find(
    (apt) => apt.apartmentId === selectedPropertyId
  );

  const handlePropertyClick = (propertyId: string | number) => {
    // 사이드바 열림 여부와 관계없이 항상 매물 ID 변경
    // (닫힌 상태에서 값 입력 후 나중에 카드 열기 시 해당 매물 메모 표시)
    setSelectedPropertyId(propertyId);
  };

  const handleToggleSidebar = () => {
    setIsDetailOpen((prev) => !prev);
  };

  return (
    <SlidingSidebarLayout
      isOpen={isDetailOpen}
      onToggle={handleToggleSidebar}
      sidebar={
        <DetailSidebar title="매물 상세 정보">
          <PropertyMemoBlock apartment={selectedApartment} />
        </DetailSidebar>
      }
    >
      <div className="flex flex-col gap-6 h-full">
        <PropertyManagerHeader />
        <div className="flex-1 overflow-hidden">
          <PropertyManageTable
            onPropertyClick={handlePropertyClick}
            selectedApartmentId={selectedPropertyId}
          />
        </div>
      </div>
    </SlidingSidebarLayout>
  );
}
