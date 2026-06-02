import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarBlock } from "@/shared/components/detail-sidebar";
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
  REQUEST_TYPE_LABELS,
  requestTypeOptions,
  type ApartmentWithProperty,
  type RequestType,
} from "../../../types";
import {
  fetchPropertyRequestInfo,
  type PropertyRequestInfo,
} from "../../../services/propertyService";

interface InquiryInfoBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
  requestInfo?: PropertyRequestInfo;
  onRequestInfoChange?: (requestInfo: PropertyRequestInfo) => void;
}

const loanStateLabelMap: Record<string, string> = {
  NONE: "미표시",
  NOT_DISPLAYED: "미표시",
  NO_LOAN: "융자없음",
  WITHOUT_LOAN: "융자없음",
  LOAN_FREE: "융자없음",
  UNDER_30: "30% 미만",
  LESS_THAN_30: "30% 미만",
  BELOW_30: "30% 미만",
  OVER_30: "30% 이상",
  MORE_THAN_30: "30% 이상",
  ABOVE_30: "30% 이상",
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

const loanStateValueMap: Record<string, string> = {
  미표시: "NONE",
  융자없음: "NO_LOAN",
  "30% 미만": "UNDER_30",
  "30% 이상": "OVER_30",
};

const requestTypeSegments = [
  { label: "매도", value: "SALE" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY" },
  { label: "단기임대", value: "SHORT" },
] as const;

/**
 * 의뢰 정보 블록
 */
export function InquiryInfoBlock({
  apartment,
  requestInfo: savedRequestInfo,
  onRequestInfoChange,
}: InquiryInfoBlockProps) {
  const { data: fetchedRequestInfo } = useQuery({
    queryKey: ["property-request-info", apartment?.apartmentId],
    queryFn: () => fetchPropertyRequestInfo(apartment!.apartmentId),
    enabled: Boolean(apartment?.apartmentId),
  });

  useEffect(() => {
    if (fetchedRequestInfo) {
      onRequestInfoChange?.(fetchedRequestInfo);
    }
  }, [fetchedRequestInfo, onRequestInfoChange]);

  if (!apartment) {
    return (
      <SidebarBlock title="의뢰 정보">
        <EmptyBlockState />
      </SidebarBlock>
    );
  }

  const property = apartment.property;
  const requestInfo = savedRequestInfo ?? fetchedRequestInfo;
  const requestType = requestInfo?.requestType ?? property?.requestType ?? "NONE";
  const headerLabel = REQUEST_TYPE_LABELS[requestType] ?? requestType;
  const loanStateLabel =
    loanStateLabelMap[requestInfo?.loanState ?? "NONE"] ?? "미표시";
  const moveInType = requestInfo
    ? requestInfo.immediateMoveIn
      ? "즉시 입주"
      : "입주일 지정"
    : "즉시 입주";
  const resetKey = `${apartment.apartmentId}-${requestInfo ? "request-info" : "property"}`;
  const updateRequestInfo = (partialRequestInfo: Partial<PropertyRequestInfo>) => {
    onRequestInfoChange?.({
      requestType,
      loanAmount: requestInfo?.loanAmount ?? 0,
      loanState: requestInfo?.loanState ?? "NONE",
      immediateMoveIn: requestInfo?.immediateMoveIn ?? true,
      availableMoveInDate:
        requestInfo?.availableMoveInDate ?? property?.expireDate ?? "",
      registeredAt:
        requestInfo?.registeredAt ?? property?.requestRegistrationDate ?? "",
      salePrice: requestInfo?.salePrice ?? property?.salePrice ?? 0,
      existingJeonseDeposit:
        requestInfo?.existingJeonseDeposit ?? property?.jeonsePrice ?? 0,
      existingMonthlyRent:
        requestInfo?.existingMonthlyRent ?? property?.monthPrice ?? 0,
      jeonsePrice: requestInfo?.jeonsePrice ?? property?.jeonsePrice ?? 0,
      monthlyDeposit: requestInfo?.monthlyDeposit ?? property?.deposit ?? 0,
      monthlyRent: requestInfo?.monthlyRent ?? property?.monthPrice ?? 0,
      ...partialRequestInfo,
    });
  };

  return (
    <SidebarBlock
      title="의뢰 정보"
      headerAction={
        <span className="rounded-full border border-[#1C2882] bg-[#E8EDFF] px-3 py-1 text-[12px] font-medium tracking-[-0.025em] text-[#1C2882]">
          {headerLabel}
        </span>
      }
    >
      <div key={resetKey} className="flex flex-col gap-3">
        <Field label="의뢰 유형" className="max-w-[180px]">
          <SidebarSelect
            value={requestType}
            options={requestTypeOptions}
            onChange={(value) =>
              updateRequestInfo({ requestType: value as RequestType })
            }
          />
        </Field>

        <div className="flex h-[34px] w-[223px] max-w-full items-center gap-[3px] rounded-full bg-[#DDE2F2] p-1">
          {requestTypeSegments.map((segment) => {
            const isActive = requestType.includes(segment.value);

            return (
              <button
                key={segment.value}
                type="button"
                aria-pressed={isActive}
                tabIndex={-1}
                className={
                  isActive
                    ? "h-[26px] min-w-0 flex-1 cursor-default whitespace-nowrap rounded-full bg-white px-1 text-[12px] font-medium leading-[26px] tracking-[-0.025em] text-[#1B1B1B]"
                    : "h-[26px] min-w-0 flex-1 cursor-default whitespace-nowrap rounded-full px-1 text-[12px] font-medium leading-[26px] tracking-[-0.025em] text-[#B1B6C7]"
                }
              >
                {segment.label}
              </button>
            );
          })}
        </div>

        <FieldRow className="grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
          <Field label="매도 희망가" suffix="만원">
            <SidebarActiveInput
              defaultValue={toInputValue(
                requestInfo?.salePrice ?? property?.salePrice,
              )}
              onChange={(event) =>
                updateRequestInfo({ salePrice: toNumberValue(event.target.value) })
              }
            />
          </Field>
          <Field label="세 끼고 매도">
            <div className="grid grid-cols-[minmax(0,1fr)_14px_64px] items-center gap-2">
              <SidebarInput
                defaultValue={toInputValue(
                  requestInfo?.existingJeonseDeposit ?? property?.jeonsePrice,
                )}
                onChange={(event) =>
                  updateRequestInfo({
                    existingJeonseDeposit: toNumberValue(event.target.value),
                  })
                }
              />
              <span className="mx-auto h-[22px] rotate-[17deg] border-l-2 border-[#B1B6C7]" />
              <SidebarInput
                defaultValue={toInputValue(
                  requestInfo?.existingMonthlyRent ?? property?.monthPrice,
                )}
                onChange={(event) =>
                  updateRequestInfo({
                    existingMonthlyRent: toNumberValue(event.target.value),
                  })
                }
              />
            </div>
          </Field>
        </FieldRow>

        <FieldRow className="grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
          <Field label="전세 희망가" suffix="만원">
            <SidebarInput
              defaultValue={toInputValue(
                requestInfo?.jeonsePrice ?? property?.jeonsePrice,
              )}
              onChange={(event) =>
                updateRequestInfo({ jeonsePrice: toNumberValue(event.target.value) })
              }
            />
          </Field>
          <Field label="월세 희망가">
            <div className="grid grid-cols-[minmax(0,1fr)_14px_64px] items-center gap-2">
              <SidebarInput
                defaultValue={toInputValue(
                  requestInfo?.monthlyDeposit ?? property?.deposit,
                )}
                onChange={(event) =>
                  updateRequestInfo({
                    monthlyDeposit: toNumberValue(event.target.value),
                  })
                }
              />
              <span className="mx-auto h-[22px] rotate-[17deg] border-l-2 border-[#B1B6C7]" />
              <SidebarInput
                defaultValue={toInputValue(
                  requestInfo?.monthlyRent ?? property?.monthPrice,
                )}
                onChange={(event) =>
                  updateRequestInfo({
                    monthlyRent: toNumberValue(event.target.value),
                  })
                }
              />
            </div>
          </Field>
        </FieldRow>

        <div className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] items-end gap-4">
          <Field label="융자여부" suffix="만원">
            <SidebarActiveInput
              defaultValue={toInputValue(requestInfo?.loanAmount)}
              onChange={(event) =>
                updateRequestInfo({ loanAmount: toNumberValue(event.target.value) })
              }
            />
          </Field>
          <ToggleGroup
            value={loanStateLabel}
            options={["미표시", "융자없음", "30% 미만", "30% 이상"]}
            className="grid-cols-4"
            onChange={(value) =>
              updateRequestInfo({ loanState: loanStateValueMap[value] ?? "NONE" })
            }
          />
        </div>

        <FieldRow className="grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-end">
          <Field label="입주가능일">
            <ToggleGroup
              value={moveInType}
              options={["즉시 입주", "입주일 지정"]}
              className="grid-cols-2"
              onChange={(value) =>
                updateRequestInfo({ immediateMoveIn: value === "즉시 입주" })
              }
            />
          </Field>
          <Field label=" ">
            <DateInput
              defaultValue={requestInfo?.availableMoveInDate ?? property?.expireDate}
              popoverPlacement="top"
              onChange={(event) =>
                updateRequestInfo({
                  availableMoveInDate: formatApiDate(event.target.value),
                })
              }
            />
          </Field>
        </FieldRow>

        <Field label="등록일(오늘)" className="max-w-[210px]">
          <DateInput
            defaultValue={
              requestInfo?.registeredAt ?? property?.requestRegistrationDate
            }
            popoverPlacement="top"
            onChange={(event) =>
              updateRequestInfo({ registeredAt: formatApiDate(event.target.value) })
            }
          />
        </Field>
      </div>
    </SidebarBlock>
  );
}
