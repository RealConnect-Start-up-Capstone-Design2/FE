import {
  SidebarBlock,
  SidebarField,
  sidebarInputClassName,
  sidebarSelectClassName,
} from "@/shared/components/detail-sidebar";
import { DropdownMenu } from "@/shared/ui";
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
      <div className="flex flex-col gap-1.5">
        <SidebarField label="점유상태">
          <DropdownMenu
            className="w-45"
            placeholder="선택"
            options={[
              { label: "없음", value: "none" },
              { label: "입주", value: "owner" },
              { label: "전세", value: "jeonse" },
              { label: "월세", value: "monthly_rent" },
              { label: "공실", value: "empty" },
            ]}
          />
        </SidebarField>
        <div className="flex flex-row gap-4">
          <SidebarField label="기매입금" suffix="만원">
            <input
              type="text"
              className={sidebarInputClassName}
              placeholder="0"
            />
          </SidebarField>
          {/* 절반만 차지하게끔 해놓는 용도 */}
          <div></div>
        </div>
        <div className="flex flex-row gap-4">
          <SidebarField label="융자금" suffix="만원">
            <input
              type="text"
              className={sidebarInputClassName}
              placeholder="0"
            />
          </SidebarField>
          <SidebarField label="관리비" suffix="만원">
            <input
              type="text"
              className={sidebarInputClassName}
              placeholder="0"
            />
          </SidebarField>
        </div>
        <div className="flex flex-row gap-4">
          <SidebarField label="만기일">
            <input type="date" className={sidebarSelectClassName} />
          </SidebarField>
          <SidebarField label="등록일">
            <input type="date" className={sidebarSelectClassName} />
          </SidebarField>
        </div>
      </div>
    </SidebarBlock>
  );
}
