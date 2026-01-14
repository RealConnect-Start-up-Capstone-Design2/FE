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
  RequestType,
  PropertyStatus,
  ManageType,
  ApartmentWithProperty,
  PropertiesResponse,
} from "../stores/propertyStore";
import { usePropertyEdit } from "../hooks/usePropertyEdit";
import { useVirtualInfiniteScroll } from "@/shared/hooks";
import type { PropertyMutationPayload } from "../services/propertyService";
import { formatPrice, formatPhoneNumber } from "@/shared/utils";
import {
  EditablePropertyCell,
  EditableDepositMonthCell,
} from "./EditablePropertyCell";
import {
  propertyFieldDefaults,
  emptyAllowedFields,
  requestTypeOptions,
  propertyStatusOptions,
  manageTypeFilterOptions,
  ESTIMATED_ROW_HEIGHT,
} from "../constants/propertyConstants";
import { isValidDate, normalizeDateValue } from "@/shared/utils";
import {
  updateApartmentList,
  isInfinitePropertiesData,
  isPropertiesResponse,
} from "../utils/propertyCacheUtils";
import type { PropertyFieldKey, DropdownState } from "../types/property";
import { TableHeaderFilter } from "@/components/ui";
import type { DropdownOption } from "@/components/ui/dropdown-menu";
import { sqmToPyeong, formatArea } from "@/shared/utils";

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
  areaOptions,
  selectedArea,
  onSelectArea,
  selectedRequestType,
  onSelectRequestType,
  selectedPropertyStatus,
  onSelectPropertyStatus,
  isSqmOrPyeong,
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

  const handlePropertyUpdate = useCallback(
    (apartmentId: number, field: string, value: string | number) => {
      if (value === undefined) return;
      if (value === "" && !emptyAllowedFields.includes(field)) return; // 이러면 값을 지우기만 했을 때에도 저장됨.

      setLocalPropertyStates((prev) => ({
        ...prev,
        [apartmentId]: {
          ...prev[apartmentId],
          [field]: value,
        },
      }));
    },
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
    (apartmentId: number, field: keyof DropdownState, value: string) => {
      const updates: DropdownState = {
        [field]: value,
      };

      // 의뢰 유형 변경 시 매물 상태 자동 조정
      if (field === "requestType") {
        const currentPropertyStatus = getCurrentPropertyStatus(apartmentId);

        if (value === "NONE" || value === "SELF") {
          updates.propertyStatus = "NONE";
        } else if (
          value !== "NOT_RECEIVED" &&
          value !== "THINKING" &&
          currentPropertyStatus === "NONE"
        ) {
          updates.propertyStatus = "BEFORE";
        }
      }

      void applyDropdownUpdates(apartmentId, updates);
    },
    [applyDropdownUpdates, getCurrentPropertyStatus]
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
              title="관리 타입"
              value={selectedManageType}
              onChange={onSelectManageType}
              options={manageTypeFilterOptions}
              className="w-24 text-center"
            />
            <TableHead>동</TableHead>
            <TableHead>호수</TableHead>
            <TableHeaderFilter
              title="면적"
              value={selectedArea}
              onChange={onSelectArea}
              options={areaOptions ?? []}
              className="w-24 text-center"
            />
            <TableHeaderFilter
              title="의뢰 유형"
              value={selectedRequestType}
              onChange={onSelectRequestType}
              options={requestTypeOptions}
              className="w-24 text-center"
            />
            <TableHeaderFilter
              title="매물 상태"
              value={selectedPropertyStatus}
              onChange={onSelectPropertyStatus}
              options={propertyStatusOptions}
              className="w-24 text-center"
            />
            <TableHead>매매</TableHead>
            <TableHead>전세</TableHead>
            <TableHead>보증금/월세</TableHead>
            <TableHead>소유자</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>계약일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasApartments ? (
            <TableRow>
              <TableCell
                colSpan={12}
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
                    colSpan={12}
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
                          colSpan={12}
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
                        colSpan={12}
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
                const contractDateValue =
                  pendingProperty?.contractDate ?? property?.contractDate;

                const propertyStatus =
                  localDropdownStates[apartment.apartmentId]?.propertyStatus ??
                  apartment.property?.propertyStatus ??
                  "NONE";
                const isActiveStatus =
                  propertyStatus === "BEFORE" ||
                  propertyStatus === "ADVERTISING";
                const dropdownBgColor = isActiveStatus
                  ? "bg-[#E8EDFF]"
                  : "bg-[#EDEDED]";

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
                    {/* 관리 타입 */}
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

                    {/* 면적 */}
                    <TableCell>
                      {isSqmOrPyeong === "sqm"
                        ? `${apartment.area}㎡`
                        : `${formatArea(
                            sqmToPyeong(apartment.area),
                            "pyeong"
                          )}`}
                    </TableCell>

                    {/* 의뢰 유형 */}
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <DropdownMenuCell
                          options={requestTypeOptions}
                          value={
                            localDropdownStates[apartment.apartmentId]
                              ?.requestType ??
                            apartment.property?.requestType ??
                            "NONE"
                          }
                          onChange={(value) => {
                            handleDropdownUpdate(
                              apartment.apartmentId,
                              "requestType",
                              value
                            );
                          }}
                          buttonClassName={`w-[70px] min-w-[70px] ${dropdownBgColor}`}
                        />
                      </div>
                    </TableCell>

                    {/* 매물 상태 */}
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <DropdownMenuCell
                          options={propertyStatusOptions}
                          value={
                            localDropdownStates[apartment.apartmentId]
                              ?.propertyStatus ??
                            apartment.property?.propertyStatus ??
                            "NONE"
                          }
                          onChange={(value) => {
                            handleDropdownUpdate(
                              apartment.apartmentId,
                              "propertyStatus",
                              value
                            );
                          }}
                          buttonClassName={`w-[90px] min-w-[90px] ${dropdownBgColor}`}
                        />
                      </div>
                    </TableCell>

                    {/* 매매가 */}
                    <EditablePropertyCell
                      apartmentId={apartment.apartmentId}
                      field="salePrice"
                      value={salePriceValue}
                      isSelected={isSelected}
                      type="number"
                      placeholder=""
                      suffix="억"
                      displayValue={formatPriceWithDecimal(salePriceValue)}
                      onUpdate={handlePropertyUpdate}
                    />

                    {/* 전세가 */}
                    <EditablePropertyCell
                      apartmentId={apartment.apartmentId}
                      field="jeonsePrice"
                      value={jeonsePriceValue}
                      isSelected={isSelected}
                      type="number"
                      placeholder=""
                      suffix="억"
                      displayValue={formatPriceWithDecimal(jeonsePriceValue)}
                      onUpdate={handlePropertyUpdate}
                    />

                    {/* 보증금/월세 */}
                    <EditableDepositMonthCell
                      apartmentId={apartment.apartmentId}
                      depositValue={depositValue}
                      monthValue={monthPriceValue}
                      isSelected={isSelected}
                      onUpdate={handlePropertyUpdate}
                    />

                    {/* 소유자 */}
                    <EditablePropertyCell
                      apartmentId={apartment.apartmentId}
                      field="ownerName"
                      value={ownerNameValue}
                      isSelected={isSelected}
                      type="text"
                      placeholder="소유자"
                      displayValue={ownerNameValue}
                      onUpdate={handlePropertyUpdate}
                    />

                    {/* 연락처 */}
                    <EditablePropertyCell
                      apartmentId={apartment.apartmentId}
                      field="ownerPhone"
                      value={ownerPhoneValue}
                      isSelected={isSelected}
                      type="tel"
                      placeholder="연락처"
                      displayValue={formattedOwnerPhone}
                      onUpdate={handlePropertyUpdate}
                    />

                    {/* 계약일 */}
                    <EditablePropertyCell
                      apartmentId={apartment.apartmentId}
                      field="contractDate"
                      value={contractDateValue}
                      isSelected={isSelected}
                      type="text"
                      placeholder="yyyy-mm-dd"
                      displayValue={contractDateValue || undefined}
                      inputClassName="w-28"
                      validate={isValidDate}
                      invalidMessage="계약일은 yyyy-mm-dd 형식으로 입력해주세요."
                      onUpdate={handlePropertyUpdate}
                      allowEmpty
                    />
                  </TableRow>
                );
              })}
              {virtualItems.length > 0 &&
                rowVirtualizer.getTotalSize() -
                  virtualItems[virtualItems.length - 1].end >
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={12}
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
