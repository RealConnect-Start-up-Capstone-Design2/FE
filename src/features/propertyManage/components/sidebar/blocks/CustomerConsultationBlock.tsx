import {
  SidebarBlock,
  sidebarInputClassName,
} from "@/shared/components/detail-sidebar";
import { SidebarField } from "@/shared/components/detail-sidebar";
import { Textarea, Label, Input, Button } from "@/shared/ui";
import { DropdownMenu } from "@/shared/ui/dropdown-menu";
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
        <div className="flex flex-row gap-8">
          <SidebarField label="소유자" direction="row">
            <input type="text" className={sidebarInputClassName} />
          </SidebarField>
          <SidebarField label="연락처" direction="row">
            <input type="text" className={sidebarInputClassName} />
          </SidebarField>
        </div>
        <div className="flex flex-row gap-8">
          <SidebarField label="임차인" direction="row">
            <input type="text" className={sidebarInputClassName} />
          </SidebarField>
          <SidebarField label="연락처" direction="row">
            <input type="text" className={sidebarInputClassName} />
          </SidebarField>
        </div>
        <div className="flex flex-row gap-8">
          <SidebarField label="기타" direction="row">
            <input type="text" className={sidebarInputClassName} />
          </SidebarField>
          <SidebarField label="연락처" direction="row">
            <input type="text" className={sidebarInputClassName} />
          </SidebarField>
        </div>
        <Textarea />
        <Label>상담 내용 추가</Label>
        <div className="flex flex-row gap-2">
          <DropdownMenu
            className="w-25 text-[15px]"
            placeholder="소유자"
            options={[
              { value: "소유자", label: "소유자" },
              { value: "임차인", label: "임차인" },
              { value: "기타", label: "기타" },
            ]}
          />
          <Input
            type="text"
            placeholder="로얄층이라 시세 이상 받고 싶다고 함."
          />
          <Button className="bg-[#1C2882] text-[#ffffff]">저장</Button>
        </div>
      </div>
    </SidebarBlock>
  );
}
