import { useMemo } from "react";
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
import type {
  Inquiry,
  InquiryRequestType,
  InquiryStatus,
} from "../types/inquiry";
import { sqmToPyeong, formatArea, formatNumberWithComma } from "@/shared/utils";
import { Trash2 } from "lucide-react";

// 이미지 불러오기
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";

// 의뢰 상태 옵션
const statusOptions = [
  { label: "일반", value: "GENERAL" },
  { label: "소개", value: "INTRODUCTION" },
  { label: "공동중개", value: "CO_BROKERAGE" },
  { label: "완료", value: "COMPLETED" },
];
const statusOptionsForCell = statusOptions;

// 의뢰 유형 옵션
const requestTypeOptions = [
  { label: "전체", value: "NONE" },
  { label: "매도", value: "SALE" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY" },
  { label: "미수령", value: "NOT_RECEIVED" },
  { label: "생각중", value: "THINKING" },
];
// 전체는 테이블 body에서 보여질 필요가 없으니까 제외
const requestTypeOptionsForCell = requestTypeOptions.slice(1);

// 물건 종류 라벨
const propertyTypeLabels: Record<string, string> = {
  APARTMENT: "아파트",
  OFFICETEL: "오피스텔",
  COMMERCIAL: "상가",
  VILLA: "빌라",
};

// 의뢰 상태 스타일
const defaultStatusStyle = { bg: "bg-[#EDEDED]", text: "text-[#1B1B1B]" };
const statusStyles: Record<InquiryStatus, { bg: string; text: string }> = {
  GENERAL: defaultStatusStyle,
  INTRODUCTION: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
  CO_BROKERAGE: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
  COMPLETED: { bg: "bg-[#E8EDFF]", text: "text-[#1C2882]" },
};

interface InquiryManageTableProps {
  inquiries: Inquiry[];
  isLoading?: boolean;
  selectedInquiryId?: number;
  onInquiryClick?: (inquiryId: number) => void;
  onDeleteInquiry?: (inquiryId: number) => void;
  onToggleFavorite?: (inquiryId: number) => void;
  onRequestTypeChange?: (inquiryId: number, value: InquiryRequestType) => void;
  onStatusChange?: (inquiryId: number, value: InquiryStatus) => void;
  // 필터 props
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
  onToggleFavorite,
  onRequestTypeChange,
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
      return `${area}㎡`;
    }
    return formatArea(sqmToPyeong(area), "pyeong");
  };

  const hasInquiries = inquiries.length > 0;

  // 필터링된 문의 목록
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      // 의뢰 유형 필터
      if (
        selectedRequestType &&
        selectedRequestType !== "NONE" &&
        inquiry.requestType !== selectedRequestType
      ) {
        return false;
      }
      // 의뢰 상태 필터
      if (
        selectedStatus &&
        selectedStatus !== "GENERAL" &&
        inquiry.status !== selectedStatus
      ) {
        return false;
      }
      return true;
    });
  }, [inquiries, selectedRequestType, selectedStatus]);

  if (isLoading) {
    return (
      <section className="w-full rounded-lg border border-[#DDE2F2] bg-white shadow-sm p-8 text-center">
        <p className="text-gray-500">문의 목록을 불러오는 중...</p>
      </section>
    );
  }

  return (
    <div
      className="h-full rounded-lg bg-white overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <Table className="min-w-[1000px] whitespace-nowrap">
        <TableHeader className="sticky top-0 z-40 shadow-sm bg-[#E8EDFF]">
          <TableRow>
            <TableHead className="w-16 text-center">
              <span className="flex items-center justify-center gap-1">
                즐겨찾기
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
            <TableHead>단지</TableHead>
            <TableHead className="min-w-[170px]">문의 제목</TableHead>
            <TableHeaderFilter
              title="의뢰 상태"
              value={selectedStatus}
              onChange={onSelectStatus}
              options={statusOptions}
              className="w-28 text-center"
            />
            <TableHeaderFilter
              title="의뢰 유형"
              value={selectedRequestType}
              onChange={onSelectRequestType}
              options={requestTypeOptions}
              className="w-24 text-center"
            />
            <TableHead>면적1</TableHead>
            <TableHead>면적2</TableHead>
            <TableHead>보증금1</TableHead>
            <TableHead>보증금2</TableHead>
            <TableHead>매수가1</TableHead>
            <TableHead>매수가2</TableHead>
            <TableHead>월세1</TableHead>
            <TableHead>월세2</TableHead>
            <TableHead>문의자</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasInquiries || filteredInquiries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={17}
                className="py-10 text-center text-sm text-gray-400"
              >
                {!hasInquiries
                  ? "등록된 문의가 없습니다."
                  : "조건에 해당하는 문의가 없습니다."}
              </TableCell>
            </TableRow>
          ) : (
            filteredInquiries.map((inquiry) => {
              const isSelected = selectedInquiryId === inquiry.inquiryId;
              const statusStyle =
                statusStyles[inquiry.status] || defaultStatusStyle;

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
                  {/* 즐겨찾기 */}
                  <TableCell className="px-2 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite?.(inquiry.inquiryId);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <img
                          src={inquiry.isFavorite ? FilledStar : UnfilledStar}
                          alt={
                            inquiry.isFavorite ? "즐겨찾기 해제" : "즐겨찾기"
                          }
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </TableCell>

                  {/* 등록일 */}
                  <TableCell className="py-4">
                    {inquiry.registeredDate}
                  </TableCell>

                  {/* 물건 종류 */}
                  <TableCell className="py-4">
                    {propertyTypeLabels[inquiry.propertyType] ||
                      inquiry.propertyType}
                  </TableCell>

                  {/* 지역 */}
                  <TableCell className="py-4">{inquiry.region}</TableCell>

                  {/* 단지 */}
                  <TableCell className="py-4">{inquiry.complex}</TableCell>

                  {/* 문의 제목 */}
                  <TableCell className="py-4 max-w-0">
                    <div className="truncate">{inquiry.title}</div>
                  </TableCell>

                  {/* 의뢰 상태 */}
                  <TableCell className="py-4">
                    <div
                      className="flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuCell
                        options={statusOptionsForCell}
                        value={inquiry.status}
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

                  {/* 의뢰 유형 */}
                  <TableCell className="py-4">
                    <div
                      className="flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuCell
                        options={requestTypeOptionsForCell}
                        value={inquiry.requestType}
                        onChange={(value) => {
                          onRequestTypeChange?.(
                            inquiry.inquiryId,
                            value as InquiryRequestType
                          );
                        }}
                        buttonClassName="w-[70px] min-w-[70px] bg-[#EDEDED]"
                      />
                    </div>
                  </TableCell>

                  {/* 면적1 */}
                  <TableCell className="py-4">
                    {formatAreaDisplay(inquiry.area1)}
                  </TableCell>

                  {/* 면적2 */}
                  <TableCell className="py-4">
                    {formatAreaDisplay(inquiry.area2)}
                  </TableCell>

                  {/* 보증금1 */}
                  <TableCell className="py-4">
                    {formatNumberWithComma(inquiry.deposit1)}
                  </TableCell>

                  {/* 보증금2 */}
                  <TableCell className="py-4">
                    {formatNumberWithComma(inquiry.deposit2)}
                  </TableCell>

                  {/* 매수가1 */}
                  <TableCell className="py-4">
                    {formatNumberWithComma(inquiry.purchasePrice1)}
                  </TableCell>

                  {/* 매수가2 */}
                  <TableCell className="py-4">
                    {formatNumberWithComma(inquiry.purchasePrice2)}
                  </TableCell>

                  {/* 월세1 */}
                  <TableCell className="py-4">
                    {formatNumberWithComma(inquiry.monthlyRent1)}
                  </TableCell>

                  {/* 월세2 */}
                  <TableCell className="py-4">
                    {formatNumberWithComma(inquiry.monthlyRent2)}
                  </TableCell>

                  {/* 문의자 */}
                  <TableCell className="py-4">{inquiry.inquirer}</TableCell>

                  {/* 연락처 */}
                  <TableCell className="py-4">
                    {inquiry.inquirerPhone}
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
  );
}
