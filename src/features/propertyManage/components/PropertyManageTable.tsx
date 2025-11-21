import {
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
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
import {
  getApartments,
  updatePropertyInGlobalState,
  type RequestType,
  type PropertyStatus,
  type ManageType,
  type ApartmentWithProperty,
  type PropertiesResponse,
  type PropertyInfo,
} from "../stores/propertyStore";
import { usePropertyEdit } from "../hooks/usePropertyEdit";
import type { PropertyMutationPayload } from "../services/propertyService";
import { formatPrice, formatPhoneNumber } from "@/shared/utils";
import {
  EditablePropertyCell,
  EditableDepositMonthCell,
} from "./EditablePropertyCell";

// 이미지 불러오기
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";
import Caution from "@/assets/Caution.svg";

const propertyFieldDefaults: {
  ownerName: string;
  ownerPhone: string;
  salePrice: number;
  jeonsePrice: number;
  deposit: number;
  monthPrice: number;
  contractDate: string;
} = {
  ownerName: "",
  ownerPhone: "",
  salePrice: 0,
  jeonsePrice: 0,
  deposit: 0,
  monthPrice: 0,
  contractDate: "",
};

// property가 아직 생성되지 않은 경우에도 안전하게 병합하기 위한 기본값
const propertyInfoDefaults: PropertyInfo = {
  salePrice: 0,
  jeonsePrice: 0,
  deposit: 0,
  monthPrice: 0,
  propertyStatus: "NONE",
  requestType: "NONE",
  manageType: "NONE",
  ownerName: "",
  ownerPhone: "",
  contractDate: "",
};

type PropertyFieldKey = keyof typeof propertyFieldDefaults;

type DropdownState = {
  manageType?: ManageType;
  requestType?: RequestType;
  propertyStatus?: PropertyStatus;
};

const propertyFieldKeys = Object.keys(
  propertyFieldDefaults
) as PropertyFieldKey[];

const isTextField = (
  key: PropertyFieldKey
): key is "ownerName" | "ownerPhone" | "contractDate" =>
  key === "ownerName" || key === "ownerPhone" || key === "contractDate";

const normalizeContractDateValue = (value?: string | null) => {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

// 의뢰 유형 옵션 (API 스펙 기준)
const requestTypeOptions: { label: string; value: RequestType }[] = [
  { label: "없음", value: "NONE" },
  { label: "입주", value: "SELF" },
  { label: "매도", value: "SALE" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY" },
  { label: "미수신", value: "NOT_RECEIVED" },
  { label: "고민중", value: "THINKING" },
];

// 매물 상태 옵션 (API 스펙 기준)
const propertyStatusOptions: { label: string; value: PropertyStatus }[] = [
  { label: "없음", value: "NONE" },
  { label: "거래 전", value: "BEFORE" },
  { label: "광고 중", value: "ADVERTISING" },
  { label: "거래 완료", value: "COMPLETED" },
];

// TODO: API에서 제공되면 전체 아파트 수를 동적으로 계산
const TOTAL_APARTMENT_COUNT = 6864;
// 한 행의 높이 (72px 정도로 일단 구현해둠. 해상도에 따라 달라서 대충 이정도로만 유지해도 될 듯?)
const ESTIMATED_ROW_HEIGHT = 72;

// 낙관적 업데이트에서 단일 아파트 데이터를 새 payload로 대체
const buildUpdatedApartment = (
  apartment: ApartmentWithProperty,
  payload: PropertyMutationPayload
): ApartmentWithProperty => {
  const baseProperty: PropertyInfo = {
    ...propertyInfoDefaults,
    ...(apartment.property ?? {}),
  };

  const nextProperty: PropertyInfo = {
    ...baseProperty,
    salePrice: payload.salePrice,
    jeonsePrice: payload.jeonsePrice,
    deposit: payload.deposit,
    monthPrice: payload.monthPrice,
    ownerName: payload.ownerName,
    ownerPhone: payload.ownerPhone,
    contractDate: payload.contractDate ?? "",
    propertyStatus: payload.propertyStatus,
    requestType: payload.requestType,
    manageType: payload.manageType,
  };

  return {
    ...apartment,
    property: nextProperty,
  };
};

// 페이지/목록 단위에서 특정 apartmentId를 찾아 갱신
const updateApartmentList = (
  apartments: ApartmentWithProperty[],
  payload: PropertyMutationPayload
): { changed: boolean; content: ApartmentWithProperty[] } => {
  let changed = false;
  const content = apartments.map((apt) => {
    if (apt.apartmentId !== payload.apartmentId) {
      return apt;
    }
    changed = true;
    return buildUpdatedApartment(apt, payload);
  });

  return { changed, content };
};

// useInfiniteQuery 형태인지 판별 (pages/pageParams 존재 여부로 확인)
const isInfinitePropertiesData = (
  data: unknown
): data is InfiniteData<PropertiesResponse> => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const maybeInfinite = data as InfiniteData<PropertiesResponse>;
  return (
    Array.isArray(maybeInfinite.pages) &&
    Array.isArray(maybeInfinite.pageParams)
  );
};

// 단일 페이지 응답인지 판별
const isPropertiesResponse = (data: unknown): data is PropertiesResponse => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const maybeResponse = data as PropertiesResponse;
  return (
    Array.isArray(maybeResponse.content) &&
    typeof maybeResponse.hasNext === "boolean" &&
    Object.prototype.hasOwnProperty.call(maybeResponse, "nextCursor")
  );
};

interface PropertyManageTableProps {
  onPropertyClick?: (apartmentId: string | number) => void;
  selectedApartmentId?: string | number;
  apartments?: ApartmentWithProperty[]; // 외부에서 데이터를 받아올 경우
  isLoading?: boolean; // 로딩 상태
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  hasActiveFilters?: boolean;
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
}: PropertyManageTableProps) {
  // React Query로 아파트 목록 조회 (외부에서 데이터를 받지 않을 경우만)
  const { data, isLoading: internalIsLoading } = useQuery({
    queryKey: ["apartments"],
    queryFn: async () => {
      // TODO: 추후 API 연동 시 fetchProperties({ apartmentComplexId: 1 })로 변경
      // return await fetchProperties({ apartmentComplexId: 1 });
      return getApartments();
    },
    enabled: !externalApartments, // 외부 데이터가 없을 때만 실행
  });

  // 외부에서 받은 데이터 우선 사용
  const apartments = useMemo(
    () => externalApartments || data?.content || [],
    [externalApartments, data?.content]
  );
  const isLoading = externalIsLoading ?? internalIsLoading;

  // 편집 관련 로직
  const { handlePropertyBatchUpdate } = usePropertyEdit();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const formatPriceWithDecimal = useCallback(
    (price?: number | null) => formatPrice(price),
    []
  );

  const isValidContractDate = useCallback((value: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return false;
    }
    const [yearStr, monthStr, dayStr] = value.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day)
    ) {
      return false;
    }
    if (month < 1 || month > 12) {
      return false;
    }
    if (day < 1 || day > 31) {
      return false;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return false;
    }
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day
    ) {
      return false;
    }
    return true;
  }, []);

  const handlePropertyUpdate = useCallback(
    (apartmentId: number, field: string, value: string | number) => {
      if (value === undefined) return;
      if (value === "" && field !== "contractDate") return;

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

  const hasApartments = apartments.length > 0;
  const shouldUseTotalRowCount = hasApartments && !hasActiveFilters;
  const nonPlaceholderRowCount = shouldUseTotalRowCount
    ? Math.max(apartments.length, TOTAL_APARTMENT_COUNT)
    : apartments.length;
  const totalRowCount =
    nonPlaceholderRowCount + (hasActiveFilters && hasNextPage ? 1 : 0);
  const rowVirtualizer = useVirtualizer({
    count: totalRowCount,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 12,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (!hasNextPage || !onLoadMore || isFetchingNextPage) {
      return;
    }
    if (virtualItems.length === 0) {
      return;
    }

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= apartments.length - 5) {
      onLoadMore();
    }
  }, [
    virtualItems,
    hasNextPage,
    onLoadMore,
    apartments.length,
    isFetchingNextPage,
  ]);

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

        const requestData: typeof propertyFieldDefaults = {
          ...propertyFieldDefaults,
        };

        for (const key of propertyFieldKeys) {
          const changeValue = propertyChanges[key];
          const currentValue = currentProperty?.[key];
          const fallbackValue = propertyFieldDefaults[key];
          const resolvedValue =
            changeValue !== undefined
              ? changeValue
              : currentValue ?? fallbackValue;

          if (isTextField(key)) {
            requestData[key] = String(resolvedValue);
          } else {
            requestData[key] = Number(resolvedValue);
          }
        }

        const resolvedManageType: ManageType =
          mergedDropdownState?.manageType ??
          currentProperty?.manageType ??
          "NONE";
        const resolvedRequestType: RequestType =
          mergedDropdownState?.requestType ??
          currentProperty?.requestType ??
          "NONE";
        const resolvedPropertyStatus: PropertyStatus =
          mergedDropdownState?.propertyStatus ??
          currentProperty?.propertyStatus ??
          "NONE";

        const resolvedContractDate = normalizeContractDateValue(
          requestData.contractDate || null
        );

        const requestPayload: PropertyMutationPayload = {
          apartmentId,
          ...requestData,
          manageType: resolvedManageType,
          requestType: resolvedRequestType,
          propertyStatus: resolvedPropertyStatus,
          contractDate: resolvedContractDate,
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

        const propertyUpdates: Partial<{
          propertyStatus: PropertyStatus;
          requestType: RequestType;
          manageType: ManageType;
        }> = {};

        if (nextState.requestType) {
          propertyUpdates.requestType = nextState.requestType;
        }
        if (nextState.propertyStatus) {
          propertyUpdates.propertyStatus = nextState.propertyStatus;
        }
        if (nextState.manageType) {
          propertyUpdates.manageType = nextState.manageType;
        }

        if (Object.keys(propertyUpdates).length > 0) {
          updatePropertyInGlobalState(apartmentId, propertyUpdates);
        }
      } catch {
        // 실패 시 로컬 상태를 유지하여 재시도 가능하도록 함
      }
    },
    [localDropdownStates, sendPropertyChanges]
  );

  // 의뢰 유형 전용 핸들러 - onChange 시점에 즉시 처리
  const handleRequestTypeUpdate = useCallback(
    (apartmentId: number, requestType: string) => {
      const currentPropertyStatus = getCurrentPropertyStatus(apartmentId);
      const updates: DropdownState = {
        requestType: requestType as RequestType,
      };

      if (requestType === "NONE" || requestType === "SELF") {
        updates.propertyStatus = "NONE";
      } else if (
        requestType !== "NOT_RECEIVED" &&
        requestType !== "THINKING" &&
        currentPropertyStatus === "NONE"
      ) {
        updates.propertyStatus = "BEFORE";
      }

      void applyDropdownUpdates(apartmentId, updates);
    },
    [applyDropdownUpdates, getCurrentPropertyStatus]
  );

  // 매물 상태 전용 핸들러 - onChange 시점에 즉시 처리
  const handlePropertyStatusUpdate = useCallback(
    (apartmentId: number, propertyStatus: string) => {
      void applyDropdownUpdates(apartmentId, {
        propertyStatus: propertyStatus as PropertyStatus,
      });
    },
    [applyDropdownUpdates]
  );

  // 관리 타입 전용 핸들러 - onChange 시점에 즉시 처리
  const handleManageTypeUpdate = useCallback(
    (apartmentId: number, manageType: string) => {
      void applyDropdownUpdates(apartmentId, {
        manageType: manageType as ManageType,
      });
    },
    [applyDropdownUpdates]
  );

  // 현재 표시할 값 계산 (로컬 상태 우선, 없으면 서버 데이터)
  const getDisplayValue = (
    apartment: ApartmentWithProperty,
    field: "manageType" | "requestType" | "propertyStatus"
  ) => {
    const localValue = localDropdownStates[apartment.apartmentId]?.[field];
    if (localValue) return localValue;
    return apartment.property?.[field] || "NONE";
  };

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
            <TableHead className="w-24 text-center">관리 타입</TableHead>
            <TableHead>동</TableHead>
            <TableHead>호수</TableHead>
            <TableHead>면적</TableHead>
            <TableHead>의뢰 유형</TableHead>
            <TableHead>매물 상태</TableHead>
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

                const propertyStatus = getDisplayValue(
                  apartment,
                  "propertyStatus"
                );
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
                          value={getDisplayValue(apartment, "manageType")}
                          onChange={(value) => {
                            handleManageTypeUpdate(
                              apartment.apartmentId,
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
                    <TableCell>{apartment.area}㎡</TableCell>

                    {/* 의뢰 유형 */}
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <DropdownMenuCell
                          options={requestTypeOptions}
                          value={getDisplayValue(apartment, "requestType")}
                          onChange={(value) => {
                            handleRequestTypeUpdate(
                              apartment.apartmentId,
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
                          value={getDisplayValue(apartment, "propertyStatus")}
                          onChange={(value) => {
                            handlePropertyStatusUpdate(
                              apartment.apartmentId,
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
                      validate={isValidContractDate}
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
