import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { DropdownMenuCell } from "@/components/ui";

// 이미지 불러오기
import UnfilledStar from "@/assets/UnfilledStar.svg";
import FilledStar from "@/assets/FilledStar.svg";

// 더미 데이터 타입 정의
interface Property {
  id: number;
  building: string;
  unit: string;
  area: string;
  isFavorite: boolean;
  type: string;
  status: string;
  sellPrice: number;
  rentPrice: number;
  depositPrice: number;
  monthlyRent: number;
  contact: string;
  contractDate: string;
}

// 더미 데이터 배열
const dummyProperties: Property[] = [
  {
    id: 1,
    building: "101동",
    unit: "101호",
    area: "84㎡",
    isFavorite: false,
    type: "월세",
    status: "거래 전",
    sellPrice: 10000000,
    rentPrice: 10000000,
    depositPrice: 1000,
    monthlyRent: 100,
    contact: "010-1234-5678",
    contractDate: "2025.01.01",
  },
  {
    id: 2,
    building: "102동",
    unit: "201호",
    area: "59㎡",
    isFavorite: false,
    type: "월세",
    status: "거래 전",
    sellPrice: 10000000,
    rentPrice: 10000000,
    depositPrice: 2000,
    monthlyRent: 1000,
    contact: "010-1234-5678",
    contractDate: "2025.01.01",
  },
  {
    id: 3,
    building: "103동",
    unit: "301호",
    area: "72㎡",
    isFavorite: false,
    type: "월세",
    status: "거래 전",
    sellPrice: 10000000,
    rentPrice: 10000000,
    depositPrice: 1000,
    monthlyRent: 50,
    contact: "010-1234-5678",
    contractDate: "2025.01.01",
  },
];

const typeOptions = [
  { label: "월세", value: "월세" },
  { label: "매매", value: "매매" },
  { label: "전세", value: "전세" },
];

const statusOptions = [
  { label: "거래 전", value: "거래 전" },
  { label: "거래 중", value: "거래 중" },
  { label: "광고 중", value: "광고 중" },
  { label: "거래 완료", value: "거래 완료" },
  { label: "보류", value: "보류" },
  { label: "없음", value: "없음" },
];

interface PropertyManageTableProps {
  onPropertyClick?: (propertyId: string | number) => void;
}

export function PropertyManageTable({
  onPropertyClick,
}: PropertyManageTableProps) {
  // 상태 관리 - 즐겨찾기 토글을 위한 상태
  const [properties, setProperties] = useState<Property[]>(dummyProperties);

  // 즐겨찾기 토글 함수
  const toggleFavorite = (id: number) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id
          ? { ...property, isFavorite: !property.isFavorite }
          : property
      )
    );
  };

  return (
    <section className="w-full rounded-lg border border-[#DDE2F2] bg-white shadow-sm">
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
          {properties.map((property) => (
            <TableRow
              key={property.id}
              className="cursor-pointer transition-colors hover:bg-gray-50"
              onClick={() => onPropertyClick?.(property.id)}
            >
              <TableCell className="w-16 px-2 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                  className={`inline-flex h-full w-full items-center justify-center transition-colors ${
                    property.isFavorite
                      ? "text-yellow-500"
                      : "text-muted-foreground hover:text-yellow-500"
                  }`}
                >
                  {property.isFavorite ? (
                    <img src={FilledStar} alt="filled-star" />
                  ) : (
                    <img src={UnfilledStar} alt="unfilled-star" />
                  )}
                </button>
              </TableCell>
              <TableCell>{property.building}</TableCell>
              <TableCell>{property.unit}</TableCell>
              <TableCell>{property.area}</TableCell>
              <TableCell>
                <DropdownMenuCell
                  options={typeOptions}
                  value={property.type}
                  onChange={() => {}}
                />
              </TableCell>
              <TableCell>
                <DropdownMenuCell
                  options={statusOptions}
                  value={property.status}
                  onChange={() => {}}
                />
              </TableCell>
              <TableCell>{property.sellPrice}</TableCell>
              <TableCell>{property.rentPrice}</TableCell>
              <TableCell>
                {property.depositPrice} / {property.monthlyRent}
              </TableCell>
              <TableCell>{property.contact}</TableCell>
              <TableCell>{property.contractDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
