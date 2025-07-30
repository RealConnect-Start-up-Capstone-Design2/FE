import { PropertyEntity } from "../shared-entity/PropertyEntity";

export interface PropertyDetailModel {
  // 기본 정보
  apartmentId: number;
  apartmentName: string;
  dong: string;
  ho: string;
  area: string;

  // 상세 정보 (평탄화)
  ownerName: string;
  ownerPhone: string;
  tenantName: string;
  tenantPhone: string;
  salePrice: number | string;
  jeonsePrice: number | string;
  deposit: number | string;
  monthPrice: number | string;
  status: string;
  memo: string;
  startDate: string | null;
  endDate: string | null;

  // 추가 정보
  direction: string | null;
  img: string | null;
  type: string | null;
  transactionType: string;
}

function getTransactionType(property: PropertyEntity["property"]): string {
  if (!property) return "-";
  if (property.salePrice && property.salePrice > 0) return "매매";
  if (property.jeonsePrice && property.jeonsePrice > 0) return "전세";
  if (property.deposit && property.monthPrice) return "월세";
  return "-";
}

function getStatusText(status: string | null | undefined): string {
  if (!status) return "미등록";
  switch (status) {
    case "CONTRACTED":
      return "계약 완료";
    case "RESERVED":
      return "계약 중";
    case "WAITING":
      return "계약 전";
    default:
      return status;
  }
}

export function toPropertyDetailModel(
  entity: PropertyEntity
): PropertyDetailModel {
  return {
    // 기본 정보
    apartmentId: entity.apartmentId,
    apartmentName: entity.apartmentName,
    dong: entity.dong,
    ho: entity.ho,
    area: entity.area,

    // 상세 정보 (평탄화)
    ownerName: entity.property?.ownerName ?? "-",
    ownerPhone: entity.property?.ownerPhone ?? "-",
    tenantName: entity.property?.tenantName ?? "-",
    tenantPhone: entity.property?.tenantPhone ?? "-",
    salePrice: entity.property?.salePrice ?? "-",
    jeonsePrice: entity.property?.jeonsePrice ?? "-",
    deposit: entity.property?.deposit ?? "-",
    monthPrice: entity.property?.monthPrice ?? "-",
    status: getStatusText(entity.property?.status),
    memo: entity.property?.memo ?? "",
    startDate: entity.property?.startDate ?? null,
    endDate: entity.property?.endDate ?? null,

    // 추가 정보
    direction: entity.direction,
    img: entity.img,
    type: entity.type,
    transactionType: getTransactionType(entity.property),
  };
}
