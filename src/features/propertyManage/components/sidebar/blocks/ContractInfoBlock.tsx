import { SidebarBlock } from "@/shared/components/detail-sidebar";
import { OccupancyStatusTag } from "../../OccupancyStatusTag";
import {
  EmptyBlockState,
  Field,
  FieldRow,
  DateInput,
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
    <SidebarBlock
      title="계약 정보"
      headerAction={<OccupancyStatusTag status="NONE" />}
    >
      <div className="flex flex-col gap-3">
        <Field label="점유상태" className="max-w-[180px]">
          <SidebarSelect
            value={property?.occupancyStatus ?? "NONE"}
            options={occupancyStatusOptions}
          />
        </Field>

        <Field label="기매입금" suffix="만원" className="max-w-[180px]">
          <SidebarInput
            defaultValue={
              property?.contractSalePrice
                ? String(property.contractSalePrice)
                : property?.salePrice
                  ? String(property.salePrice)
                  : ""
            }
          />
        </Field>

        <FieldRow className="grid-cols-[minmax(0,180px)_minmax(0,180px)]">
          <Field label="융자금" suffix="만원">
            <SidebarActiveInput
              defaultValue={
                property?.contractDeposit
                  ? String(property.contractDeposit)
                  : property?.deposit
                    ? String(property.deposit)
                    : ""
              }
            />
          </Field>
          <Field label="관리비" suffix="만원">
            <SidebarInput
              defaultValue={
                property?.contractMonthlyRent
                  ? String(property.contractMonthlyRent)
                  : ""
              }
            />
          </Field>
        </FieldRow>

        <FieldRow className="grid-cols-[minmax(0,180px)_minmax(0,180px)]">
          <Field label="만기일">
            <DateInput
              defaultValue={property?.expireDate}
            />
          </Field>
          <Field label="등록일">
            <DateInput
              defaultValue={property?.requestRegistrationDate}
            />
          </Field>
        </FieldRow>

        <div className="flex flex-col gap-[5px]">
          <span className="text-[13px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
            계약 부동산
          </span>
          <div className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] items-end gap-4">
            <div className="flex min-w-0 items-center gap-[6px]">
              <SidebarInput
                defaultValue="잠실대장래미안"
              />
              <span className="shrink-0 text-[13px] font-normal tracking-[-0.025em] text-[#8D8D8D]">
                부동산
              </span>
            </div>
            <ToggleGroup
              value="내 계약"
              options={["내 계약", "타 계약", "공동 중개", "소개 물건"]}
              className="grid-cols-4"
            />
          </div>
        </div>
      </div>
    </SidebarBlock>
  );
}
