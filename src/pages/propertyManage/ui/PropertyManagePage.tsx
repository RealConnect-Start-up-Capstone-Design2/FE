import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  PropertyManagerHeader,
  PropertyManageTable,
} from "@/features/propertyManage";
import {
  DetailSidebar,
  SlidingSidebarLayout,
} from "@/components/common/detail-sidebar";

// 사이드바에 들어가는 블록들
import { PropertyMemoBlock } from "@/features/propertyManage/components/blocks/PropertyMemoBlock";
import { PropertyContractBlock } from "@/features/propertyManage/components/blocks/PropertyContractBlock";
// 평면도 블록은 추후에 들어오면 주석 해제 예정
// import { PropertyFloorPlanBlock } from "@/features/propertyManage/components/blocks/PropertyFloorPlanBlock";

// 서버에서 가져오는 데이터
import {
  fetchPropertyList,
  fetchPropertiesByPhone,
  fetchTotalApartmentCount,
} from "@/features/propertyManage/services/propertyService";
import { fetchPreferredComplexList, fetchAreaList } from "@/shared/api/region";
import type {
  ApartmentWithProperty,
  PropertiesResponse,
  ManageType,
  RequestType,
  PropertyStatus,
} from "@/features/propertyManage/stores/propertyStore";
import type { DropdownOption } from "@/components/ui/dropdown-menu";
import {
  usePropertyFilter,
  usePropertySidebar,
} from "@/features/propertyManage/hooks";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

const manageTypeValues: readonly ManageType[] = [
  "NONE",
  "ATTENTION",
  "CAUTION",
];
const requestTypeValues: readonly RequestType[] = [
  "NONE",
  "SALE",
  "JEONSE",
  "MONTHLY",
  "SALE_JEONSE",
  "SALE_MONTHLY",
  "JEONSE_MONTHLY",
  "SALE_JEONSE_MONTHLY",
];
const propertyStatusValues: readonly PropertyStatus[] = [
  "NONE",
  "BEFORE",
  "ADVERTISING",
  "COMPLETED",
];

const parseEnumValue = <T extends string>(
  value: string | undefined,
  validValues: readonly T[]
): T | undefined => {
  if (!value) return undefined;
  return validValues.includes(value as T) ? (value as T) : undefined;
};

/**
 * 매물 관리 페이지
 * 아파트 목록과 상세 정보(메모)를 관리
 */
export function PropertyManagePage() {
  const [selectedApartmentComplexId, setSelectedApartmentComplexId] = useState<
    number | undefined
  >();
  const [selectedRequestType, setSelectedRequestType] = useState<
    string | undefined
  >();
  const [selectedPropertyStatus, setSelectedPropertyStatus] = useState<
    string | undefined
  >();
  const [selectedManageType, setSelectedManageType] = useState<
    string | undefined
  >();
  const [selectedArea, setSelectedArea] = useState<string | undefined>();
  const [areaList, setAreaList] = useState<number[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dong, setDong] = useState<string>("");
  const [ho, setHo] = useState<string>("");
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [isSqmOrPyeong, setIsSqmOrPyeong] = useState<"sqm" | "pyeong">("sqm");

  const {
    data: preferredComplexes,
    isLoading: isPreferredComplexLoading,
    refetch: _refetchPreferredComplexes,
  } = useQuery({
    queryKey: ["preferredComplexes"],
    queryFn: fetchPreferredComplexList,
  });

  const preferredComplexOptions = useMemo(
    () =>
      (preferredComplexes ?? []).map((complex) => ({
        label: complex.apartmentName,
        value: String(complex.apartmentComplexId),
      })),
    [preferredComplexes]
  );

  // 선택된 단지의 총 아파트 수 조회
  const { data: totalApartmentCount } = useQuery({
    queryKey: ["totalApartmentCount", selectedApartmentComplexId],
    queryFn: () => fetchTotalApartmentCount(selectedApartmentComplexId!),
    enabled: Boolean(selectedApartmentComplexId), // 단지가 선택되었을 때만 실행
    retry: 2, // 못 가져왔을 때 2번 재시도
  });

  // 아파트 목록 조회 (API 연동)
  const debouncedDong = useDebouncedValue(dong, 300);
  const debouncedHo = useDebouncedValue(ho, 300);
  const debouncedPhone = useDebouncedValue(phoneNumber, 300);
  const normalizedPhone = debouncedPhone?.trim() ?? "";
  const isPhoneSearch = normalizedPhone.length > 0;

  const serverFilterParams = useMemo<{
    manageType?: ManageType;
    requestType?: RequestType;
    propertyStatus?: PropertyStatus;
    area?: number;
    dong?: string;
    ho?: string;
  }>(() => {
    const parsedArea =
      selectedArea !== undefined ? Number(selectedArea) : undefined;
    return {
      manageType: parseEnumValue(selectedManageType, manageTypeValues),
      requestType: parseEnumValue(selectedRequestType, requestTypeValues),
      propertyStatus: parseEnumValue(
        selectedPropertyStatus,
        propertyStatusValues
      ),
      area:
        parsedArea !== undefined && !Number.isNaN(parsedArea)
          ? parsedArea
          : undefined,
      dong: debouncedDong?.trim() ? debouncedDong.trim() : undefined,
      ho: debouncedHo?.trim() ? debouncedHo.trim() : undefined,
    };
  }, [
    selectedManageType,
    selectedRequestType,
    selectedPropertyStatus,
    selectedArea,
    debouncedDong,
    debouncedHo,
  ]);

  const serverFilterKeyParts = useMemo(
    () => [
      serverFilterParams.manageType ?? null,
      serverFilterParams.requestType ?? null,
      serverFilterParams.propertyStatus ?? null,
      serverFilterParams.area ?? null,
      serverFilterParams.dong ?? null,
      serverFilterParams.ho ?? null,
    ],
    [serverFilterParams]
  );

  const {
    data,
    isLoading: isPropertiesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: isPhoneSearch
      ? ["apartments-phone", selectedApartmentComplexId, normalizedPhone]
      : ["apartments", selectedApartmentComplexId, ...serverFilterKeyParts],
    enabled: Boolean(selectedApartmentComplexId),
    queryFn: ({ pageParam }) => {
      if (!selectedApartmentComplexId) {
        return Promise.resolve<PropertiesResponse>({
          content: [],
          nextCursor: null,
          hasNext: false,
        });
      }

      if (isPhoneSearch) {
        return fetchPropertiesByPhone({
          apartmentComplexId: selectedApartmentComplexId,
          cursorId: pageParam,
          size: 100,
          phone: normalizedPhone,
        });
      }

      return fetchPropertyList({
        apartmentComplexId: selectedApartmentComplexId,
        cursorId: pageParam,
        size: 100,
        ...serverFilterParams,
      });
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });

  const apartments = useMemo(() => {
    const allApartments =
      (data?.pages.flatMap(
        (page) => page.content
      ) as ApartmentWithProperty[]) || [];
    // 중복 제거: 같은 apartmentId를 가진 항목 중 첫 번째만 유지
    const uniqueApartments = Array.from(
      new Map(
        allApartments.map((apt: ApartmentWithProperty) => [
          apt.apartmentId,
          apt,
        ])
      ).values()
    ) as ApartmentWithProperty[];
    return uniqueApartments;
  }, [data?.pages]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      selectedManageType !== undefined ||
        selectedRequestType !== undefined ||
        selectedPropertyStatus !== undefined ||
        selectedArea !== undefined ||
        (phoneNumber && phoneNumber.trim() !== "") ||
        (dong && dong.trim() !== "") ||
        (ho && ho.trim() !== "")
    );
  }, [
    selectedManageType,
    selectedRequestType,
    selectedPropertyStatus,
    selectedArea,
    phoneNumber,
    dong,
    ho,
  ]);

  // 필터링 및 정렬
  const { filteredAndSortedApartments } = usePropertyFilter({
    apartments,
    selectedManageType,
    selectedRequestType,
    selectedPropertyStatus,
    selectedArea,
    phoneNumber: debouncedPhone,
    dong,
    ho,
  });

  const {
    selectedPropertyId,
    displayedPropertyId,
    isSidebarOpen,
    autoSaveToken,
    handlePropertyClick,
    handleToggleSidebar,
    handleExternalClick,
    resetSelection,
    closeSidebar,
  } = usePropertySidebar({ apartments: filteredAndSortedApartments });

  const resetPropertySelection = useCallback(() => {
    resetSelection();
  }, [resetSelection]);

  useEffect(() => {
    if (!preferredComplexes || preferredComplexes.length === 0) {
      if (selectedApartmentComplexId !== undefined) {
        setSelectedApartmentComplexId(undefined);
        resetPropertySelection();
      }
      return;
    }

    const hasSelectedComplex = preferredComplexes.some(
      (complex) => complex.apartmentComplexId === selectedApartmentComplexId
    );

    if (hasSelectedComplex) {
      return;
    }

    const nextComplexId = preferredComplexes[0]?.apartmentComplexId;
    if (nextComplexId !== undefined) {
      setSelectedApartmentComplexId(nextComplexId);
      resetPropertySelection();
    }
  }, [preferredComplexes, resetPropertySelection, selectedApartmentComplexId]);

  const selectedApartment = filteredAndSortedApartments.find(
    (apt) => apt.apartmentId === displayedPropertyId
  );

  // 매물 상세 사이드바 title 구성
  const detailSidebarTitle = useMemo(() => {
    if (!selectedApartment) {
      return "매물 상세 정보";
    }

    const { apartmentName, dong, ho, area, type } = selectedApartment;
    const dongHo = [dong, ho].filter(Boolean).join("-");
    const areaStr =
      typeof area === "number" && Number.isFinite(area)
        ? area.toFixed(2).replace(/\.?0+$/, "")
        : "";

    const title = [apartmentName, dongHo, areaStr, type]
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter(Boolean)
      .join(" ");

    return title || "매물 상세 정보";
  }, [selectedApartment]);

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (sidebarRef.current?.contains(target)) {
        return;
      }

      if (tableContainerRef.current?.contains(target)) {
        return;
      }

      if (
        target instanceof HTMLElement &&
        target.closest("[data-sidebar-toggle='true']")
      ) {
        return;
      }

      if (!isSidebarOpen && selectedPropertyId === undefined) {
        return;
      }

      setTimeout(() => {
        handleExternalClick();
      }, 0);
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [handleExternalClick, isSidebarOpen, selectedPropertyId]);

  useEffect(() => {
    if (!selectedApartmentComplexId) {
      setAreaList([]);
      return;
    }

    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }

    // 면적 목록 조회
    void fetchAreaList(selectedApartmentComplexId)
      .then((areas) => {
        setAreaList(areas);
      })
      .catch(() => {
        setAreaList([]);
      });
  }, [selectedApartmentComplexId]);

  const handleSelectApartmentComplex = useCallback(
    (complexId: number) => {
      if (complexId === selectedApartmentComplexId) {
        return;
      }

      setSelectedApartmentComplexId(complexId);
      resetPropertySelection();
    },
    [resetPropertySelection, selectedApartmentComplexId]
  );

  // 테이블 헤더 필터용 핸들러 (ALL 선택 시 undefined로 변환)
  const handleSelectManageTypeForTable = useCallback((value: string) => {
    setSelectedManageType(value === "ALL" ? undefined : value);
  }, []);

  // ㎡ 형식과 평 형식 변환 핸들러
  const handleSqmOrPyeongChange = useCallback(() => {
    setIsSqmOrPyeong((prev) => (prev === "sqm" ? "pyeong" : "sqm"));
  }, []);

  // 면적 옵션 생성 (㎡ 형식)
  const areaOptions = useMemo<DropdownOption[]>(() => {
    return [
      { label: "전체", value: "ALL" },
      ...areaList.map((area) => ({
        label: `${area}㎡`,
        value: String(area),
      })),
    ];
  }, [areaList]);

  const isTableLoading = isPreferredComplexLoading || isPropertiesLoading;

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
          <PropertyMemoBlock
            apartment={selectedApartment}
            isOpen={isSidebarOpen}
            autoSaveToken={autoSaveToken}
          />
          <PropertyContractBlock
            apartment={selectedApartment}
            isOpen={isSidebarOpen}
            autoSaveToken={autoSaveToken}
          />
          {/* 평면도는 아직 안 보여줄 예정 - 추후 평면도 들어오면 주석 해제하기 */}
          {/* <PropertyFloorPlanBlock apartment={selectedApartment} /> */}
        </DetailSidebar>
      }
    >
      <div className="flex flex-col gap-6 h-full">
        <PropertyManagerHeader
          complexOptions={preferredComplexOptions}
          selectedComplexId={selectedApartmentComplexId}
          onSelectComplex={handleSelectApartmentComplex}
          isComplexLoading={isPreferredComplexLoading}
          selectedRequestType={selectedRequestType}
          onSelectRequestType={setSelectedRequestType}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          dong={dong}
          onDongChange={setDong}
          ho={ho}
          onHoChange={setHo}
          isSqmOrPyeong={isSqmOrPyeong}
          onSqmOrPyeongChange={handleSqmOrPyeongChange}
        />
        <div ref={tableContainerRef} className="flex-1 overflow-hidden">
          <PropertyManageTable
            totalApartmentCount={totalApartmentCount}
            onPropertyClick={handlePropertyClick}
            selectedApartmentId={selectedPropertyId}
            apartments={filteredAndSortedApartments}
            isLoading={isTableLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage ?? false}
            onLoadMore={selectedApartmentComplexId ? fetchNextPage : undefined}
            hasActiveFilters={hasActiveFilters}
            selectedManageType={selectedManageType}
            onSelectManageType={handleSelectManageTypeForTable}
          />
        </div>
      </div>
    </SlidingSidebarLayout>
  );
}
