import { SidebarBlock } from "@/shared/components/detail-sidebar";
import type { ApartmentWithProperty } from "../../../types";
import {
  EmptyBlockState,
  Field,
  FieldRow,
  SidebarActionButton,
  SidebarInput,
  SidebarSelect,
  SidebarTextarea,
} from "./SidebarFormControls";

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
}: CustomerConsultationBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="고객 상담 내역">
        <EmptyBlockState />
      </SidebarBlock>
    );
  }

  return (
    <SidebarBlock title="고객 상담 내역">
      <div className="flex flex-col gap-3">
        <FieldRow>
          <Field label="소유자">
            <SidebarInput defaultValue={apartment.property?.ownerName ?? ""} />
          </Field>
          <Field label="연락처">
            <SidebarInput defaultValue={apartment.property?.ownerPhone ?? ""} />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="임차인">
            <SidebarInput />
          </Field>
          <Field label="연락처">
            <SidebarInput placeholder="010-0000-0000" />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="가족">
            <SidebarInput />
          </Field>
          <Field label="관리자">
            <SidebarInput placeholder="010-0000-0000" />
          </Field>
        </FieldRow>

        <SidebarTextarea
          defaultValue={`아는 곳에서 매물로 진행된다고 함.\n아는 곳에서 매물로 진행된다고 함.\n아는 곳에서 매물로 진행된다고 함.`}
        />

        <div className="mt-1 flex flex-col gap-[5px]">
          <span className="text-[13px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
            상담 내용 추가
          </span>
          <div className="grid grid-cols-[96px_1fr_54px] gap-2">
            <SidebarSelect
              value="owner"
              options={[
                { value: "owner", label: "소유자" },
                { value: "tenant", label: "임차인" },
                { value: "family", label: "가족" },
                { value: "etc", label: "기타" },
              ]}
            />
            <SidebarInput placeholder="로얄층이라 시세 이상 받고 싶다고 함." />
            <SidebarActionButton type="button">등록</SidebarActionButton>
          </div>
        </div>
      </div>
    </SidebarBlock>
  );
}
