import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type InfiniteData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  PropertyManagerHeader,
  PropertyManageTable,
} from "@/features/propertyManage";
import { SlidingSidebarLayout } from "@/shared/components/detail-sidebar";

// 사이드바 컴포넌트
import { PropertySidebar } from "@/features/propertyManage/components/sidebar";
import { MainComplexModal } from "@/shared/components/MainComplexModal";

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
} from "@/features/propertyManage/types";
import {
  usePropertyFilter,
  usePropertySidebar,
} from "@/features/propertyManage/hooks";
import {
  isInfinitePropertiesData,
  isPropertiesResponse,
} from "@/features/propertyManage/utils/propertyCacheUtils";
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
  "HOLD",
];
const propertyStatusValues: readonly PropertyStatus[] = [
  "NONE",
  "BEFORE",
  "ADVERTISING",
  "COMPLETED",
  "PROGRESS",
];

const parseEnumValue = <T extends string>(
  value: string | undefined,
  validValues: readonly T[],
): T | undefined => {
  if (!value) return undefined;
  return validValues.includes(value as T) ? (value as T) : undefined;
};

/**
 * 매물 관리 페이지
 * 아파트 목록과 상세 정보(메모)를 관리
 */
export function PropertyManagePage() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedApartmentComplexId, setSelectedApartmentComplexId] = useState<
    number | undefined
  >();
  const [selectedRequestType, setSelectedRequestType] = useState<
    string | undefined
  >();
  const [selectedPropertyStatus] = useState<string | undefined>();
  const [selectedManageType, setSelectedManageType] = useState<
    string | undefined
  >();
  const [selectedArea] = useState<string | undefined>();
  const [, setAreaList] = useState<number[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dong, setDong] = useState<string>("");
  const [ho, setHo] = useState<string>("");
  const [isMainComplexModalOpen, setIsMainComplexModalOpen] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const handledDetailSearchRef = useRef<string | null>(null);
  const [isSqmOrPyeong, setIsSqmOrPyeong] = useState<"sqm" | "pyeong">("sqm");

  const detailSearch = useMemo(() => {
    const rawComplexId = searchParams.get("complexId");
    const rawApartmentId = searchParams.get("apartmentId");
    const complexId = rawComplexId ? Number(rawComplexId) : undefined;
    const apartmentId = rawApartmentId ? Number(rawApartmentId) : undefined;

    return {
      key: searchParams.toString(),
      complexId:
        complexId !== undefined && !Number.isNaN(complexId)
          ? complexId
          : undefined,
      apartmentId:
        apartmentId !== undefined && !Number.isNaN(apartmentId)
          ? apartmentId
          : undefined,
      dong: searchParams.get("dong") ?? "",
      ho: searchParams.get("ho") ?? "",
    };
  }, [searchParams]);

  const { data: preferredComplexes, isLoading: isPreferredComplexLoading } =
    useQuery({
      queryKey: ["preferredComplexes"],
      queryFn: fetchPreferredComplexList,
    });

  const preferredComplexOptions = useMemo(
    () =>
      (preferredComplexes ?? []).map((complex) => ({
        label: complex.apartmentName,
        value: String(complex.apartmentComplexId),
      })),
    [preferredComplexes],
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
        propertyStatusValues,
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
    [serverFilterParams],
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
        (page) => page.content,
      ) as ApartmentWithProperty[]) || [];
    // 중복 제거: 같은 apartmentId를 가진 항목 중 첫 번째만 유지
    const uniqueApartments = Array.from(
      new Map(
        allApartments.map((apt: ApartmentWithProperty) => [
          apt.apartmentId,
          apt,
        ]),
      ).values(),
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
      (ho && ho.trim() !== ""),
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
    handlePropertyClick,
    handleToggleSidebar,
    handleExternalClick,
    selectProperty,
    resetSelection,
    closeSidebar,
  } = usePropertySidebar({ apartments: filteredAndSortedApartments });

  const resetPropertySelection = useCallback(() => {
    resetSelection();
  }, [resetSelection]);

  const isTableLoading = isPreferredComplexLoading || isPropertiesLoading;

  useEffect(() => {
    if (!preferredComplexes || preferredComplexes.length === 0) {
      if (selectedApartmentComplexId !== undefined) {
        setSelectedApartmentComplexId(undefined);
        resetPropertySelection();
      }
      return;
    }

    const detailComplexId = detailSearch.complexId;
    const hasDetailComplexParam = detailComplexId !== undefined;
    const hasDetailComplex =
      hasDetailComplexParam &&
      preferredComplexes.some(
        (complex) => complex.apartmentComplexId === detailComplexId,
      );
    const hasSelectedComplex = preferredComplexes.some(
      (complex) => complex.apartmentComplexId === selectedApartmentComplexId,
    );
    const nextComplexId = hasDetailComplex
      ? detailComplexId
      : hasDetailComplexParam
        ? hasSelectedComplex
          ? selectedApartmentComplexId
          : undefined
        : hasSelectedComplex
          ? selectedApartmentComplexId
          : preferredComplexes[0]?.apartmentComplexId;

    if (nextComplexId === selectedApartmentComplexId) {
      return;
    }

    setSelectedApartmentComplexId(nextComplexId);
    resetPropertySelection();

    if (nextComplexId === undefined) {
      setDong("");
      setHo("");
    }
  }, [
    detailSearch.complexId,
    preferredComplexes,
    resetPropertySelection,
    selectedApartmentComplexId,
  ]);

  useEffect(() => {
    if (handledDetailSearchRef.current === detailSearch.key) {
      return;
    }

    if (
      detailSearch.complexId !== undefined &&
      detailSearch.complexId !== selectedApartmentComplexId
    ) {
      return;
    }

    if (detailSearch.dong) {
      setDong(detailSearch.dong);
    }

    if (detailSearch.ho) {
      setHo(detailSearch.ho);
    }
  }, [detailSearch, selectedApartmentComplexId]);

  useEffect(() => {
    if (
      handledDetailSearchRef.current === detailSearch.key ||
      detailSearch.apartmentId === undefined ||
      isTableLoading ||
      (detailSearch.complexId !== undefined &&
        detailSearch.complexId !== selectedApartmentComplexId)
    ) {
      return;
    }

    const targetApartment = filteredAndSortedApartments.find(
      (apt) => apt.apartmentId === detailSearch.apartmentId,
    );

    if (!targetApartment) {
      if (!hasNextPage && !isFetchingNextPage) {
        handledDetailSearchRef.current = detailSearch.key;
      }
      return;
    }

    selectProperty(detailSearch.apartmentId);
    handledDetailSearchRef.current = detailSearch.key;
  }, [
    detailSearch,
    filteredAndSortedApartments,
    hasNextPage,
    isFetchingNextPage,
    isTableLoading,
    selectProperty,
    selectedApartmentComplexId,
  ]);

  const selectedApartment = filteredAndSortedApartments.find(
    (apt) => apt.apartmentId === displayedPropertyId,
  );

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
      setDong("");
      setHo("");
      setPhoneNumber("");
      resetPropertySelection();
    },
    [resetPropertySelection, selectedApartmentComplexId],
  );

  // 테이블 헤더 필터용 핸들러 (ALL 선택 시 undefined로 변환)
  const handleSelectManageTypeForTable = useCallback((value: string) => {
    setSelectedManageType(value === "ALL" ? undefined : value);
  }, []);

  // ㎡ 형식과 평 형식 변환 핸들러
  const handleSqmOrPyeongChange = useCallback(() => {
    setIsSqmOrPyeong((prev) => (prev === "sqm" ? "pyeong" : "sqm"));
  }, []);

  const handleOpenMainComplexModal = useCallback(() => {
    setIsMainComplexModalOpen(true);
  }, []);

  const handleCloseMainComplexModal = useCallback(() => {
    setIsMainComplexModalOpen(false);
  }, []);

  const handleSaveMainComplexes = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["preferredComplexes"] });
  }, [queryClient]);

  const updateApartmentInCache = useCallback(
    (updatedApartment?: ApartmentWithProperty) => {
      if (!updatedApartment) {
        return;
      }

      const updateCachedData = (
        oldData:
          | PropertiesResponse
          | InfiniteData<PropertiesResponse>
          | undefined,
      ) => {
        if (!oldData) return oldData;

        const updateApartment = (apartment: ApartmentWithProperty) =>
          apartment.apartmentId === updatedApartment.apartmentId
            ? updatedApartment
            : apartment;

        if (isInfinitePropertiesData(oldData)) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.map(updateApartment),
            })),
          };
        }

        if (isPropertiesResponse(oldData)) {
          return {
            ...oldData,
            content: oldData.content.map(updateApartment),
          };
        }

        return oldData;
      };

      queryClient.setQueriesData<
        PropertiesResponse | InfiniteData<PropertiesResponse>
      >({ queryKey: ["apartments"] }, updateCachedData);
      queryClient.setQueriesData<
        PropertiesResponse | InfiniteData<PropertiesResponse>
      >({ queryKey: ["apartments-phone"] }, updateCachedData);
    },
    [queryClient],
  );

  return (
    <>
      <SlidingSidebarLayout
        isOpen={isSidebarOpen}
        sidebarWidth={500}
        onToggle={handleToggleSidebar}
        sidebarRef={sidebarRef}
        sidebar={
          <PropertySidebar
            apartment={selectedApartment}
            onClose={() => closeSidebar(true)}
            isOpen={isSidebarOpen}
            onCancel={() => closeSidebar(true)}
            onSave={updateApartmentInCache}
          />
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
            onAddComplexClick={handleOpenMainComplexModal}
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
              onLoadMore={
                selectedApartmentComplexId ? fetchNextPage : undefined
              }
              hasActiveFilters={hasActiveFilters}
              selectedManageType={selectedManageType}
              onSelectManageType={handleSelectManageTypeForTable}
              isSqmOrPyeong={isSqmOrPyeong}
            />
          </div>
        </div>
      </SlidingSidebarLayout>
      <MainComplexModal
        isOpen={isMainComplexModalOpen}
        onClose={handleCloseMainComplexModal}
        onSave={handleSaveMainComplexes}
      />
    </>
  );
}
