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
  requestTypeOptions,
  type ApartmentWithProperty,
} from "../../../types";

interface InquiryInfoBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
}

/**
 * 의뢰 정보 블록
 * TODO: 의뢰 정보 데이터 구조 및 API 연동 필요
 */
export function InquiryInfoBlock({ apartment }: InquiryInfoBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="의뢰 정보">
        <EmptyBlockState />
      </SidebarBlock>
    );
  }

  const property = apartment.property;

  return (
    <SidebarBlock
      title="의뢰 정보"
      headerAction={
        <span className="rounded-full border border-[#1C2882] bg-[#E8EDFF] px-3 py-1 text-[12px] font-medium tracking-[-0.025em] text-[#1C2882]">
          매/전/월
        </span>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="의뢰 유형" className="max-w-[180px]">
          <SidebarSelect
            value={property?.requestType ?? "NONE"}
            options={requestTypeOptions}
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
