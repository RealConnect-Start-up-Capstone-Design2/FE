import { Trash2 } from "lucide-react";

import {
  DropdownMenuCell,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderFilter,
  TableRow,
} from "@/shared/ui";
import { formatArea, formatNumber, sqmToPyeong } from "@/shared/utils";
import type {
  Inquiry,
  InquiryStatus,
  ManageType,
  RequestType,
} from "../types/inquiry";
import {
  INQUIRY_STATUS_FILTER_OPTIONS,
  INQUIRY_STATUS_OPTIONS,
  INQUIRY_STATUS_STYLES,
  MANAGE_TYPE_OPTIONS,
  PROPERTY_TYPE_LABELS,
  REQUEST_TYPE_FILTER_OPTIONS,
  REQUEST_TYPE_LABELS,
} from "../types/enums";

interface InquiryManageTableProps {
  inquiries: Inquiry[];
  isLoading?: boolean;
  selectedInquiryId?: number;
  onInquiryClick?: (inquiryId: number) => void;
  onDeleteInquiry?: (inquiryId: number) => void;
  onManageTypeChange?: (inquiryId: number, value: ManageType) => void;
  onStatusChange?: (inquiryId: number, value: InquiryStatus) => void;
  selectedRequestType?: string;
  onSelectRequestType?: (value: string) => void;
  selectedStatus?: string;
  onSelectStatus?: (value: string) => void;
  isSqmOrPyeong?: "sqm" | "pyeong";
}

export function InquiryManageTable({
  inquiries,
  isLoading = false,
  selectedInquiryId,
  onInquiryClick,
  onDeleteInquiry,
  onManageTypeChange,
  onStatusChange,
  selectedRequestType,
  onSelectRequestType,
  selectedStatus,
  onSelectStatus,
  isSqmOrPyeong = "sqm",
}: InquiryManageTableProps) {
  if (isLoading) {
    return (
      <section className="w-full rounded-xl border border-[#DDE2F2] bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-[#6F7789]">
          문의 목록을 불러오는 중입니다.
        </p>
      </section>
    );
  }

  return (
    <div className="h-full overflow-auto rounded-xl border border-[#DDE2F2] bg-white shadow-[0_12px_35px_-28px_rgba(28,40,130,0.55)]">
      <Table className="min-w-[1060px] whitespace-nowrap">
        <TableHeader className="sticky top-0 z-40 bg-[#F1F4FF] shadow-sm">
          <TableRow>
            <TableHead className="w-[86px] text-center">중요도</TableHead>
            <TableHead className="w-[110px]">등록일</TableHead>
            <TableHead className="min-w-[150px]">고객</TableHead>
            <TableHead className="min-w-[250px]">희망 조건</TableHead>
            <TableHeaderFilter
              title="거래 유형"
              value={selectedRequestType}
              onChange={onSelectRequestType}
              options={REQUEST_TYPE_FILTER_OPTIONS}
              className="w-[112px] text-center"
            />
            <TableHead className="min-w-[150px]">예산</TableHead>
            <TableHead className="min-w-[150px]">면적</TableHead>
            <TableHeaderFilter
              title="진행 상태"
              value={selectedStatus}
              onChange={onSelectStatus}
              options={INQUIRY_STATUS_FILTER_OPTIONS}
              className="w-[140px] text-center"
            />
            <TableHead className="w-14">
              <span className="sr-only">삭제</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="h-48 text-center text-sm text-[#8D94A6]"
              >
                조건에 맞는 문의가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            inquiries.map((inquiry) => {
              const status = inquiry.inquiryStatus ?? "NEW";
              const statusStyle =
                status in INQUIRY_STATUS_STYLES
                  ? INQUIRY_STATUS_STYLES[status]
                  : INQUIRY_STATUS_STYLES.NEW;
              const selected = selectedInquiryId === inquiry.inquiryId;

              return (
                <TableRow
                  key={inquiry.inquiryId}
                  tabIndex={0}
                  aria-selected={selected}
                  className={
                    selected
                      ? "cursor-pointer bg-[#EEF3FF] ring-2 ring-inset ring-[#6577D8]"
                      : "cursor-pointer transition-colors hover:bg-[#FAFBFF] focus-visible:bg-[#FAFBFF] focus-visible:outline-none"
                  }
                  onClick={() => onInquiryClick?.(inquiry.inquiryId)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onInquiryClick?.(inquiry.inquiryId);
                    }
                  }}
                >
                  <TableCell className="px-3">
                    <div
                      className="flex justify-center"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <DropdownMenuCell
                        options={MANAGE_TYPE_OPTIONS}
                        value={inquiry.manageType ?? "NONE"}
                        ariaLabel={`${inquiry.title} 중요도 변경`}
                        onChange={(value) =>
                          onManageTypeChange?.(
                            inquiry.inquiryId,
                            value as ManageType,
                          )
                        }
                        hideLabel
                        showCheckmark={false}
                        iconPosition="right"
                        buttonClassName="justify-center bg-[#F5F6FA] px-2"
                        listClassName="flex flex-col"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#6F7789]">
                    {formatDate(inquiry.createdDate)}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-[#222A3A]">
                      {inquiry.inquirerInfo?.inquirerName || "-"}
                    </p>
                    <p className="mt-1 text-xs text-[#7A8295]">
                      {inquiry.inquirerInfo?.contractPhone || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-[290px]">
                    <p className="truncate font-semibold text-[#222A3A]">
                      {inquiry.title || "제목 없음"}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#7A8295]">
                      {inquiry.dong || "지역 미지정"} ·{" "}
                      {PROPERTY_TYPE_LABELS[inquiry.propertyType] ?? "주거용"}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex rounded-full bg-[#EEF1FF] px-3 py-1 text-sm font-semibold text-[#1C2882]">
                      {REQUEST_TYPE_LABELS[
                        inquiry.requestType as RequestType
                      ] ?? inquiry.requestType}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-[#37405A]">
                    {formatBudget(inquiry)}
                  </TableCell>
                  <TableCell className="font-medium text-[#37405A]">
                    {formatAreaRange(
                      inquiry.specs.minArea,
                      inquiry.specs.maxArea,
                      isSqmOrPyeong,
                    )}
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex justify-center"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <DropdownMenuCell
                        options={INQUIRY_STATUS_OPTIONS}
                        value={status}
                        onChange={(value) =>
                          onStatusChange?.(
                            inquiry.inquiryId,
                            value as InquiryStatus,
                          )
                        }
                        buttonClassName={`w-[118px] min-w-[118px] ${statusStyle.bg} ${statusStyle.text}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-3">
                    <button
                      type="button"
                      aria-label={`${inquiry.title} 문의 삭제`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteInquiry?.(inquiry.inquiryId);
                      }}
                      className="rounded-lg p-2 text-[#A0A6B4] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <Trash2 aria-hidden="true" size={17} />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function formatDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : value;
}

function formatAreaRange(
  min: number,
  max: number,
  unit: "sqm" | "pyeong",
): string {
  const convertedMin = unit === "sqm" ? min : sqmToPyeong(min);
  const convertedMax = unit === "sqm" ? max : sqmToPyeong(max);
  return `${formatArea(convertedMin, unit)} ~ ${formatArea(convertedMax, unit)}`;
}

function formatBudget(inquiry: Inquiry): string {
  const specs = inquiry.specs;
  if (inquiry.requestType === "SALE") {
    return moneyRange(specs.minSalePrice, specs.maxSalePrice);
  }
  if (inquiry.requestType === "JEONSE") {
    return moneyRange(specs.minDeposit, specs.maxDeposit);
  }
  return `보 ${moneyRange(specs.minDeposit, specs.maxDeposit)} · 월 ${moneyRange(specs.minMonthlyPrice, specs.maxMonthlyPrice)}`;
}

function moneyRange(min: number, max: number): string {
  const minLabel = formatNumber(min) || "0";
  const maxLabel = formatNumber(max) || "0";
  return min === max ? `${minLabel}만원` : `${minLabel}~${maxLabel}만원`;
}
