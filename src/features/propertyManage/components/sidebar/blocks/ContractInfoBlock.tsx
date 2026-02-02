import { SidebarBlock } from "@/components/common/detail-sidebar";
import type { ApartmentWithProperty } from "../../../types";

interface ContractInfoBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
}

/**
 * 계약 정보 블록
 * TODO: 기존 PropertyContractBlock 로직 이동 예정
 */
export function ContractInfoBlock({
  apartment,
  isOpen: _isOpen,
}: ContractInfoBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="계약 정보">
        <div className="flex min-h-[200px] w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50">
          <p className="text-gray-400">아파트를 선택해주세요.</p>
        </div>
      </SidebarBlock>
    );
  }

  return (
    <SidebarBlock title="계약 정보">
      <div className="flex min-h-[200px] w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50">
        <p className="text-gray-400">계약 정보가 여기에 표시됩니다.</p>
      </div>
    </SidebarBlock>
  );
}
