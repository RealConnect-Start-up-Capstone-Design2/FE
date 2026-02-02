import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { DropdownMenuCell } from "@/components/ui";
import { TableHeaderFilter } from "@/components/ui";
import type { Inquiry, InquiryStatus, ManageType, PropertyType, RequestType } from "../types/inquiry";
import { sqmToPyeong, formatArea, formatNumber } from "@/shared/utils";
import { Trash2 } from "lucide-react";
import {
  REQUEST_TYPE_FILTER_OPTIONS,
  INQUIRY_STATUS_OPTIONS,
  INQUIRY_STATUS_STYLES,
  PROPERTY_TYPE_LABELS,
  REQUEST_TYPE_LABELS,
  MANAGE_TYPE_OPTIONS,
} from "../types/enums";

interface InquiryManageTableProps {
  inquiries: Inquiry[];
  isLoading?: boolean;
  selectedInquiryId?: number;
  onInquiryClick?: (inquiryId: number) => void;
  onDeleteInquiry?: (inquiryId: number) => void;
  onManageTypeChange?: (inquiryId: number, value: ManageType) => void;
  onStatusChange?: (inquiryId: number, value: InquiryStatus) => void;
  // 필터 props
  selectedRequestType?: string;
  onSelectRequestType?: (value: string) => void;
  selectedStatus?: string;
  onSelectStatus?: (value: string) => void;
  isSqmOrPyeong?: "sqm" | "pyeong";
  // 페이지네이션 props
  currentPage?: number;
  totalPages?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
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
  const formatAreaDisplay = (area?: number) => {
    if (area === undefined || area === null || area === 0) return "-";
    if (isSqmOrPyeong === "sqm") {
      return `${area.toFixed(2)}㎡`;
    }
    return formatArea(sqmToPyeong(area), "pyeong");
  };

  const hasInquiries = inquiries.length > 0;

  if (isLoading) {
    return (
      <section className="w-full rounded-lg border border-[#DDE2F2] bg-white shadow-sm p-8 text-center">
        <p className="text-gray-500">문의 목록을 불러오는 중...</p>
      </section>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 rounded-lg bg-white overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Table className="min-w-[1000px] whitespace-nowrap">
          <TableHeader className="sticky top-0 z-40 shadow-sm bg-[#E8EDFF]">
            <TableRow>
              <TableHead className="w-16 text-center">
                <span className="flex items-center justify-center gap-1">
                  관리 타입
                  <svg
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none"
                    className="mt-0.5"
                  >
                    <path
                      d="M3.5 6L0.5 1.5H6.5L3.5 6Z"
                      fill="#8D8D8D"
                      stroke="#8D8D8D"
                      strokeWidth="1"
                    />
                  </svg>
                </span>
              </TableHead>
              <TableHead>등록일</TableHead>
              <TableHead>물건 종류</TableHead>
              <TableHead>지역</TableHead>
              <TableHead className="min-w-[150px]">문의 제목</TableHead>
              <TableHeaderFilter
                title="의뢰 상태"
                value={selectedStatus}
                onChange={onSelectStatus}
                options={INQUIRY_STATUS_OPTIONS}
                className="w-28 text-center"
              />
              <TableHeaderFilter
                title="의뢰 유형"
                value={selectedRequestType}
                onChange={onSelectRequestType}
                options={REQUEST_TYPE_FILTER_OPTIONS}
                className="w-24 text-center"
              />
              <TableHead>면적1</TableHead>
              <TableHead>면적2</TableHead>
              <TableHead>보증금1</TableHead>
              <TableHead>보증금2</TableHead>
              <TableHead>매매가1</TableHead>
              <TableHead>매매가2</TableHead>
              <TableHead>월세1</TableHead>
              <TableHead>월세2</TableHead>
              <TableHead>문의자</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!hasInquiries ? (
              <TableRow>
                <TableCell
                  colSpan={18}
                  className="py-10 text-center text-sm text-gray-400"
                >
                  등록된 문의가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => {
                const isSelected = selectedInquiryId === inquiry.inquiryId;
                const statusStyle =
                  inquiry.inquiryStatus && inquiry.inquiryStatus in INQUIRY_STATUS_STYLES
                    ? INQUIRY_STATUS_STYLES[inquiry.inquiryStatus as InquiryStatus]
                    : INQUIRY_STATUS_STYLES.GENERAL;

                return (
                  <TableRow
                    key={inquiry.inquiryId}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      isSelected
                        ? "bg-[#EEF6FF] ring-2 ring-inset ring-[#1499FF]"
                        : ""
                    }`}
                    onClick={() => onInquiryClick?.(inquiry.inquiryId)}
                  >
                    {/* 관리 타입 */}
                    <TableCell className="px-2">
                      <div
                        className="flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuCell
                          options={MANAGE_TYPE_OPTIONS}
                          value={inquiry.manageType ?? "NONE"}
                          onChange={(value) => {
                            onManageTypeChange?.(
                              inquiry.inquiryId,
                              value as ManageType
                            );
                          }}
                          hideLabel={true}
                          showCheckmark={false}
                          iconPosition="right"
                          buttonClassName="bg-[#F5F5F5] justify-center px-2"
                          listClassName="flex flex-col"
                        />
                      </div>
                    </TableCell>

                    {/* 등록일 */}
                    <TableCell className="py-4">
                      {inquiry.createdDate}
                    </TableCell>

                    {/* 물건 종류 */}
                    <TableCell className="py-4">
                      {inquiry.propertyType in PROPERTY_TYPE_LABELS
                        ? PROPERTY_TYPE_LABELS[inquiry.propertyType as PropertyType]
                        : inquiry.propertyType}
                    </TableCell>

                    {/* 지역(동) */}
                    <TableCell className="py-4">
                      {inquiry.dong || "-"}
                    </TableCell>

                    {/* 문의 제목 */}
                    <TableCell className="py-4 max-w-[200px]">
                      <div className="truncate">{inquiry.title || "-"}</div>
                    </TableCell>

                    {/* 의뢰 상태 */}
                    <TableCell className="py-4">
                      <div
                        className="flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuCell
                          options={INQUIRY_STATUS_OPTIONS}
                          value={inquiry.inquiryStatus ?? "GENERAL"}
                          onChange={(value) => {
                            onStatusChange?.(
                              inquiry.inquiryId,
                              value as InquiryStatus
                            );
                          }}
                          buttonClassName={`w-[90px] min-w-[90px] ${statusStyle.bg}`}
                        />
                      </div>
                    </TableCell>

                    {/* 의뢰 유형 (읽기 전용) */}
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center">
                        <span className="px-3 py-1.5 text-sm bg-[#EDEDED] rounded-md">
                          {inquiry.requestType in REQUEST_TYPE_LABELS
                            ? REQUEST_TYPE_LABELS[inquiry.requestType as RequestType]
                            : inquiry.requestType || "-"}
                        </span>
                      </div>
                    </TableCell>

                    {/* 최소면적 */}
                    <TableCell className="py-4">
                      {formatAreaDisplay(inquiry.specs?.minArea)}
                    </TableCell>

                    {/* 최대면적 */}
                    <TableCell className="py-4">
                      {formatAreaDisplay(inquiry.specs?.maxArea)}
                    </TableCell>

                    {/* 최소보증금 */}
                    <TableCell className="py-4">
                      {formatNumber(inquiry.specs?.minDeposit) || "-"}
                    </TableCell>

                    {/* 최대보증금 */}
                    <TableCell className="py-4">
                      {formatNumber(inquiry.specs?.maxDeposit) || "-"}
                    </TableCell>

                    {/* 최소매매가 */}
                    <TableCell className="py-4">
                      {formatNumber(inquiry.specs?.minSalePrice) || "-"}
                    </TableCell>

                    {/* 최대매매가 */}
                    <TableCell className="py-4">
                      {formatNumber(inquiry.specs?.maxSalePrice) || "-"}
                    </TableCell>

                    {/* 최소월세 */}
                    <TableCell className="py-4">
                      {formatNumber(inquiry.specs?.minMonthlyPrice) || "-"}
                    </TableCell>

                    {/* 최대월세 */}
                    <TableCell className="py-4">
                      {formatNumber(inquiry.specs?.maxMonthlyPrice) || "-"}
                    </TableCell>

                    {/* 문의자 */}
                    <TableCell className="py-4">
                      {inquiry.inquirerInfo?.inquirerName || "-"}
                    </TableCell>

                    {/* 연락처 */}
                    <TableCell className="py-4">
                      {inquiry.inquirerInfo?.contractPhone || "-"}
                    </TableCell>

                    {/* 삭제 버튼 */}
                    <TableCell className="px-2 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteInquiry?.(inquiry.inquiryId);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-[#989898] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
