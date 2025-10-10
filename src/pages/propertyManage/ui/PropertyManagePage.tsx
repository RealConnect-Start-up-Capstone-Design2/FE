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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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
    if (isDetailOpen && selectedPropertyId === propertyId) {
      handleCloseDetail();
      return;
    }

    setSelectedPropertyId(propertyId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPropertyId(undefined);
  };

  return (
    <SlidingSidebarLayout
      isOpen={isDetailOpen}
      sidebar={
        <DetailSidebar title="매물 상세 정보" onClose={handleCloseDetail}>
          <PropertyMemoBlock apartment={selectedApartment} />
        </DetailSidebar>
      }
    >
      <div className="flex flex-col gap-6 h-full" onClick={handleCloseDetail}>
        <PropertyManagerHeader />
        <div
          className="flex-1 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <PropertyManageTable
            onPropertyClick={handlePropertyClick}
            selectedApartmentId={selectedPropertyId}
          />
        </div>
      </div>
    </SlidingSidebarLayout>
  );
}
