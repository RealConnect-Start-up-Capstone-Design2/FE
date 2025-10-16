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
import { PropertyMemoBlock } from "@/features/propertyManage/components/blocks/PropertyMemoBlock";
import { PropertyContractBlock } from "@/features/propertyManage/components/blocks/PropertyContractBlock";
import { fetchProperties } from "@/features/propertyManage/services/propertyService";
import { fetchPreferredComplexList } from "@/shared/api/region";

/**
 * 매물 관리 페이지
 * 아파트 목록과 상세 정보(메모)를 관리
 */
export function PropertyManagePage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false); // 기본값: 닫힘
  const [selectedPropertyId, setSelectedPropertyId] = useState<
    string | number | undefined
  >();
  const [selectedApartmentComplexId, setSelectedApartmentComplexId] =
    useState<number | undefined>();
  // "카드 닫기" 버튼으로 명시적으로 닫았는지 추적
  const [isManuallyClosedByButton, setIsManuallyClosedByButton] =
    useState(false);
  // 사이드바가 닫힐 때 메모 자동 저장을 위한 상태
  const [shouldAutoSave, setShouldAutoSave] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);

  const {
    data: preferredComplexes,
    isLoading: isPreferredComplexLoading,
    refetch: refetchPreferredComplexes,
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

  const resetPropertySelection = useCallback(() => {
    setSelectedPropertyId(undefined);
    setIsDetailOpen(false);
    setIsManuallyClosedByButton(false);
    setShouldAutoSave(false);
  }, []);

  useEffect(() => {
    if (!preferredComplexes || preferredComplexes.length === 0) {
      if (selectedApartmentComplexId !== undefined) {
        setSelectedApartmentComplexId(undefined);
        resetPropertySelection();
      }
      return;
    }

    const hasSelectedComplex = preferredComplexes.some(
      (complex) =>
        complex.apartmentComplexId === selectedApartmentComplexId
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

  // 아파트 목록 조회 (API 연동)
  const {
    data,
    isLoading: isPropertiesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["apartments", selectedApartmentComplexId],
    enabled: Boolean(selectedApartmentComplexId),
    queryFn: ({ pageParam }) =>
      fetchProperties({
        apartmentComplexId: selectedApartmentComplexId!,
        cursorId: pageParam,
        size: 30,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });

  const apartments = data?.pages.flatMap((page) => page.content) || [];
  const selectedApartment = apartments.find(
    (apt) => apt.apartmentId === selectedPropertyId
  );

  const closeSidebar = useCallback(() => {
    // 사이드바가 닫힐 때 메모 자동 저장 트리거
    setShouldAutoSave(true);
    setIsDetailOpen(false);
    setIsManuallyClosedByButton(false);

    // 자동 저장 상태를 리셋
    setTimeout(() => setShouldAutoSave(false), 100);
  }, []);

  const handlePropertyClick = (propertyId: string | number) => {
    if (selectedPropertyId === propertyId && isDetailOpen) {
      // 같은 매물을 다시 클릭하면 사이드바만 닫음 (매물 선택은 유지, 버튼으로 닫은 상태 아님)
      closeSidebar();
    } else if (!isManuallyClosedByButton) {
      // "카드 닫기" 버튼으로 닫은 상태가 아닐 때만 다른 매물 클릭 시 사이드바 열림
      setSelectedPropertyId(propertyId);
      setIsDetailOpen(true);
    } else {
      // "카드 닫기" 버튼으로 닫은 상태일 때는 매물 ID만 변경하고 사이드바는 열지 않음
      setSelectedPropertyId(propertyId);
    }
  };

  const handleToggleSidebar = () => {
    setIsDetailOpen((prev) => {
      const newState = !prev;
      // "카드 닫기" 버튼으로 닫은 경우 상태 설정
      if (!newState) {
        // 사이드바가 닫힐 때 메모 자동 저장 트리거
        setShouldAutoSave(true);
        setTimeout(() => setShouldAutoSave(false), 100);
        setIsManuallyClosedByButton(true);
      } else {
        // "카드 열기" 버튼으로 열면 상태 해제
        setIsManuallyClosedByButton(false);
      }
      return newState;
    });
  };

  useEffect(() => {
    if (!isDetailOpen) {
      return;
    }

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

      // 외부 클릭으로 닫은 경우에는 버튼으로 닫은 상태가 아님
      closeSidebar();
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [closeSidebar, isDetailOpen]);

  useEffect(() => {
    if (!selectedApartmentComplexId) {
      return;
    }

    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
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

  const handleRefreshPreferredComplexes = useCallback(() => {
    void refetchPreferredComplexes();
  }, [refetchPreferredComplexes]);

  const isTableLoading = isPreferredComplexLoading || isPropertiesLoading;

  return (
    <SlidingSidebarLayout
      isOpen={isDetailOpen}
      onToggle={handleToggleSidebar}
      sidebarRef={sidebarRef}
      sidebar={
        <DetailSidebar title="매물 상세 정보">
          <PropertyMemoBlock
            apartment={selectedApartment}
            onClose={shouldAutoSave ? () => {} : undefined}
            isOpen={isDetailOpen}
          />
          <PropertyContractBlock
            apartment={selectedApartment}
            isOpen={isDetailOpen}
          />
        </DetailSidebar>
      }
    >
      <div className="flex flex-col gap-6 h-full">
        <PropertyManagerHeader
          complexOptions={preferredComplexOptions}
          selectedComplexId={selectedApartmentComplexId}
          onSelectComplex={handleSelectApartmentComplex}
          onRefreshPreferredComplexes={handleRefreshPreferredComplexes}
          isComplexLoading={isPreferredComplexLoading}
        />
        <div ref={tableContainerRef} className="flex-1 overflow-hidden">
          <PropertyManageTable
            onPropertyClick={handlePropertyClick}
            selectedApartmentId={selectedPropertyId}
            apartments={apartments}
            isLoading={isTableLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage ?? false}
            onLoadMore={
              selectedApartmentComplexId ? fetchNextPage : undefined
            }
          />
        </div>
      </div>
    </SlidingSidebarLayout>
  );
}
