import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, type RefObject } from "react";

interface UseVirtualInfiniteScrollParams<T> {
  /** 스크롤 컨테이너 ref */
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  /** 현재 로드된 항목 배열 */
  items: T[];
  /** 필터가 활성화되어 있는지 여부 */
  hasActiveFilters?: boolean;
  /** 전체 항목 개수 (필터 미활성 시 사용) */
  totalItemCount?: number;
  /** 다음 페이지 존재 여부 */
  hasNextPage?: boolean;
  /** 다음 페이지 로드 함수 */
  onLoadMore?: () => void;
  /** 다음 페이지를 가져오는 중인지 여부 */
  isFetchingNextPage?: boolean;
  /** 행 높이 추정값 (기본값: 72px) */
  estimatedRowHeight?: number;
  /** 오버스캔 개수 (기본값: 12) */
  overscan?: number;
  /** 자동 로드 트리거 지점 (끝에서 몇 개 남았을 때, 기본값: 5) */
  loadMoreThreshold?: number;
}

/**
 * 가상 스크롤과 무한 스크롤을 결합한 커스텀 훅
 *
 * @example
 * ```tsx
 * const { rowVirtualizer, virtualItems } = useVirtualInfiniteScroll({
 *   scrollContainerRef: tableContainerRef,
 *   items: apartments,
 *   hasActiveFilters,
 *   totalItemCount: totalApartmentCount,
 *   hasNextPage,
 *   onLoadMore,
 *   isFetchingNextPage,
 * });
 * ```
 */
export function useVirtualInfiniteScroll<T>({
  scrollContainerRef,
  items,
  hasActiveFilters = false,
  totalItemCount,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
  estimatedRowHeight = 72,
  overscan = 12,
  loadMoreThreshold = 5,
}: UseVirtualInfiniteScrollParams<T>) {
  // 행 개수 계산
  const hasItems = items.length > 0;
  const shouldUseTotalRowCount = hasItems && !hasActiveFilters;
  const nonPlaceholderRowCount = shouldUseTotalRowCount
    ? Math.max(items.length, Number(totalItemCount ?? 0))
    : items.length;
  const totalRowCount =
    nonPlaceholderRowCount + (hasActiveFilters && hasNextPage ? 1 : 0);

  // 가상 스크롤 설정
  const rowVirtualizer = useVirtualizer({
    count: totalRowCount,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // 무한 스크롤 트리거
  useEffect(() => {
    if (!hasNextPage || !onLoadMore || isFetchingNextPage) {
      return;
    }
    if (virtualItems.length === 0) {
      return;
    }

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= items.length - loadMoreThreshold) {
      onLoadMore();
    }
  }, [
    virtualItems,
    hasNextPage,
    onLoadMore,
    items.length,
    isFetchingNextPage,
    loadMoreThreshold,
  ]);

  return {
    rowVirtualizer,
    virtualItems,
    totalRowCount,
  };
}
