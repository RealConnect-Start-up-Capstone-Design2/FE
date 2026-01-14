import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InquiryManageHeader } from "@/features/inquiryManage/components/InquiryManageHeader";
import { InquiryManageTable } from "@/features/inquiryManage/components/InquiryManageTable";
import { AddInquiryModal } from "@/features/inquiryManage/components/AddInquiryModal";
import type { AddInquiryFormData } from "@/features/inquiryManage/components/AddInquiryModal";
import { useInquirySidebar } from "@/features/inquiryManage/hooks";
import {
  DetailSidebar,
  SlidingSidebarLayout,
} from "@/components/common/detail-sidebar";
import type {
  InquiryStatus,
  RequestType,
  InquiriesQueryParams,
  CreateInquiryPayload,
  InquirerInfo,
} from "@/features/inquiryManage/types/inquiry";
import {
  fetchInquiries,
  createInquiry,
} from "@/features/inquiryManage/services/inquiryService";
import { pyeongToSqm } from "@/shared/utils";

// 헬퍼 함수: 문의자 정보 생성
const createInquirerInfo = (
  name: string,
  relation: string,
  phone: string
): InquirerInfo | null =>
  name || phone
    ? { inquirerName: name, inquirerRelation: relation, contractPhone: phone }
    : null;

// 헬퍼 함수: 문자열을 숫자로 변환 (빈 값은 0)
const toNumber = (value: string): number => (value ? parseFloat(value) : 0);

export function InquiryManagePage() {
  // 검색 및 필터 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRequestType, setSelectedRequestType] = useState<
    RequestType | ""
  >("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [isSqmOrPyeong, setIsSqmOrPyeong] = useState<"sqm" | "pyeong">("sqm");

  // 테이블 필터 상태 (서버 쿼리에 사용)
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | "">();

  // 페이지네이션 상태
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Refs
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);

  // API 쿼리 파라미터 생성
  const queryParams: InquiriesQueryParams = useMemo(() => {
    const params: InquiriesQueryParams = {
      page,
      size,
    };

    if (searchKeyword) params.keyword = searchKeyword;
    if (selectedRequestType) params.requestType = selectedRequestType;
    if (selectedStatus) params.inquiryStatus = selectedStatus;
    if (priceMin) params.minPrice = parseInt(priceMin, 10);
    if (priceMax) params.maxPrice = parseInt(priceMax, 10);

    // 면적 변환 (평 -> ㎡)
    if (areaMin) {
      const areaMinValue = parseFloat(areaMin);
      params.minArea =
        isSqmOrPyeong === "pyeong" ? pyeongToSqm(areaMinValue) : areaMinValue;
    }
    if (areaMax) {
      const areaMaxValue = parseFloat(areaMax);
      params.maxArea =
        isSqmOrPyeong === "pyeong" ? pyeongToSqm(areaMaxValue) : areaMaxValue;
    }

    return params;
  }, [
    page,
    size,
    searchKeyword,
    selectedRequestType,
    selectedStatus,
    priceMin,
    priceMax,
    areaMin,
    areaMax,
    isSqmOrPyeong,
  ]);

  // 문의 목록 조회
  const {
    data: inquiriesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["inquiries", queryParams],
    queryFn: () => fetchInquiries(queryParams),
  });

  const inquiries = useMemo(
    () => inquiriesResponse?.content ?? [],
    [inquiriesResponse?.content]
  );

  // 사이드바 훅
  const {
    selectedInquiryId,
    displayedInquiryId,
    isSidebarOpen,
    handleInquiryClick,
    handleToggleSidebar,
    handleExternalClick,
    closeSidebar,
  } = useInquirySidebar({ inquiries });

  // 선택된 문의
  const selectedInquiry = useMemo(() => {
    return inquiries.find((inq) => inq.inquiryId === displayedInquiryId);
  }, [inquiries, displayedInquiryId]);

  // 사이드바 타이틀
  const detailSidebarTitle = useMemo(() => {
    if (!selectedInquiry) {
      return "문의 상세 정보";
    }
    return `${selectedInquiry.dong || ""} - ${selectedInquiry.title}`;
  }, [selectedInquiry]);

  // 면적 단위 변환
  const handleSqmOrPyeongChange = useCallback(() => {
    setIsSqmOrPyeong((prev) => (prev === "sqm" ? "pyeong" : "sqm"));
  }, []);

  // 문의 추가 모달 열기
  const handleAddInquiry = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  // 문의 추가 모달 닫기
  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  // 문의 저장 핸들러
  const handleSaveInquiry = useCallback(
    async (formData: AddInquiryFormData) => {
      // 문의자 정보 배열 생성
      const inquirerInfo = [
        createInquirerInfo(
          formData.inquirer1Name,
          formData.inquirer1Relation,
          formData.inquirer1Phone
        ),
        createInquirerInfo(
          formData.inquirer2Name,
          formData.inquirer2Relation,
          formData.inquirer2Phone
        ),
      ].filter((info): info is InquirerInfo => info !== null);

      // 면적 변환 (평 → ㎡)
      const area1 = toNumber(formData.area1);
      const area2 = toNumber(formData.area2);
      const minArea = formData.isAreaInPyeong ? pyeongToSqm(area1) : area1;
      const maxArea = formData.isAreaInPyeong ? pyeongToSqm(area2) : area2;

      // 백엔드 요청 payload 생성
      const payload: CreateInquiryPayload = {
        requestType: formData.requestType as RequestType,
        propertyType: formData.propertyType,
        inquirerInfo,
        inquirerAddress: formData.inquirerAddress,
        sido: formData.sido,
        sigungu: formData.sigungu,
        dong: formData.eupmyeondong,
        complexName: formData.complexName,
        minArea,
        maxArea,
        minSalePrice: toNumber(formData.purchasePrice1),
        maxSalePrice: toNumber(formData.purchasePrice2),
        minDeposit: toNumber(formData.deposit1),
        maxDeposit: toNumber(formData.deposit2),
        minMonthlyPrice: toNumber(formData.monthlyRent1),
        maxMonthlyPrice: toNumber(formData.monthlyRent2),
        title: formData.title,
        publicDescription: formData.publicDescription,
        privateNote: formData.privateNote,
      };

      // API 호출
      await createInquiry(payload);

      // 목록 새로고침
      await refetch();
      setIsAddModalOpen(false);
    },
    [refetch]
  );

  // 문의 삭제
  const handleDeleteInquiry = useCallback(
    async (inquiryId: number) => {
      if (confirm("정말로 이 문의를 삭제하시겠습니까?")) {
        // TODO: 실제 삭제 API 연동
        console.log("Delete inquiry:", inquiryId);
        await refetch();
      }
    },
    [refetch]
  );

  // 즐겨찾기 토글
  const handleToggleFavorite = useCallback(
    async (inquiryId: number) => {
      // TODO: 실제 즐겨찾기 토글 API 연동
      console.log("Toggle favorite:", inquiryId);
      await refetch();
    },
    [refetch]
  );

  // 의뢰 상태 변경
  const handleStatusChange = useCallback(
    async (inquiryId: number, value: InquiryStatus) => {
      // TODO: 실제 상태 변경 API 연동
      console.log("Change status:", inquiryId, value);
      await refetch();
    },
    [refetch]
  );

  // 외부 클릭 핸들러
  useEffect(() => {
    if (!isSidebarOpen && selectedInquiryId === undefined) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      // 사이드바, 테이블, 토글 버튼 내부 클릭은 무시
      if (sidebarRef.current?.contains(target)) return;
      if (tableContainerRef.current?.contains(target)) return;
      if (
        target instanceof HTMLElement &&
        target.closest("[data-sidebar-toggle='true']")
      )
        return;

      handleExternalClick();
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () =>
      document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, [handleExternalClick, isSidebarOpen, selectedInquiryId]);

  return (
    <SlidingSidebarLayout
      isOpen={isSidebarOpen}
      onToggle={handleToggleSidebar}
      sidebarRef={sidebarRef}
      sidebar={
        <DetailSidebar
          title={detailSidebarTitle}
          onClose={() => closeSidebar(true)}
        >
          {/* 사이드바 내부 blocks는 추후 구현 예정 */}
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>문의 상세 정보가 여기에 표시됩니다.</p>
          </div>
        </DetailSidebar>
      }
    >
      <div className="flex flex-col gap-6 h-full">
        <InquiryManageHeader
          onAddInquiry={handleAddInquiry}
          searchKeyword={searchKeyword}
          onSearchKeywordChange={setSearchKeyword}
          priceMin={priceMin}
          onPriceMinChange={setPriceMin}
          priceMax={priceMax}
          onPriceMaxChange={setPriceMax}
          areaMin={areaMin}
          onAreaMinChange={setAreaMin}
          areaMax={areaMax}
          onAreaMaxChange={setAreaMax}
          isSqmOrPyeong={isSqmOrPyeong}
          onSqmOrPyeongChange={handleSqmOrPyeongChange}
        />
        <div ref={tableContainerRef} className="flex-1 overflow-hidden">
          <InquiryManageTable
            inquiries={inquiries}
            isLoading={isLoading}
            selectedInquiryId={selectedInquiryId}
            onInquiryClick={handleInquiryClick}
            onDeleteInquiry={handleDeleteInquiry}
            onToggleFavorite={handleToggleFavorite}
            onStatusChange={handleStatusChange}
            selectedRequestType={selectedRequestType}
            onSelectRequestType={(value) =>
              setSelectedRequestType(value as RequestType | "")
            }
            selectedStatus={selectedStatus}
            onSelectStatus={(value) =>
              setSelectedStatus(value as InquiryStatus | "")
            }
            isSqmOrPyeong={isSqmOrPyeong}
            // 페이지네이션 정보
            currentPage={inquiriesResponse?.currentPage ?? 0}
            totalPages={inquiriesResponse?.totalPages ?? 0}
            totalElements={inquiriesResponse?.totalElements ?? 0}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* 문의 추가 모달 */}
      <AddInquiryModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveInquiry}
      />
    </SlidingSidebarLayout>
  );
}
