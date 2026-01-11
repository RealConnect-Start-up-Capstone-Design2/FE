import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Inquiry,
  InquiryRequestType,
  InquiryStatus,
} from "@/features/inquiryManage/types/inquiry";
import { pyeongToSqm } from "@/shared/utils";

// 더미 데이터 기본 템플릿
const baseInquiry = {
  region: "신천동",
  complex: "파크리오",
  registeredDate: "25. 03. 02.",
  title: "강남 지역 아파트 매매 문의입니다. 전망이 좋은 고층 아파트",
  area1: 151,
  area2: 151,
  deposit1: 220000,
  deposit2: 220000,
  purchasePrice1: 220000,
  purchasePrice2: 220000,
  monthlyRent1: 220000,
  monthlyRent2: 220000,
  inquirer: "김철수",
  inquirerPhone: "010-1234-5678",
};

// 더미 데이터 (추후 API 연동 시 제거)
const MOCK_INQUIRIES: Inquiry[] = [
  {
    ...baseInquiry,
    inquiryId: 1,
    propertyType: "APARTMENT",
    requestType: "SALE",
    status: "GENERAL",
    isFavorite: false,
  },
  {
    ...baseInquiry,
    inquiryId: 2,
    propertyType: "COMMERCIAL",
    requestType: "JEONSE",
    status: "CO_BROKERAGE",
    isFavorite: true,
  },
  {
    ...baseInquiry,
    inquiryId: 3,
    propertyType: "OFFICETEL",
    requestType: "MONTHLY",
    status: "COMPLETED",
    isFavorite: true,
  },
  {
    ...baseInquiry,
    inquiryId: 4,
    propertyType: "APARTMENT",
    requestType: "SALE",
    status: "GENERAL",
    isFavorite: true,
  },
  {
    ...baseInquiry,
    inquiryId: 5,
    propertyType: "APARTMENT",
    requestType: "SALE",
    status: "GENERAL",
    isFavorite: true,
  },
  {
    ...baseInquiry,
    inquiryId: 6,
    propertyType: "APARTMENT",
    requestType: "SALE",
    status: "GENERAL",
    isFavorite: false,
  },
  {
    ...baseInquiry,
    inquiryId: 7,
    propertyType: "APARTMENT",
    requestType: "SALE",
    status: "GENERAL",
    isFavorite: true,
  },
  {
    ...baseInquiry,
    inquiryId: 8,
    propertyType: "APARTMENT",
    requestType: "SALE",
    status: "GENERAL",
    isFavorite: true,
  },
];

export function InquiryManagePage() {
  // 상태 관리
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [isLoading] = useState(false);

  // 검색 및 필터 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPriceType, setSelectedPriceType] = useState("SALE");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [isSqmOrPyeong, setIsSqmOrPyeong] = useState<"sqm" | "pyeong">("sqm");

  // 테이블 필터 상태
  const [selectedRequestType, setSelectedRequestType] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();

  // 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Refs
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);

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
    return `${selectedInquiry.complex} - ${selectedInquiry.title}`;
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
      // 면적 변환 (평으로 입력된 경우 ㎡로 변환)
      const area1Value = formData.area1
        ? parseFloat(formData.area1)
        : undefined;
      const area2Value = formData.area2
        ? parseFloat(formData.area2)
        : undefined;
      const area1 = area1Value
        ? formData.isAreaInPyeong
          ? pyeongToSqm(area1Value)
          : area1Value
        : undefined;
      const area2 = area2Value
        ? formData.isAreaInPyeong
          ? pyeongToSqm(area2Value)
          : area2Value
        : undefined;

      // 새 문의 생성 (임시 ID)
      const newInquiry: Inquiry = {
        inquiryId: Date.now(), // 임시 ID (실제로는 서버에서 발급)
        region:
          formData.eupmyeondong || formData.sigungu || formData.sido || "",
        complex: formData.complexName,
        propertyType: formData.propertyType,
        registeredDate: new Date().toLocaleDateString("ko-KR", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        }),
        title: formData.title,
        requestType: formData.requestType,
        status: "GENERAL",
        area1,
        area2,
        deposit1: formData.deposit1 ? parseFloat(formData.deposit1) : undefined,
        deposit2: formData.deposit2 ? parseFloat(formData.deposit2) : undefined,
        purchasePrice1: formData.purchasePrice1
          ? parseFloat(formData.purchasePrice1)
          : undefined,
        purchasePrice2: formData.purchasePrice2
          ? parseFloat(formData.purchasePrice2)
          : undefined,
        monthlyRent1: formData.monthlyRent1
          ? parseFloat(formData.monthlyRent1)
          : undefined,
        monthlyRent2: formData.monthlyRent2
          ? parseFloat(formData.monthlyRent2)
          : undefined,
        inquirer: formData.inquirer1Name,
        inquirerPhone: formData.inquirer1Phone,
        isFavorite: false,
        memo: formData.privateNote,
      };

      // TODO: 실제 API 호출로 대체
      setInquiries((prev) => [newInquiry, ...prev]);
    },
    []
  );

  // 문의 삭제
  const handleDeleteInquiry = useCallback((inquiryId: number) => {
    if (confirm("정말로 이 문의를 삭제하시겠습니까?")) {
      setInquiries((prev) => prev.filter((inq) => inq.inquiryId !== inquiryId));
    }
  }, []);

  // 즐겨찾기 토글
  const handleToggleFavorite = useCallback((inquiryId: number) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.inquiryId === inquiryId
          ? { ...inq, isFavorite: !inq.isFavorite }
          : inq
      )
    );
  }, []);

  // 의뢰 유형 변경
  const handleRequestTypeChange = useCallback(
    (inquiryId: number, value: InquiryRequestType) => {
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.inquiryId === inquiryId ? { ...inq, requestType: value } : inq
        )
      );
    },
    []
  );

  // 의뢰 상태 변경
  const handleStatusChange = useCallback(
    (inquiryId: number, value: InquiryStatus) => {
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.inquiryId === inquiryId ? { ...inq, status: value } : inq
        )
      );
    },
    []
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
          selectedPriceType={selectedPriceType}
          onSelectPriceType={setSelectedPriceType}
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
            onRequestTypeChange={handleRequestTypeChange}
            onStatusChange={handleStatusChange}
            selectedRequestType={selectedRequestType}
            onSelectRequestType={setSelectedRequestType}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            isSqmOrPyeong={isSqmOrPyeong}
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
