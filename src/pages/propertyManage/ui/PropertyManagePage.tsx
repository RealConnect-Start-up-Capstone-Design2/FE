import { useState } from "react";
import {
  PropertyManagerHeader,
  PropertyManageTable,
} from "@/features/propertyManage";
import {
  DetailSidebar,
  SlidingSidebarLayout,
} from "@/components/common/detail-sidebar";

export function PropertyManagePage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<
    string | number | undefined
  >();

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
    <div className="h-screen bg-gray-50">
      <SlidingSidebarLayout
        isOpen={isDetailOpen}
        sidebar={
          <DetailSidebar title="매물 상세 정보" onClose={handleCloseDetail}>
            <div className="space-y-6 text-sm text-gray-600">
              <p className="font-medium text-gray-900">
                선택된 매물 ID: {selectedPropertyId}
              </p>
              <p className="text-gray-500">
                이 영역에 매물 상세 정보를 구성해 주세요.
              </p>
            </div>
          </DetailSidebar>
        }
        className="w-full"
        contentClassName=""
      >
        <div className="w-full max-w-[1400px] space-y-6">
          <PropertyManagerHeader />
          <PropertyManageTable onPropertyClick={handlePropertyClick} />
        </div>
      </SlidingSidebarLayout>
    </div>
  );
}
