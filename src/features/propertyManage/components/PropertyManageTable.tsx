import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
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
  type RequestType,
  type PropertyStatus,
  type ApartmentWithProperty,
} from "../stores/propertyStore";
import { usePropertyEdit } from "../hooks/usePropertyEdit";
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
  { label: "자가", value: "SELF" },
  { label: "매매", value: "SALE" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY" },
  { label: "전+월", value: "JM" },
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
  const apartments = externalApartments || data?.content || [];
  const isLoading = externalIsLoading ?? internalIsLoading;

  // 편집 관련 로직
  const { handlePropertyUpdate } = usePropertyEdit();

  // 무한스크롤을 위한 스크롤 감지
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container || !hasNextPage || !onLoadMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onLoadMore();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, onLoadMore]);

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
      className="h-full rounded-lg border border-[#DDE2F2] bg-white shadow-sm overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <Table className="min-w-[1100px] whitespace-nowrap">
        <TableHeader className="sticky top-0 z-40 border border-[#DDE2F2] bg-[#E8EDFF]">
          <TableRow>
            <TableHead className="w-24 px-2">관리</TableHead>
            <TableHead>동</TableHead>
            <TableHead>호수</TableHead>
            <TableHead>면적</TableHead>
            <TableHead>의뢰 유형</TableHead>
            <TableHead>매물 상태</TableHead>
            <TableHead>매매</TableHead>
            <TableHead>전세</TableHead>
            <TableHead>보증금/월세</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>계약일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apartments.map((apartment) => {
            const isSelected = selectedApartmentId === apartment.apartmentId;
            const property = apartment.property;

            return (
              <TableRow
                key={apartment.apartmentId}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  isSelected ? "bg-blue-50" : ""
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
                      value={property?.manageType || "NONE"}
                      onChange={(value) => {
                        handlePropertyUpdate(
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
                <TableCell>{apartment.area}㎡</TableCell>

                {/* 의뢰 유형 */}
                <TableCell>
                  {property || isSelected ? (
                    <DropdownMenuCell
                      options={requestTypeOptions}
                      value={property?.requestType || "NONE"}
                      onChange={(value) =>
                        handlePropertyUpdate(
                          apartment.apartmentId,
                          "requestType",
                          value
                        )
                      }
                    />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>

                {/* 매물 상태 */}
                <TableCell>
                  {property || isSelected ? (
                    <DropdownMenuCell
                      options={propertyStatusOptions}
                      value={property?.propertyStatus || "NONE"}
                      onChange={(value) =>
                        handlePropertyUpdate(
                          apartment.apartmentId,
                          "propertyStatus",
                          value
                        )
                      }
                    />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>

                {/* 매매가 */}
                <EditablePropertyCell
                  apartmentId={apartment.apartmentId}
                  field="salePrice"
                  value={property?.salePrice}
                  isSelected={isSelected}
                  type="number"
                  placeholder="매매가 (원)"
                  displayValue={
                    property?.salePrice
                      ? `${(property.salePrice / 10000).toLocaleString()}만`
                      : undefined
                  }
                  onUpdate={handlePropertyUpdate}
                />

                {/* 전세가 */}
                <EditablePropertyCell
                  apartmentId={apartment.apartmentId}
                  field="jeonsePrice"
                  value={property?.jeonsePrice}
                  isSelected={isSelected}
                  type="number"
                  placeholder="전세가 (원)"
                  displayValue={
                    property?.jeonsePrice
                      ? `${(property.jeonsePrice / 10000).toLocaleString()}만`
                      : undefined
                  }
                  onUpdate={handlePropertyUpdate}
                />

                {/* 보증금/월세 */}
                <EditableDepositMonthCell
                  apartmentId={apartment.apartmentId}
                  depositValue={property?.deposit}
                  monthValue={property?.monthPrice}
                  isSelected={isSelected}
                  onUpdate={handlePropertyUpdate}
                />

                {/* 연락처 */}
                <EditablePropertyCell
                  apartmentId={apartment.apartmentId}
                  field="ownerPhone"
                  value={property?.ownerPhone}
                  isSelected={isSelected}
                  type="tel"
                  placeholder="연락처"
                  displayValue={property?.ownerPhone}
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
