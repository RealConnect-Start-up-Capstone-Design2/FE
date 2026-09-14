import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AddInquiryModal } from "@/features/inquiryManage/components/AddInquiryModal";
import type { AddInquiryFormData } from "@/features/inquiryManage/components/AddInquiryModal";
import { InquiryManageHeader } from "@/features/inquiryManage/components/InquiryManageHeader";
import { InquiryManageTable } from "@/features/inquiryManage/components/InquiryManageTable";
import { InquiryMatchSidebar } from "@/features/inquiryManage/components/InquiryMatchSidebar";
import { useInquirySidebar } from "@/features/inquiryManage/hooks";
import {
  createInquiry,
  deleteInquiry,
  fetchInquiries,
  updateInquiryManageType,
  updateInquiryStatus,
} from "@/features/inquiryManage/services/inquiryService";
import type {
  CreateInquiryPayload,
  InquirerInfo,
  InquiriesQueryParams,
  InquiryStatus,
  ManageType,
  RequestType,
} from "@/features/inquiryManage/types/inquiry";
import { SlidingSidebarLayout } from "@/shared/components/detail-sidebar";
import { pyeongToSqm, sqmToPyeong } from "@/shared/utils";

const PAGE_SIZE = 8;

export function InquiryManagePage() {
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRequestType, setSelectedRequestType] = useState<
    RequestType | ""
  >("");
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | "">("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [areaUnit, setAreaUnit] = useState<"sqm" | "pyeong">("sqm");
  const [page, setPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);

  const queryParams = useMemo<InquiriesQueryParams>(() => {
    const minArea = areaMin ? Number(areaMin) : undefined;
    const maxArea = areaMax ? Number(areaMax) : undefined;
    return {
      page,
      size: PAGE_SIZE,
      keyword: searchKeyword.trim() || undefined,
      requestType: selectedRequestType || undefined,
      inquiryStatus: selectedStatus || undefined,
      minPrice: priceMin ? Number(priceMin) : undefined,
      maxPrice: priceMax ? Number(priceMax) : undefined,
      minArea:
        minArea === undefined
          ? undefined
          : areaUnit === "pyeong"
            ? pyeongToSqm(minArea)
            : minArea,
      maxArea:
        maxArea === undefined
          ? undefined
          : areaUnit === "pyeong"
            ? pyeongToSqm(maxArea)
            : maxArea,
    };
  }, [
    areaMax,
    areaMin,
    areaUnit,
    page,
    priceMax,
    priceMin,
    searchKeyword,
    selectedRequestType,
    selectedStatus,
  ]);

  const {
    data: inquiriesResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["inquiries", queryParams],
    queryFn: () => fetchInquiries(queryParams),
    placeholderData: keepPreviousData,
  });
  const inquiries = inquiriesResponse?.content ?? [];

  const {
    selectedInquiryId,
    displayedInquiryId,
    isSidebarOpen,
    handleInquiryClick,
    handleToggleSidebar,
    handleExternalClick,
    closeSidebar,
  } = useInquirySidebar({ inquiries });

  const selectedInquiry = inquiries.find(
    (inquiry) => inquiry.inquiryId === displayedInquiryId,
  );
  const hasActiveFilters = Boolean(
    searchKeyword ||
    selectedRequestType ||
    selectedStatus ||
    priceMin ||
    priceMax ||
    areaMin ||
    areaMax,
  );

  const refreshInquiries = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["inquiries"] });
  }, [queryClient]);

  const handleSaveInquiry = useCallback(
    async (formData: AddInquiryFormData) => {
      setMutationError("");
      const inquirerInfo = [
        createInquirerInfo(
          formData.inquirer1Name,
          formData.inquirer1Relation,
          formData.inquirer1Phone,
        ),
        createInquirerInfo(
          formData.inquirer2Name,
          formData.inquirer2Relation,
          formData.inquirer2Phone,
        ),
      ].filter((info): info is InquirerInfo => info !== null);
      const area1 = toNumber(formData.area1);
      const area2 = toNumber(formData.area2);
      const payload: CreateInquiryPayload = {
        requestType: formData.requestType as RequestType,
        propertyType: formData.propertyType,
        inquirerInfo,
        inquirerAddress: formData.inquirerAddress,
        sido: formData.sido,
        sigungu: formData.sigungu,
        dong: formData.eupmyeondong,
        complexName: formData.complexName,
        minArea: formData.isAreaInPyeong ? pyeongToSqm(area1) : area1,
        maxArea: formData.isAreaInPyeong ? pyeongToSqm(area2) : area2,
        minSalePrice: toNumber(formData.purchasePrice1),
        maxSalePrice: toNumber(formData.purchasePrice2),
        minDeposit: toNumber(formData.deposit1),
        maxDeposit: toNumber(formData.deposit2),
        minMonthlyPrice: toNumber(formData.monthlyRent1),
        maxMonthlyPrice: toNumber(formData.monthlyRent2),
        moveInBy: formData.moveInBy,
        title: formData.title,
        publicDescription: formData.publicDescription,
        privateNote: formData.privateNote,
      };

      try {
        await createInquiry(payload);
        setPage(0);
        await refreshInquiries();
        setIsAddModalOpen(false);
      } catch (error) {
        setMutationError("문의 저장에 실패했습니다. 입력값을 확인해 주세요.");
        throw error;
      }
    },
    [refreshInquiries],
  );

  const handleDeleteInquiry = useCallback(
    async (inquiryId: number) => {
      if (!window.confirm("이 문의를 샘플 원장에서 삭제할까요?")) return;
      setMutationError("");
      try {
        await deleteInquiry(inquiryId);
        if (selectedInquiryId === inquiryId) closeSidebar(true);
        await refreshInquiries();
      } catch {
        setMutationError("문의 삭제에 실패했습니다.");
      }
    },
    [closeSidebar, refreshInquiries, selectedInquiryId],
  );

  const handleManageTypeChange = useCallback(
    async (inquiryId: number, manageType: ManageType) => {
      setMutationError("");
      try {
        await updateInquiryManageType(inquiryId, manageType);
        await Promise.all([
          refreshInquiries(),
          queryClient.invalidateQueries({
            queryKey: ["inquiry-detail", inquiryId],
          }),
        ]);
      } catch {
        setMutationError("중요도 변경에 실패했습니다.");
      }
    },
    [queryClient, refreshInquiries],
  );

  const handleStatusChange = useCallback(
    async (inquiryId: number, status: InquiryStatus) => {
      setMutationError("");
      try {
        await updateInquiryStatus(inquiryId, status);
        await Promise.all([
          refreshInquiries(),
          queryClient.invalidateQueries({
            queryKey: ["inquiry-detail", inquiryId],
          }),
        ]);
      } catch {
        setMutationError("진행 상태 변경에 실패했습니다.");
      }
    },
    [queryClient, refreshInquiries],
  );

  const resetFilters = useCallback(() => {
    setSearchKeyword("");
    setSelectedRequestType("");
    setSelectedStatus("");
    setPriceMin("");
    setPriceMax("");
    setAreaMin("");
    setAreaMax("");
    setPage(0);
  }, []);

  const convertAreaUnit = useCallback(() => {
    const toConvertedValue = (value: string) => {
      if (!value) return "";
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) return "";
      const converted =
        areaUnit === "sqm"
          ? sqmToPyeong(numericValue)
          : pyeongToSqm(numericValue);
      return String(Number(converted.toFixed(2)));
    };

    setAreaMin(toConvertedValue);
    setAreaMax(toConvertedValue);
    setAreaUnit((current) => (current === "sqm" ? "pyeong" : "sqm"));
    setPage(0);
  }, [areaUnit]);

  useEffect(() => {
    if (!isSidebarOpen && selectedInquiryId === undefined) return;
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (sidebarRef.current?.contains(target)) return;
      if (tableContainerRef.current?.contains(target)) return;
      if (
        target instanceof HTMLElement &&
        target.closest("[data-sidebar-toggle='true']")
      ) {
        return;
      }
      handleExternalClick();
    };
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () =>
      document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, [handleExternalClick, isSidebarOpen, selectedInquiryId]);

  return (
    <SlidingSidebarLayout
      isOpen={isSidebarOpen}
      sidebarWidth={540}
      onToggle={handleToggleSidebar}
      sidebarRef={sidebarRef}
      sidebar={
        <InquiryMatchSidebar
          inquiry={selectedInquiry}
          onClose={() => closeSidebar(true)}
        />
      }
    >
      <div className="flex h-full min-h-[720px] flex-col gap-5">
        <InquiryManageHeader
          onAddInquiry={() => setIsAddModalOpen(true)}
          searchKeyword={searchKeyword}
          onSearchKeywordChange={(value) => {
            setSearchKeyword(value);
            setPage(0);
          }}
          priceMin={priceMin}
          onPriceMinChange={(value) => {
            setPriceMin(value);
            setPage(0);
          }}
          priceMax={priceMax}
          onPriceMaxChange={(value) => {
            setPriceMax(value);
            setPage(0);
          }}
          areaMin={areaMin}
          onAreaMinChange={(value) => {
            setAreaMin(value);
            setPage(0);
          }}
          areaMax={areaMax}
          onAreaMaxChange={(value) => {
            setAreaMax(value);
            setPage(0);
          }}
          isSqmOrPyeong={areaUnit}
          onSqmOrPyeongChange={convertAreaUnit}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />

        {mutationError || isError ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {mutationError || "문의 목록을 불러오지 못했습니다."}
          </div>
        ) : null}

        <div ref={tableContainerRef} className="min-h-0 flex-1">
          <InquiryManageTable
            inquiries={inquiries}
            isLoading={isLoading}
            selectedInquiryId={selectedInquiryId}
            onInquiryClick={handleInquiryClick}
            onDeleteInquiry={handleDeleteInquiry}
            onManageTypeChange={handleManageTypeChange}
            onStatusChange={handleStatusChange}
            selectedRequestType={selectedRequestType}
            onSelectRequestType={(value) => {
              setSelectedRequestType(value as RequestType | "");
              setPage(0);
            }}
            selectedStatus={selectedStatus}
            onSelectStatus={(value) => {
              setSelectedStatus(value as InquiryStatus | "");
              setPage(0);
            }}
            isSqmOrPyeong={areaUnit}
          />
        </div>

        <Pagination
          page={inquiriesResponse?.currentPage ?? 0}
          totalPages={inquiriesResponse?.totalPages ?? 1}
          totalItems={inquiriesResponse?.totalElements ?? 0}
          onChange={setPage}
        />
      </div>

      <AddInquiryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveInquiry}
      />
    </SlidingSidebarLayout>
  );
}

function Pagination({
  page,
  totalPages,
  totalItems,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-[#6F7789]">
      <span>총 {totalItems}건</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 0}
          onClick={() => onChange(page - 1)}
          className="rounded-lg border border-[#D9DEEB] bg-white p-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <span className="min-w-20 text-center font-semibold text-[#37405A]">
          {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= totalPages - 1}
          onClick={() => onChange(page + 1)}
          className="rounded-lg border border-[#D9DEEB] bg-white p-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function createInquirerInfo(
  name: string,
  relation: string,
  phone: string,
): InquirerInfo | null {
  return name || phone
    ? { inquirerName: name, inquirerRelation: relation, contractPhone: phone }
    : null;
}

function toNumber(value: string): number {
  if (!value.trim()) return 0;
  const parsed = Number(value.replaceAll(",", ""));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}
