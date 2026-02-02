import { SidebarBlock } from "@/components/common/detail-sidebar";
import type { ApartmentWithProperty } from "../../../types";

interface InquiryInfoBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
}

/**
 * 의뢰 정보 블록
 * TODO: 의뢰 정보 데이터 구조 및 API 연동 필요
 */
export function InquiryInfoBlock({
  apartment,
  isOpen: _isOpen,
}: InquiryInfoBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="의뢰 정보">
        <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-400">아파트를 선택해주세요.</p>
        </div>
      </SidebarBlock>
    );
  }

  return (
    <SidebarBlock title="의뢰 정보">
      <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
        <p className="text-gray-400">의뢰 정보가 여기에 표시됩니다.</p>
      </div>
    </SidebarBlock>
  );
}
