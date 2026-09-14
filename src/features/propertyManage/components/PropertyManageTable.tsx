import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useRef, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { DropdownMenuCell } from "@/shared/ui";
import type {
  ApartmentWithProperty,
  PropertiesResponse,
  ManageType,
} from "../types";
import { useVirtualInfiniteScroll } from "@/shared/hooks";
import {
  formatArea,
  formatNumber,
  formatPhoneNumber,
  sqmToPyeong,
} from "@/shared/utils";
import { updatePropertyManage } from "../services/propertyService";
import { manageTypeFilterOptions, ESTIMATED_ROW_HEIGHT } from "../types";
import {
  isInfinitePropertiesData,
  isPropertiesResponse,
} from "../utils/propertyCacheUtils";
import { TableHeaderFilter } from "@/shared/ui";
import { OccupancyStatusTag } from "./OccupancyStatusTag";
import { RequestTypeTag } from "./RequestTypeTag";

// 이미지 불러오기
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";
import Caution from "@/assets/Caution.svg";

interface PropertyManageTableProps {
  onPropertyClick?: (apartmentId: string | number) => void;
  selectedApartmentId?: string | number;
  apartments?: ApartmentWithProperty[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  hasActiveFilters?: boolean;
  totalApartmentCount?: number;
  selectedManageType?: string;
  onSelectManageType?: (value: string) => void;
  isSqmOrPyeong?: "sqm" | "pyeong";
}

export function PropertyManageTable({
  onPropertyClick,
  selectedApartmentId,
  apartments: externalApartments,
  isLoading: externalIsLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  hasActiveFilters = false,
  totalApartmentCount,
  selectedManageType,
  onSelectManageType,
  isSqmOrPyeong = "sqm",
}: PropertyManageTableProps) {
  // 외부에서 받은 데이터 사용
  const apartments = useMemo(
    () => externalApartments || [],
    [externalApartments],
  );
  const isLoading = externalIsLoading ?? false;

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 즐겨찾기 업데이트 핸들러
  const handleManageTypeChange = useCallback(
    async (apartmentId: number, value: ManageType) => {
      try {
        await updatePropertyManage(apartmentId, value);
        const updateCachedProperties = (
          oldData:
            PropertiesResponse | InfiniteData<PropertiesResponse> | undefined,
        ) => {
          if (!oldData) return oldData;

          const updateApartment = (apt: ApartmentWithProperty) => {
            if (apt.apartmentId === apartmentId) {
              return {
                ...apt,
                property: apt.property
                  ? {
                      ...apt.property,
                      manageType: value,
                    }
                  : null,
              };
            }
            return apt;
          };

          if (isInfinitePropertiesData(oldData)) {
            const updatedPages = oldData.pages.map((page) => ({
              ...page,
              content: page.content.map(updateApartment),
            }));
            return { ...oldData, pages: updatedPages };
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
        >({ queryKey: ["apartments"] }, updateCachedProperties);
        queryClient.setQueriesData<
          PropertiesResponse | InfiniteData<PropertiesResponse>
        >({ queryKey: ["apartments-phone"] }, updateCachedProperties);
      } catch (error) {
        console.error("즐겨찾기 업데이트 실패:", error);
        alert("즐겨찾기 업데이트에 실패했습니다.");
      }
    },
    [queryClient],
  );

  // 가상 스크롤 + 무한 스크롤
  const { rowVirtualizer, virtualItems } = useVirtualInfiniteScroll({
    scrollContainerRef: tableContainerRef,
    items: apartments,
    hasActiveFilters,
    totalItemCount: totalApartmentCount,
    hasNextPage,
    onLoadMore,
    isFetchingNextPage,
    estimatedRowHeight: ESTIMATED_ROW_HEIGHT,
  });

  const hasApartments = apartments.length > 0;

  const formatAreaDisplay = useCallback(
    (area?: number, fallback?: string) => {
      if (area === undefined || area === null || area === 0) {
        return fallback || "-";
      }

      if (isSqmOrPyeong === "sqm") {
        return formatArea(area, "sqm");
      }

      return formatArea(sqmToPyeong(area), "pyeong");
    },
    [isSqmOrPyeong],
  );

  if (isLoading) {
    return (
      <section className="w-full rounded-lg border border-[#DDE2F2] bg-white shadow-sm p-8 text-center">
        <p className="text-gray-500">매물 목록을 불러오는 중...</p>
      </section>
    );
  }

  return (
    <div
      ref={tableContainerRef}
      className="h-full rounded-lg bg-white overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <Table className="min-w-[1100px] whitespace-nowrap">
        <TableHeader className="sticky top-0 z-40 shadow-sm bg-[#E8EDFF]">
          <TableRow>
            <TableHeaderFilter
              title="즐겨찾기"
              value={selectedManageType}
              onChange={onSelectManageType}
              options={manageTypeFilterOptions}
              className="w-24 text-center"
            />
            <TableHead>동</TableHead>
            <TableHead>호수</TableHead>
            <TableHead>
              {isSqmOrPyeong === "sqm" ? "면적(㎡)" : "면적(평)"}
            </TableHead>
            <TableHead>점유 상태</TableHead>
            <TableHead>기매입금</TableHead>
            <TableHead>현임차</TableHead>
            <TableHead>만기일</TableHead>
            <TableHead>의뢰 유형</TableHead>
            <TableHead>매도가</TableHead>
            <TableHead>전세가</TableHead>
            <TableHead>보증금/월세가</TableHead>
            <TableHead>의뢰 등록일</TableHead>
            <TableHead>소유자</TableHead>
            <TableHead>연락처</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasApartments ? (
            <TableRow>
              <TableCell
                colSpan={15}
                className="py-10 text-center text-sm text-gray-400"
              >
                조건에 해당하는 매물이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {virtualItems.length > 0 && virtualItems[0].start > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={15}
                    style={{ height: virtualItems[0].start }}
                  />
                </TableRow>
              )}
              {virtualItems.map((virtualRow) => {
                if (virtualRow.index >= apartments.length) {
                  if (hasActiveFilters) {
                    if (!hasNextPage || virtualRow.index > apartments.length) {
                      return null;
                    }
                    return (
                      <TableRow
                        key={`filtered-loader-${virtualRow.key}`}
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                      >
                        <TableCell
                          colSpan={15}
                          className="text-center text-sm text-gray-400"
                        >
                          데이터를 불러오는 중입니다...
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (!hasNextPage) {
                    return null;
                  }

                  return (
                    <TableRow
                      key={`placeholder-${virtualRow.key}`}
                      ref={rowVirtualizer.measureElement}
                      data-index={virtualRow.index}
                    >
                      <TableCell
                        colSpan={15}
                        className="text-center text-sm text-gray-400"
                      >
                        데이터를 불러오는 중입니다...
                      </TableCell>
                    </TableRow>
                  );
                }

                const apartment = apartments[virtualRow.index];

                if (!apartment) {
                  return null;
                }

                const isSelected =
                  selectedApartmentId === apartment.apartmentId;
                const property = apartment.property;

                return (
                  <TableRow
                    key={apartment.apartmentId}
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    tabIndex={0}
                    aria-selected={isSelected}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      isSelected
                        ? "bg-[#EEF6FF] ring-2 ring-inset ring-[#1499FF]"
                        : ""
                    }`}
                    onClick={() => onPropertyClick?.(apartment.apartmentId)}
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onPropertyClick?.(apartment.apartmentId);
                      }
                    }}
                  >
                    {/* 즐겨찾기 */}
                    <TableCell className="px-2">
                      <div
                        className="flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuCell
                          options={[
                            {
                              label: "기본",
                              value: "NONE",
                              icon: UnfilledStar,
                            },
                            {
                              label: "관심",
                              value: "ATTENTION",
                              icon: FilledStar,
                            },
                            { label: "주의", value: "CAUTION", icon: Caution },
                          ]}
                          value={property?.manageType ?? "NONE"}
                          ariaLabel={`${apartment.apartmentName} ${apartment.dong}동 ${apartment.ho}호 중요도 변경`}
                          onChange={(value) => {
                            handleManageTypeChange(
                              apartment.apartmentId,
                              value as ManageType,
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

                    {/* 동 */}
                    <TableCell>{apartment.dong}동</TableCell>

                    {/* 호수 */}
                    <TableCell>{apartment.ho}호</TableCell>

                    {/* 면적 */}
                    <TableCell>
                      {formatAreaDisplay(apartment.area, apartment.type)}
                    </TableCell>

                    {/* 점유 상태 */}
                    <TableCell>
                      <OccupancyStatusTag status={property?.occupancyStatus} />
                    </TableCell>

                    {/* 기매입금 */}
                    <TableCell>
                      {property?.contractSalePrice != null
                        ? formatNumber(property.contractSalePrice)
                        : "-"}
                    </TableCell>

                    {/* 현임차 */}
                    <TableCell>
                      {property?.occupancyStatus === "JEONSE" ? (
                        property?.contractJeonsePrice != null ? (
                          formatNumber(property.contractJeonsePrice)
                        ) : (
                          "-"
                        )
                      ) : property?.occupancyStatus === "MONTHLY_RENT" ? (
                        (property?.contractDeposit ?? 0) > 0 ||
                        (property?.contractMonthlyRent ?? 0) > 0 ? (
                          <div className="flex items-center justify-center gap-1 whitespace-nowrap leading-none">
                            <span>
                              {(property?.contractDeposit ?? 0) > 0
                                ? formatNumber(property.contractDeposit)
                                : "-"}
                            </span>
                            <span>/</span>
                            <span>
                              {(property?.contractMonthlyRent ?? 0) > 0
                                ? formatNumber(property.contractMonthlyRent)
                                : "-"}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* 만기일 */}
                    <TableCell>{property?.expireDate || "-"}</TableCell>

                    {/* 의뢰 유형 */}
                    <TableCell>
                      <RequestTypeTag type={property?.requestType} />
                    </TableCell>

                    {/* 매도가 */}
                    <TableCell>
                      {property?.salePrice
                        ? formatNumber(property.salePrice)
                        : "-"}
                    </TableCell>

                    {/* 전세가 */}
                    <TableCell>
                      {property?.jeonsePrice
                        ? formatNumber(property.jeonsePrice)
                        : "-"}
                    </TableCell>

                    {/* 보증금/월세가 */}
                    <TableCell>
                      {property?.deposit || property?.monthPrice ? (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <span>
                            {property?.deposit
                              ? formatNumber(property.deposit)
                              : "-"}
                          </span>
                          <span>/</span>
                          <span>
                            {property?.monthPrice
                              ? formatNumber(property.monthPrice)
                              : "-"}
                          </span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* 의뢰 등록일 */}
                    <TableCell>
                      {property?.requestRegistrationDate || "-"}
                    </TableCell>

                    {/* 소유자 */}
                    <TableCell>{property?.ownerName || "-"}</TableCell>

                    {/* 연락처 */}
                    <TableCell>
                      {property?.ownerPhone
                        ? formatPhoneNumber(property.ownerPhone) ||
                          property.ownerPhone
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {virtualItems.length > 0 &&
                rowVirtualizer.getTotalSize() -
                  virtualItems[virtualItems.length - 1].end >
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={15}
                      style={{
                        height:
                          rowVirtualizer.getTotalSize() -
                          virtualItems[virtualItems.length - 1].end,
                      }}
                    />
                  </TableRow>
                )}
            </>
          )}
        </TableBody>
      </Table>

      {/* 무한스크롤 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <div className="text-sm text-gray-500">
            더 많은 매물을 불러오는 중...
          </div>
        </div>
      )}

      {!hasNextPage && apartments.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <div className="text-sm text-gray-400">모든 매물을 불러왔습니다.</div>
        </div>
      )}
    </div>
  );
}
