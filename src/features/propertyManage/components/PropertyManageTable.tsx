import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { DropdownMenuCell } from "@/components/ui";
import type {
  PropertyStatus,
  ApartmentWithProperty,
  PropertiesResponse,
  ManageType,
} from "../stores/propertyStore";
import { usePropertyEdit } from "../hooks/usePropertyEdit";
import { useVirtualInfiniteScroll } from "@/shared/hooks";
import type { PropertyMutationPayload } from "../services/propertyService";
import { formatPrice, formatPhoneNumber } from "@/shared/utils";
import { updatePropertyManage } from "../services/propertyService";
import {
  propertyFieldDefaults,
  requestTypeOptions,
  manageTypeFilterOptions,
  ESTIMATED_ROW_HEIGHT,
} from "../constants/propertyConstants";
import { normalizeDateValue } from "@/shared/utils";
import {
  updateApartmentList,
  isInfinitePropertiesData,
  isPropertiesResponse,
} from "../utils/propertyCacheUtils";
import type { PropertyFieldKey, DropdownState } from "../types/property";
import { TableHeaderFilter } from "@/components/ui";
import type { DropdownOption } from "@/components/ui/dropdown-menu";

// 이미지 불러오기
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";
import Caution from "@/assets/Caution.svg";

const propertyFieldKeys = Object.keys(
  propertyFieldDefaults
) as PropertyFieldKey[];

interface PropertyManageTableProps {
  onPropertyClick?: (apartmentId: string | number) => void;
  selectedApartmentId?: string | number;
  apartments?: ApartmentWithProperty[]; // 외부에서 데이터를 받아올 경우
  isLoading?: boolean; // 로딩 상태
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  hasActiveFilters?: boolean;
  totalApartmentCount?: number;
  selectedManageType?: string;
  onSelectManageType?: (value: string) => void;
  areaOptions?: DropdownOption[];
  selectedArea?: string;
  onSelectArea?: (value: string) => void;
  selectedRequestType?: string;
  onSelectRequestType?: (value: string) => void;
  selectedPropertyStatus?: string;
  onSelectPropertyStatus?: (value: string) => void;
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
  areaOptions: _areaOptions,
  selectedArea: _selectedArea,
  onSelectArea: _onSelectArea,
  selectedRequestType: _selectedRequestType,
  onSelectRequestType: _onSelectRequestType,
  selectedPropertyStatus: _selectedPropertyStatus,
  onSelectPropertyStatus: _onSelectPropertyStatus,
  isSqmOrPyeong: _isSqmOrPyeong,
}: PropertyManageTableProps) {
  // 외부에서 받은 데이터 사용
  const apartments = useMemo(
    () => externalApartments || [],
    [externalApartments]
  );
  const isLoading = externalIsLoading ?? false;

  // 편집 관련 로직
  const { handlePropertyBatchUpdate } = usePropertyEdit();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const formatPriceWithDecimal = useCallback(
    (price?: number | null) => formatPrice(price),
    []
  );

  const queryClient = useQueryClient();

  // PUT 응답과 무관하게 UI를 즉시 업데이트하기 위해 캐시를 직접 수정
  const updateApartmentCache = useCallback(
    (payload: PropertyMutationPayload) => {
      queryClient.setQueriesData<
        PropertiesResponse | InfiniteData<PropertiesResponse>
      >({ queryKey: ["apartments"] }, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        if (isInfinitePropertiesData(oldData)) {
          let hasChanges = false;
          const nextPages = oldData.pages.map((page) => {
            const { changed, content } = updateApartmentList(
              page.content,
              payload
            );
            if (!changed) {
              return page;
            }
            hasChanges = true;
            return {
              ...page,
              content,
            };
          });

          return hasChanges ? { ...oldData, pages: nextPages } : oldData;
        }

        if (isPropertiesResponse(oldData)) {
          const { changed, content } = updateApartmentList(
            oldData.content,
            payload
          );
          return changed ? { ...oldData, content } : oldData;
        }

        return oldData;
      });
    },
    [queryClient]
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

  const [localDropdownStates, setLocalDropdownStates] = useState<
    Record<number, DropdownState>
  >({});

  const [localPropertyStates, setLocalPropertyStates] = useState<{
    [apartmentId: number]: {
      ownerName?: string;
      ownerPhone?: string;
      salePrice?: number;
      jeonsePrice?: number;
      deposit?: number;
      monthPrice?: number;
      contractDate?: string;
    };
  }>({});

  const sendPropertyChanges = useCallback(
    async (
      apartmentId: number,
      options?: {
        dropdownOverrides?: DropdownState;
        contractDateOverride?: string | null;
      }
    ) => {
      const propertyChanges = localPropertyStates[apartmentId] ?? {};

      try {
        const currentApartment = apartments.find(
          (apt) => apt.apartmentId === apartmentId
        );

        if (!currentApartment) {
          throw new Error("APARTMENT_NOT_FOUND");
        }
        const currentProperty = currentApartment.property;

        const hasPropertyFieldChanges = propertyFieldKeys.some(
          (key) => propertyChanges[key] !== undefined
        );
        const pendingDropdown = localDropdownStates[apartmentId];
        const mergedDropdownState =
          pendingDropdown || options?.dropdownOverrides
            ? {
                ...(pendingDropdown ?? {}),
                ...(options?.dropdownOverrides ?? {}),
              }
            : undefined;
        const hasDropdownChanges =
          !!mergedDropdownState && Object.keys(mergedDropdownState).length > 0;

        if (!hasPropertyFieldChanges && !hasDropdownChanges) {
          return;
        }

        // 데이터 병합: 기본값 → 현재값 → 변경값
        const requestData = {
          ...propertyFieldDefaults,
          ...currentProperty,
          ...propertyChanges,
        };

        const requestPayload: PropertyMutationPayload = {
          apartmentId,
          ...requestData,
          manageType:
            mergedDropdownState?.manageType ??
            currentProperty?.manageType ??
            "NONE",
          requestType:
            mergedDropdownState?.requestType ??
            currentProperty?.requestType ??
            "NONE",
          propertyStatus:
            mergedDropdownState?.propertyStatus ??
            currentProperty?.propertyStatus ??
            "NONE",
          contractDate: normalizeDateValue(requestData.contractDate || null),
        };

        if (!currentProperty) {
          await handlePropertyBatchUpdate(requestPayload, true);
        } else {
          await handlePropertyBatchUpdate(requestPayload, false);
        }

        if (localPropertyStates[apartmentId]) {
          setLocalPropertyStates((prev) => {
            const newState = { ...prev };
            delete newState[apartmentId];
            return newState;
          });
        }

        // refetch를 기다리지 않고 방금 바꾼 행만 즉시 반영
        updateApartmentCache(requestPayload);
      } catch (error) {
        console.error(error);
        alert("매물 정보 업데이트에 실패했습니다.");
        throw error;
      }
    },
    [
      apartments,
      localPropertyStates,
      handlePropertyBatchUpdate,
      localDropdownStates,
      updateApartmentCache,
    ]
  );

  const getCurrentPropertyStatus = useCallback(
    (apartmentId: number): PropertyStatus => {
      const overriddenStatus = localDropdownStates[apartmentId]?.propertyStatus;
      if (overriddenStatus) {
        return overriddenStatus;
      }
      const propertyStatus = apartments.find(
        (apt) => apt.apartmentId === apartmentId
      )?.property?.propertyStatus;
      return propertyStatus ?? "NONE";
    },
    [apartments, localDropdownStates]
  );

  const applyDropdownUpdates = useCallback(
    async (apartmentId: number, updates: DropdownState) => {
      if (!updates || Object.keys(updates).length === 0) {
        return;
      }

      const nextState = {
        ...(localDropdownStates[apartmentId] ?? {}),
        ...updates,
      };

      setLocalDropdownStates((prev) => ({
        ...prev,
        [apartmentId]: nextState,
      }));

      try {
        await sendPropertyChanges(apartmentId, {
          dropdownOverrides: nextState,
        });
        setLocalDropdownStates((prev) => {
          if (prev[apartmentId] !== nextState) {
            return prev;
          }
          const newState = { ...prev };
          delete newState[apartmentId];
          return newState;
        });
      } catch {
        // 실패 시 로컬 상태를 유지하여 재시도 가능하도록 함
      }
    },
    [localDropdownStates, sendPropertyChanges]
  );

  // 드롭다운 업데이트 통합 핸들러
  const handleDropdownUpdate = useCallback(
    async (apartmentId: number, field: keyof DropdownState, value: string) => {
      // 즐겨찾기 변경 시 새로운 API 호출
      if (field === "manageType") {
        try {
          await updatePropertyManage(apartmentId, value as ManageType);
          // 성공 시 로컬 상태 업데이트
          setLocalDropdownStates((prev) => ({
            ...prev,
            [apartmentId]: {
              ...prev[apartmentId],
              manageType: value as ManageType,
            },
          }));
          // 캐시 업데이트
          queryClient.setQueriesData<
            PropertiesResponse | InfiniteData<PropertiesResponse>
          >({ queryKey: ["apartments"] }, (oldData) => {
            if (!oldData) return oldData;

            const updateApartment = (apt: ApartmentWithProperty) => {
              if (apt.apartmentId === apartmentId) {
                return {
                  ...apt,
                  property: apt.property
                    ? {
                        ...apt.property,
                        manageType: value as ManageType,
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
          });
        } catch (error) {
          console.error("즐겨찾기 업데이트 실패:", error);
          alert("즐겨찾기 업데이트에 실패했습니다.");
        }
        return;
      }

      const updates: DropdownState = {
        [field]: value,
      };

      // 의뢰 유형 변경 시 매물 상태 자동 조정
      if (field === "requestType") {
        const currentPropertyStatus = getCurrentPropertyStatus(apartmentId);

        if (value === "NONE") {
          updates.propertyStatus = "NONE";
        } else if (currentPropertyStatus === "NONE") {
          updates.propertyStatus = "BEFORE";
        }
      }

      void applyDropdownUpdates(apartmentId, updates);
    },
    [applyDropdownUpdates, getCurrentPropertyStatus, queryClient]
  );

  const prevSelectedApartmentIdRef = useRef<number | string | undefined>(
    selectedApartmentId
  );

  // 다른 매물 클릭 시 이전 매물의 변경사항 일괄 전송
  useEffect(() => {
    const prevId = prevSelectedApartmentIdRef.current;
    const currentId = selectedApartmentId;

    // 이전에 선택된 매물이 있고, 현재 다른 매물을 선택했을 때
    if (
      prevId &&
      prevId !== currentId &&
      (localPropertyStates[prevId as number] ||
        (localDropdownStates[prevId as number] &&
          Object.keys(localDropdownStates[prevId as number]).length > 0))
    ) {
      const prevKey = prevId as number;
      // 이전 매물의 변경사항을 일괄 전송
      sendPropertyChanges(prevKey)
        .then(() => {
          setLocalDropdownStates((prev) => {
            if (!prev[prevKey]) {
              return prev;
            }
            const newState = { ...prev };
            delete newState[prevKey];
            return newState;
          });
        })
        .catch(() => {});
    }

    // 현재 선택된 매물 ID 업데이트
    prevSelectedApartmentIdRef.current = currentId;
  }, [
    selectedApartmentId,
    sendPropertyChanges,
    localPropertyStates,
    localDropdownStates,
  ]);

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
            <TableHead>타입</TableHead>
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
                colSpan={14}
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
                    colSpan={14}
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
                          colSpan={14}
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
                        colSpan={14}
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
                const pendingProperty =
                  localPropertyStates[apartment.apartmentId];
                const salePriceValue =
                  pendingProperty?.salePrice ?? property?.salePrice;
                const jeonsePriceValue =
                  pendingProperty?.jeonsePrice ?? property?.jeonsePrice;
                const depositValue =
                  pendingProperty?.deposit ?? property?.deposit;
                const monthPriceValue =
                  pendingProperty?.monthPrice ?? property?.monthPrice;
                const ownerPhoneValue =
                  pendingProperty?.ownerPhone ?? property?.ownerPhone;
                const ownerNameValue =
                  pendingProperty?.ownerName ?? property?.ownerName;
                const formattedOwnerPhone =
                  formatPhoneNumber(ownerPhoneValue) ??
                  (ownerPhoneValue ? String(ownerPhoneValue) : undefined);

                return (
                  <TableRow
                    key={apartment.apartmentId}
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      isSelected
                        ? "bg-[#EEF6FF] ring-2 ring-inset ring-[#1499FF]"
                        : ""
                    }`}
                    onClick={() => onPropertyClick?.(apartment.apartmentId)}
                  >
                    {/* 즐겨찾기 */}
                    <TableCell className="px-2">
                      <div className="flex items-center justify-center">
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
                          value={
                            localDropdownStates[apartment.apartmentId]
                              ?.manageType ??
                            apartment.property?.manageType ??
                            "NONE"
                          }
                          onChange={(value) => {
                            handleDropdownUpdate(
                              apartment.apartmentId,
                              "manageType",
                              value
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
                    <TableCell>{apartment.dong}</TableCell>

                    {/* 호수 */}
                    <TableCell>{apartment.ho}</TableCell>

                    {/* 타입 */}
                    <TableCell>{apartment.type}</TableCell>

                    {/* 점유 상태 */}
                    <TableCell>
                      {apartment.property?.occupancyStatus || "-"}
                    </TableCell>

                    {/* 기매입금 */}
                    <TableCell>
                      {apartment.property?.contractSalePrice != null
                        ? formatPriceWithDecimal(
                            apartment.property.contractSalePrice
                          )
                        : "-"}
                    </TableCell>

                    {/* 현임차 */}
                    <TableCell>
                      {apartment.property?.occupancyStatus === "JEONSE"
                        ? apartment.property?.contractJeonsePrice != null
                          ? formatPriceWithDecimal(
                              apartment.property.contractJeonsePrice
                            )
                          : "-"
                        : apartment.property?.occupancyStatus ===
                            "MONTHLY_RENT"
                          ? apartment.property?.contractDeposit != null ||
                              apartment.property?.contractMonthlyRent != null
                            ? `${apartment.property?.contractDeposit != null ? formatPriceWithDecimal(apartment.property.contractDeposit) : "-"} / ${apartment.property?.contractMonthlyRent != null ? formatPriceWithDecimal(apartment.property.contractMonthlyRent) : "-"}`
                            : "-"
                          : "-"}
                    </TableCell>

                    {/* 만기일 */}
                    <TableCell>
                      {apartment.property?.expireDate || "-"}
                    </TableCell>

                    {/* 의뢰 유형 */}
                    <TableCell>
                      {requestTypeOptions.find(
                        (opt) =>
                          opt.value ===
                          (apartment.property?.requestType ?? "NONE")
                      )?.label || "-"}
                    </TableCell>

                    {/* 매도가 */}
                    <TableCell>
                      {salePriceValue
                        ? formatPriceWithDecimal(salePriceValue)
                        : "-"}
                    </TableCell>

                    {/* 전세가 */}
                    <TableCell>
                      {jeonsePriceValue
                        ? formatPriceWithDecimal(jeonsePriceValue)
                        : "-"}
                    </TableCell>

                    {/* 보증금/월세가 */}
                    <TableCell>
                      {depositValue || monthPriceValue
                        ? `${depositValue ? formatPriceWithDecimal(depositValue) : "-"} / ${monthPriceValue ? formatPriceWithDecimal(monthPriceValue) : "-"}`
                        : "-"}
                    </TableCell>

                    {/* 의뢰 등록일 */}
                    <TableCell>
                      {apartment.property?.requestRegistrationDate || "-"}
                    </TableCell>

                    {/* 소유자 */}
                    <TableCell>{ownerNameValue || "-"}</TableCell>

                    {/* 연락처 */}
                    <TableCell>{formattedOwnerPhone || "-"}</TableCell>
                  </TableRow>
                );
              })}
              {virtualItems.length > 0 &&
                rowVirtualizer.getTotalSize() -
                  virtualItems[virtualItems.length - 1].end >
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={14}
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
