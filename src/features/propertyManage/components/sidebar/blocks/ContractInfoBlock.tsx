import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  type OccupancyStatus,
} from "../../../types";
import {
  fetchPropertyContractInfo,
  type ContractType,
  type PropertyContractInfo,
} from "../../../services/propertyService";

interface ContractInfoBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
  contractInfo?: PropertyContractInfo;
  onContractInfoChange?: (contractInfo: PropertyContractInfo) => void;
}

const contractTypeOptions = [
  "내 계약",
  "타 계약",
  "공동 중개",
  "소개 물건",
] as const;

const contractTypeLabelMap: Record<ContractType, (typeof contractTypeOptions)[number]> = {
  MY_CONTRACT: "내 계약",
  OTHER_CONTRACT: "타 계약",
  CO_BROKERAGE: "공동 중개",
  INTRODUCTION: "소개 물건",
};

const contractTypeValueMap: Record<(typeof contractTypeOptions)[number], ContractType> = {
  "내 계약": "MY_CONTRACT",
  "타 계약": "OTHER_CONTRACT",
  "공동 중개": "CO_BROKERAGE",
  "소개 물건": "INTRODUCTION",
};

const toInputValue = (value?: number | null) =>
  value === undefined || value === null ? "" : String(value);

const toNumberValue = (value: string) => {
  const parsedValue = Number(value.replaceAll(",", ""));

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const formatApiDate = (value: string) => {
  const match = value.match(/(\d{4})[.\-/\s]+(\d{1,2})[.\-/\s]+(\d{1,2})/);

  if (!match) {
    return value;
  }

  const [, year, month, day] = match;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const getContractPayload = (
  contractInfo?: PropertyContractInfo,
  fetchedContractInfo?: PropertyContractInfo,
  apartment?: ApartmentWithProperty,
): PropertyContractInfo => {
  const property = apartment?.property;

  return {
    occupancyStatus:
      contractInfo?.occupancyStatus ??
      fetchedContractInfo?.occupancyStatus ??
      property?.occupancyStatus ??
      "NONE",
    salePrice:
      contractInfo?.salePrice ??
      fetchedContractInfo?.salePrice ??
      property?.contractSalePrice ??
      property?.salePrice ??
      0,
    loanAmount: contractInfo?.loanAmount ?? fetchedContractInfo?.loanAmount ?? 0,
    jeonsePrice:
      contractInfo?.jeonsePrice ??
      fetchedContractInfo?.jeonsePrice ??
      property?.contractJeonsePrice ??
      property?.jeonsePrice ??
      0,
    deposit:
      contractInfo?.deposit ??
      fetchedContractInfo?.deposit ??
      property?.contractDeposit ??
      property?.deposit ??
      0,
    monthlyRent:
      contractInfo?.monthlyRent ??
      fetchedContractInfo?.monthlyRent ??
      property?.contractMonthlyRent ??
      property?.monthPrice ??
      0,
    maintenanceFee:
      contractInfo?.maintenanceFee ?? fetchedContractInfo?.maintenanceFee ?? 0,
    expireDate:
      contractInfo?.expireDate ??
      fetchedContractInfo?.expireDate ??
      property?.expireDate ??
      "",
    registrationDate:
      contractInfo?.registrationDate ??
      fetchedContractInfo?.registrationDate ??
      property?.requestRegistrationDate ??
      "",
    contractOffice:
      contractInfo?.contractOffice ?? fetchedContractInfo?.contractOffice ?? "",
    contractType:
      contractInfo?.contractType ??
      fetchedContractInfo?.contractType ??
      "MY_CONTRACT",
  };
};

/**
 * 계약 정보 블록
 */
export function ContractInfoBlock({
  apartment,
  contractInfo: savedContractInfo,
  onContractInfoChange,
}: ContractInfoBlockProps) {
  const { data: fetchedContractInfo } = useQuery({
    queryKey: ["property-contract-info", apartment?.apartmentId],
    queryFn: () => fetchPropertyContractInfo(apartment!.apartmentId),
    enabled: Boolean(apartment?.apartmentId),
  });

  useEffect(() => {
    if (fetchedContractInfo) {
      onContractInfoChange?.(getContractPayload(undefined, fetchedContractInfo));
    }
  }, [fetchedContractInfo, onContractInfoChange]);

  if (!apartment) {
    return (
      <SidebarBlock title="계약 정보">
        <EmptyBlockState />
      </SidebarBlock>
    );
  }

  const contractInfo = getContractPayload(
    savedContractInfo,
    fetchedContractInfo,
    apartment,
  );
  const resetKey = `${apartment.apartmentId}-${fetchedContractInfo ? "contract-info" : "property"}`;
  const updateContractInfo = (partialContractInfo: Partial<PropertyContractInfo>) => {
    onContractInfoChange?.({
      ...contractInfo,
      ...partialContractInfo,
    });
  };

  return (
    <SidebarBlock
      title="계약 정보"
      headerAction={<OccupancyStatusTag status={contractInfo.occupancyStatus} />}
    >
      <div key={resetKey} className="flex flex-col gap-3">
        <Field label="점유상태" className="max-w-[180px]">
          <SidebarSelect
            value={contractInfo.occupancyStatus}
            options={occupancyStatusOptions}
            onChange={(value) =>
              updateContractInfo({ occupancyStatus: value as OccupancyStatus })
            }
          />
        </Field>

        <Field label="기매입금" suffix="만원" className="max-w-[180px]">
          <SidebarInput
            defaultValue={toInputValue(contractInfo.salePrice)}
            onChange={(event) =>
              updateContractInfo({ salePrice: toNumberValue(event.target.value) })
            }
          />
        </Field>

        <FieldRow className="grid-cols-[minmax(0,180px)_minmax(0,180px)]">
          <Field label="융자금" suffix="만원">
            <SidebarActiveInput
              defaultValue={toInputValue(contractInfo.loanAmount)}
              onChange={(event) =>
                updateContractInfo({
                  loanAmount: toNumberValue(event.target.value),
                })
              }
            />
          </Field>
          <Field label="관리비" suffix="만원">
            <SidebarInput
              defaultValue={toInputValue(contractInfo.maintenanceFee)}
              onChange={(event) =>
                updateContractInfo({
                  maintenanceFee: toNumberValue(event.target.value),
                })
              }
            />
          </Field>
        </FieldRow>

        <FieldRow className="grid-cols-[minmax(0,180px)_minmax(0,180px)]">
          <Field label="전세금" suffix="만원">
            <SidebarInput
              defaultValue={toInputValue(contractInfo.jeonsePrice)}
              onChange={(event) =>
                updateContractInfo({
                  jeonsePrice: toNumberValue(event.target.value),
                })
              }
            />
          </Field>
          <Field label="보증금" suffix="만원">
            <SidebarInput
              defaultValue={toInputValue(contractInfo.deposit)}
              onChange={(event) =>
                updateContractInfo({
                  deposit: toNumberValue(event.target.value),
                })
              }
            />
          </Field>
        </FieldRow>

        <Field label="월세" suffix="만원" className="max-w-[180px]">
          <SidebarInput
            defaultValue={toInputValue(contractInfo.monthlyRent)}
            onChange={(event) =>
              updateContractInfo({
                monthlyRent: toNumberValue(event.target.value),
              })
            }
          />
        </Field>

        <FieldRow className="grid-cols-[minmax(0,180px)_minmax(0,180px)]">
          <Field label="만기일">
            <DateInput
              defaultValue={contractInfo.expireDate}
              onChange={(event) =>
                updateContractInfo({ expireDate: formatApiDate(event.target.value) })
              }
            />
          </Field>
          <Field label="등록일">
            <DateInput
              defaultValue={contractInfo.registrationDate}
              onChange={(event) =>
                updateContractInfo({
                  registrationDate: formatApiDate(event.target.value),
                })
              }
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
                defaultValue={contractInfo.contractOffice}
                onChange={(event) =>
                  updateContractInfo({ contractOffice: event.target.value })
                }
              />
              <span className="shrink-0 text-[13px] font-normal tracking-[-0.025em] text-[#8D8D8D]">
                부동산
              </span>
            </div>
            <ToggleGroup
              value={contractTypeLabelMap[contractInfo.contractType]}
              options={[...contractTypeOptions]}
              className="grid-cols-4"
              onChange={(value) =>
                updateContractInfo({
                  contractType: contractTypeValueMap[
                    value as (typeof contractTypeOptions)[number]
                  ],
                })
              }
            />
          </div>
        </div>
      </div>
    </SidebarBlock>
  );
}
