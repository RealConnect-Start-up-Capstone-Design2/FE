import { useQuery, useQueryClient } from "@tanstack/react-query";
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
} from "../stores/propertyStore";
import { usePropertyEdit } from "../hooks/usePropertyEdit";
import {
  updateRequestTypeAPI,
  createPropertyWithRequestTypeAPI,
  updatePropertyStatusAPI,
  createPropertyWithStatusAPI,
  updateManageTypeAPI,
  createPropertyWithManageTypeAPI,
} from "../services/propertyService";
import { formatPrice } from "@/shared/utils";
import {
  EditablePropertyCell,
  EditableDepositMonthCell,
} from "./EditablePropertyCell";

// 이미지 불러오기
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";
import Caution from "@/assets/Caution.svg";

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

interface PropertyManageTableProps {
  onPropertyClick?: (apartmentId: string | number) => void;
  selectedApartmentId?: string | number;
  apartments?: ApartmentWithProperty[]; // 외부에서 데이터를 받아올 경우
  isLoading?: boolean; // 로딩 상태
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

export function PropertyManageTable({
  onPropertyClick,
  selectedApartmentId,
  apartments: externalApartments,
  isLoading: externalIsLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
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

  const formatPriceWithDecimal = useCallback(
    (price?: number | null) => formatPrice(price),
    []
  );

  const handlePropertyUpdate = useCallback(
    (apartmentId: number, field: string, value: string | number) => {
      if (value === undefined || value === "") return;

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

  const [localDropdownStates, setLocalDropdownStates] = useState<{
    [apartmentId: number]: {
      manageType?: ManageType;
      requestType?: RequestType;
      propertyStatus?: PropertyStatus;
    };
  }>({});

  const [localPropertyStates, setLocalPropertyStates] = useState<{
    [apartmentId: number]: {
      ownerName?: string;
      ownerPhone?: string;
      salePrice?: number;
      jeonsePrice?: number;
      deposit?: number;
      monthPrice?: number;
    };
  }>({});

  // 의뢰 유형 전용 핸들러 - onChange 시점에 즉시 처리
  const handleRequestTypeUpdate = useCallback(
    async (apartmentId: number, requestType: string) => {
      try {
        // 현재 아파트 데이터 확인 (최신 상태)
        const currentApartment = apartments.find(
          (apt) => apt.apartmentId === apartmentId
        );

        // 매물 상태 확인 (로컬 상태 우선, 없으면 서버 데이터)
        const currentPropertyStatus =
          localDropdownStates[apartmentId]?.propertyStatus ??
          currentApartment?.property?.propertyStatus ??
          "NONE";

        // property가 존재하면 PATCH, 없으면 POST
        if (currentApartment?.property) {
          await updateRequestTypeAPI(apartmentId, requestType);
        } else {
          await createPropertyWithRequestTypeAPI(apartmentId, requestType);
        }

        // 의뢰 유형이 "NONE"이 아니고, 매물 상태가 "NONE"이면 자동으로 "BEFORE"로 변경
        if (requestType !== "NONE" && currentPropertyStatus === "NONE") {
          try {
            const apartment = apartments.find(
              (apt) => apt.apartmentId === apartmentId
            );
            // property가 존재하면 PATCH, 없으면 POST로 매물 상태도 함께 생성
            if (apartment?.property) {
              await updatePropertyStatusAPI(apartmentId, "BEFORE");
            } else {
              await createPropertyWithStatusAPI(apartmentId, "BEFORE");
            }
          } catch (statusError) {
            console.error("매물 상태 자동 업데이트 실패:", statusError);
            // 매물 상태 업데이트 실패해도 의뢰 유형 업데이트는 성공했으므로 에러 무시
          }
        }

        // 로컬 상태에서 해당 변경사항 제거 (이미 서버에 반영됨)
        setLocalDropdownStates((prev) => {
          const newState = { ...prev };
          if (newState[apartmentId]) {
            delete newState[apartmentId].requestType;
            // 다른 변경사항이 없으면 해당 아파트 상태 객체 삭제
            if (Object.keys(newState[apartmentId]).length === 0) {
              delete newState[apartmentId];
            }
          }
          return newState;
        });

        queryClient.invalidateQueries({ queryKey: ["apartments"] });
      } catch (error) {
        console.error("의뢰 유형 업데이트 실패:", error);
        alert("의뢰 유형 업데이트에 실패했습니다.");
      }
    },
    [apartments, queryClient, localDropdownStates]
  );

  // 매물 상태 전용 핸들러 - onChange 시점에 즉시 처리
  const handlePropertyStatusUpdate = useCallback(
    async (apartmentId: number, propertyStatus: string) => {
      try {
        // 현재 아파트 데이터 확인 (최신 상태)
        const currentApartment = apartments.find(
          (apt) => apt.apartmentId === apartmentId
        );

        // property가 존재하면 PATCH, 없으면 POST
        if (currentApartment?.property) {
          await updatePropertyStatusAPI(apartmentId, propertyStatus);
        } else {
          await createPropertyWithStatusAPI(apartmentId, propertyStatus);
        }

        // 로컬 상태에서 해당 변경사항 제거 (이미 서버에 반영됨)
        setLocalDropdownStates((prev) => {
          const newState = { ...prev };
          if (newState[apartmentId]) {
            delete newState[apartmentId].propertyStatus;
            // 다른 변경사항이 없으면 해당 아파트 상태 객체 삭제
            if (Object.keys(newState[apartmentId]).length === 0) {
              delete newState[apartmentId];
            }
          }
          return newState;
        });

        queryClient.invalidateQueries({ queryKey: ["apartments"] });
      } catch (error) {
        console.error("매물 상태 업데이트 실패:", error);
        alert("매물 상태 업데이트에 실패했습니다.");
      }
    },
    [apartments, queryClient]
  );

  // 관리 타입 전용 핸들러 - onChange 시점에 즉시 처리
  const handleManageTypeUpdate = useCallback(
    async (apartmentId: number, manageType: string) => {
      try {
        // 현재 아파트 데이터 확인 (최신 상태)
        const currentApartment = apartments.find(
          (apt) => apt.apartmentId === apartmentId
        );

        // property가 존재하면 PATCH, 없으면 POST
        if (currentApartment?.property) {
          await updateManageTypeAPI(apartmentId, manageType);
        } else {
          await createPropertyWithManageTypeAPI(apartmentId, manageType);
        }

        // 로컬 상태에서 해당 변경사항 제거 (이미 서버에 반영됨)
        setLocalDropdownStates((prev) => {
          const newState = { ...prev };
          if (newState[apartmentId]) {
            delete newState[apartmentId].manageType;
            // 다른 변경사항이 없으면 해당 아파트 상태 객체 삭제
            if (Object.keys(newState[apartmentId]).length === 0) {
              delete newState[apartmentId];
            }
          }
          return newState;
        });

        // 글로벌 상태 업데이트
        updatePropertyInGlobalState(apartmentId, {
          manageType: manageType as ManageType,
        });

        queryClient.invalidateQueries({ queryKey: ["apartments"] });
      } catch (error) {
        console.error("관리 타입 업데이트 실패:", error);
        alert("관리 타입 업데이트에 실패했습니다.");
      }
    },
    [apartments, queryClient]
  );

  const sendPropertyChanges = useCallback(
    async (apartmentId: number) => {
      const changes = localPropertyStates[apartmentId];
      if (!changes) return;

      try {
        // 현재 아파트 데이터 확인
        const currentApartment = apartments.find(
          (apt) => apt.apartmentId === apartmentId
        );

        const currentProperty = currentApartment?.property;

        // 전체 매물 정보 구성
        const requestData = {
          apartmentId,
          ownerName: changes.ownerName || currentProperty?.ownerName || "",
          ownerPhone: changes.ownerPhone || currentProperty?.ownerPhone || "",
          salePrice: changes.salePrice || currentProperty?.salePrice || 0,
          jeonsePrice: changes.jeonsePrice || currentProperty?.jeonsePrice || 0,
          deposit: changes.deposit || currentProperty?.deposit || 0,
          monthPrice: changes.monthPrice || currentProperty?.monthPrice || 0,
        };

        // property가 없으면 POST로 생성, 있으면 PUT으로 업데이트
        if (!currentProperty) {
          await handlePropertyBatchUpdate(apartmentId, requestData, true);
        } else {
          await handlePropertyBatchUpdate(apartmentId, requestData, false);
        }

        // 계약 정보가 있으면 함께 동기화 (매물 정보에서 수정한 값을 계약에 반영)
        if (
          changes.ownerPhone ||
          changes.deposit !== undefined ||
          changes.monthPrice !== undefined
        ) {
          try {
            const { getContractAPI, saveContractAPI } = await import(
              "../services/contractService"
            );

            // 기존 계약 정보 조회
            const existingContract = await getContractAPI(apartmentId);

            // 계약 정보가 있을 때만 업데이트
            if (existingContract) {
              const contractUpdateData = {
                ...existingContract,
                gapPhone:
                  changes.ownerPhone !== undefined
                    ? String(changes.ownerPhone)
                    : existingContract.gapPhone,
                deposit:
                  changes.deposit !== undefined
                    ? Number(changes.deposit)
                    : existingContract.deposit,
                monthlyRent:
                  changes.monthPrice !== undefined
                    ? Number(changes.monthPrice)
                    : existingContract.monthlyRent,
              };

              // apartmentId는 제외하고 전송
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { apartmentId: _apartmentId, ...contractPayload } =
                contractUpdateData;
              await saveContractAPI(apartmentId, contractPayload);

              // 계약 정보 쿼리도 무효화
              queryClient.invalidateQueries({
                queryKey: ["contract", apartmentId],
              });
            }
          } catch (error) {
            console.error("계약 정보 동기화 실패:", error);
            // 계약 동기화 실패해도 매물 저장은 성공했으므로 에러 무시
          }
        }

        // 로컬 상태에서 해당 변경사항 제거
        setLocalPropertyStates((prev) => {
          const newState = { ...prev };
          delete newState[apartmentId];
          return newState;
        });

        queryClient.invalidateQueries({ queryKey: ["apartments"] });
      } catch (error) {
        console.error("매물 정보 업데이트 실패:", error);
        alert("매물 정보 업데이트에 실패했습니다.");
      }
    },
    [apartments, localPropertyStates, handlePropertyBatchUpdate, queryClient]
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
      localPropertyStates[prevId as number]
    ) {
      // 이전 매물의 변경사항을 일괄 전송
      sendPropertyChanges(prevId as number);
    }

    // 현재 선택된 매물 ID 업데이트
    prevSelectedApartmentIdRef.current = currentId;
  }, [selectedApartmentId, sendPropertyChanges, localPropertyStates]);

  // 무한스크롤을 위한 스크롤 감지
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container || !hasNextPage || !onLoadMore) return;

    const handleScroll = () => {
      if (isFetchingNextPage) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onLoadMore();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, onLoadMore, isFetchingNextPage]);

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
            <TableHead className="w-24 px-2 text-center">관리 타입</TableHead>
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
          {apartments.map((apartment) => {
            const isSelected = selectedApartmentId === apartment.apartmentId;
            const property = apartment.property;
            const pendingProperty = localPropertyStates[apartment.apartmentId];
            const salePriceValue =
              pendingProperty?.salePrice ?? property?.salePrice;
            const jeonsePriceValue =
              pendingProperty?.jeonsePrice ?? property?.jeonsePrice;
            const depositValue = pendingProperty?.deposit ?? property?.deposit;
            const monthPriceValue =
              pendingProperty?.monthPrice ?? property?.monthPrice;
            const ownerPhoneValue =
              pendingProperty?.ownerPhone ?? property?.ownerPhone;
            const ownerNameValue =
              pendingProperty?.ownerName ?? property?.ownerName;

            // 매물 상태에 따른 드롭다운 배경색 결정
            const propertyStatus = getDisplayValue(apartment, "propertyStatus");
            const isActiveStatus =
              propertyStatus === "BEFORE" || propertyStatus === "ADVERTISING";
            const dropdownBgColor = isActiveStatus
              ? "bg-[#E8EDFF]"
              : "bg-[#EDEDED]";

            return (
              <TableRow
                key={apartment.apartmentId}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  isSelected
                    ? "bg-[#EEF6FF] border border-2 border-[#1499FF]"
                    : ""
                }`}
                onClick={() => onPropertyClick?.(apartment.apartmentId)}
              >
                {/* 관리 타입 */}
                <TableCell className="px-2">
                  <div className="flex items-center justify-center">
                    <DropdownMenuCell
                      options={[
                        { label: "기본", value: "NONE", icon: UnfilledStar },
                        { label: "관심", value: "ATTENTION", icon: FilledStar },
                        { label: "주의", value: "CAUTION", icon: Caution },
                      ]}
                      value={getDisplayValue(apartment, "manageType")}
                      onChange={(value) => {
                        // 즉시 API 호출
                        handleManageTypeUpdate(apartment.apartmentId, value);
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
                  <DropdownMenuCell
                    options={requestTypeOptions}
                    value={getDisplayValue(apartment, "requestType")}
                    onChange={(value) => {
                      // 즉시 API 호출
                      handleRequestTypeUpdate(apartment.apartmentId, value);
                    }}
                    buttonClassName={`w-[70px] min-w-[70px] ${dropdownBgColor}`}
                  />
                </TableCell>

                {/* 매물 상태 */}
                <TableCell>
                  <DropdownMenuCell
                    options={propertyStatusOptions}
                    value={getDisplayValue(apartment, "propertyStatus")}
                    onChange={(value) => {
                      // 즉시 API 호출
                      handlePropertyStatusUpdate(apartment.apartmentId, value);
                    }}
                    buttonClassName={`w-[90px] min-w-[90px] ${dropdownBgColor}`}
                  />
                </TableCell>

                {/* 매매가 */}
                <EditablePropertyCell
                  apartmentId={apartment.apartmentId}
                  field="salePrice"
                  value={salePriceValue}
                  isSelected={isSelected}
                  type="number"
                  placeholder="17.5 -> 17.5억"
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
                  placeholder="10.3 -> 10.3억"
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
                  displayValue={ownerPhoneValue}
                  onUpdate={handlePropertyUpdate}
                />

                {/* 계약일 */}
                <TableCell>{apartment.contractDate || "-"}</TableCell>
              </TableRow>
            );
          })}
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
