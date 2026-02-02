import { SidebarBlock } from "@/components/common/detail-sidebar";
import type { ApartmentWithProperty } from "../../../types";

interface PropertyDetailBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
}

/**
 * 매물 상세 블록 (메모장)
 * TODO: 기존 PropertyMemoBlock 로직 이동 예정
 */
export function PropertyDetailBlock({
  apartment,
  isOpen: _isOpen,
}: PropertyDetailBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="매물 상세">
        <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-400">아파트를 선택해주세요.</p>
        </div>
      </SidebarBlock>
    );
  }

  return (
    <SidebarBlock title="매물 상세">
      <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
        <p className="text-gray-400">매물 상세 정보가 여기에 표시됩니다.</p>
      </div>
    </SidebarBlock>
  );
}
