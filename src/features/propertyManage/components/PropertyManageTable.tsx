import { useQuery } from "@tanstack/react-query";
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
} from "../stores/propertyStore";
import { usePropertyEdit } from "../hooks/usePropertyEdit";
import {
  EditablePropertyCell,
  EditableDepositMonthCell,
} from "./EditablePropertyCell";

// 이미지 불러오기
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";

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
}

export function PropertyManageTable({
  onPropertyClick,
  selectedApartmentId,
}: PropertyManageTableProps) {
  // React Query로 아파트 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ["apartments"],
    queryFn: async () => {
      // TODO: 추후 API 연동 시 fetchProperties({ apartmentComplexId: 1 })로 변경
      // return await fetchProperties({ apartmentComplexId: 1 });
      return getApartments();
    },
  });

  const apartments = data?.content || [];

  // 편집 관련 로직
  const { handleToggleFavorite, handlePropertyUpdate } = usePropertyEdit();

  if (isLoading) {
    return (
      <section className="w-full rounded-lg border border-[#DDE2F2] bg-white shadow-sm p-8 text-center">
        <p className="text-gray-500">매물 목록을 불러오는 중...</p>
      </section>
    );
  }

  return (
    <div className="h-full rounded-lg border border-[#DDE2F2] bg-white shadow-sm overflow-auto">
      <Table className="min-w-[1100px] whitespace-nowrap">
        <TableHeader className="sticky top-0 z-40 border border-[#DDE2F2] bg-[#E8EDFF]">
          <TableRow>
            <TableHead className="w-16 px-2">즐겨찾기</TableHead>
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
                {/* 즐겨찾기 */}
                <TableCell className="w-16 px-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(
                        apartment.apartmentId,
                        apartment.isFavorite || false
                      );
                    }}
                    className={`inline-flex h-full w-full items-center justify-center transition-colors ${
                      apartment.isFavorite
                        ? "text-yellow-500"
                        : "text-muted-foreground hover:text-yellow-500"
                    }`}
                  >
                    {apartment.isFavorite ? (
                      <img src={FilledStar} alt="filled-star" />
                    ) : (
                      <img src={UnfilledStar} alt="unfilled-star" />
                    )}
                  </button>
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
    </div>
  );
}
