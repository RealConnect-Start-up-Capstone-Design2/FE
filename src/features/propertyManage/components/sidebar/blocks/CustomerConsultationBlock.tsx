import { Input } from "@/components/ui";
import { SidebarBlock } from "@/components/common/detail-sidebar";
import { SidebarField } from "@/components/common/detail-sidebar";
import type { ApartmentWithProperty } from "../../../types";
interface CustomerConsultationBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
}

/**
 * 고객 상담 내역 블록
 * TODO: 고객 상담 데이터 구조 및 API 연동 필요
 */
export function CustomerConsultationBlock({
  apartment,
  isOpen: _isOpen,
}: CustomerConsultationBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="고객 상담 내역">
        <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-400">아파트를 선택해주세요.</p>
        </div>
      </SidebarBlock>
    );
  }

  return (
    <SidebarBlock title="고객 상담 내역">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-3">
          <SidebarField label="소유자" direction="row">
            <input type="text" />
          </SidebarField>
          <SidebarField label="연락처" direction="row">
            <input type="text" />
          </SidebarField>
        </div>
      </div>
    </SidebarBlock>
  );
}
