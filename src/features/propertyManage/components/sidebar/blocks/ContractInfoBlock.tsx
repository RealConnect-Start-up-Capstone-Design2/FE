import { SidebarBlock } from "@/shared/components/detail-sidebar";
import {
  EmptyBlockState,
  Field,
  FieldRow,
  DateInput,
  SegmentedControl,
  SidebarActiveInput,
  SidebarInput,
  SidebarSelect,
  ToggleGroup,
} from "./SidebarFormControls";
import {
  occupancyStatusOptions,
  type ApartmentWithProperty,
} from "../../../types";

interface ContractInfoBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
}

/**
 * 계약 정보 블록
 * TODO: 기존 PropertyContractBlock 로직 이동 예정
 */
export function ContractInfoBlock({ apartment }: ContractInfoBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="계약 정보">
        <EmptyBlockState />
      </SidebarBlock>
    );
  }

  const property = apartment.property;

  return (
    <SidebarBlock title="계약 정보">
      <div className="flex flex-col gap-3">
        <Field label="거래상태" className="max-w-[180px]">
          <SidebarSelect
            value={property?.occupancyStatus ?? "NONE"}
            options={occupancyStatusOptions}
          />
        </Field>

        <SegmentedControl
          value="sale"
          options={[
            { label: "매도", value: "sale" },
            { label: "전세", value: "jeonse" },
            { label: "월세", value: "monthly", disabled: true },
            { label: "단기임대", value: "short", disabled: true },
          ]}
        />

        <FieldRow className="grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
          <Field label="매도 희망가" suffix="만원">
            <SidebarActiveInput
              defaultValue={property?.salePrice ? String(property.salePrice) : ""}
            />
          </Field>
          <Field label="세 끼고 매도">
            <div className="grid grid-cols-[minmax(0,1fr)_14px_64px] items-center gap-2">
              <SidebarInput
                defaultValue={
                  property?.jeonsePrice ? String(property.jeonsePrice) : ""
                }
              />
              <span className="mx-auto h-[22px] rotate-[17deg] border-l-2 border-[#B1B6C7]" />
              <SidebarInput
                defaultValue={
                  property?.monthPrice ? String(property.monthPrice) : ""
                }
              />
            </div>
          </Field>
        </FieldRow>

        <div className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] items-end gap-4">
          <Field label="융자여부" suffix="만원">
            <SidebarActiveInput
              defaultValue={property?.deposit ? String(property.deposit) : ""}
            />
          </Field>
          <ToggleGroup
            value="융자없음"
            options={["미표시", "융자없음", "30% 미만", "30% 이상"]}
            className="grid-cols-4"
          />
        </div>

        <FieldRow className="grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-end">
          <Field label="입주가능일">
            <ToggleGroup
              value="즉시 입주"
              options={["즉시 입주", "입주일 지정"]}
              className="grid-cols-2"
            />
          </Field>
          <Field label=" ">
            <DateInput defaultValue={property?.expireDate ?? "2025. 10. 12"} />
          </Field>
        </FieldRow>

        <Field label="등록일(오늘)" className="max-w-[210px]">
          <DateInput
            defaultValue={property?.requestRegistrationDate ?? "2025. 10. 12"}
          />
        </Field>
      </div>
    </SidebarBlock>
  );
}
