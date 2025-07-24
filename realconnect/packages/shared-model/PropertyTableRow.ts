import { PropertyEntity } from "../shared-entity/PropertyEntity";

export interface PropertyTableRow {
  apartmentId: number;
  apartmentName: string;
  dong: string;
  ho: string;
  area: string;
  property: PropertyEntity["property"];
  type: string | null;
  direction: string | null;
  img: string | null;
  transactionType: string;
  status: string;
  salePrice: number | null;
  jeonsePrice: number | null;
  deposit: number | null;
  monthPrice: number | null;
  ownerName: string;
  ownerPhone: string;
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

export function toPropertyTableRow(entity: PropertyEntity): PropertyTableRow {
  return {
    apartmentId: entity.apartmentId,
    apartmentName: entity.apartmentName,
    dong: `${entity.dong}동`,
    ho: `${entity.ho}호`,
    area: entity.area ? `${entity.area} m²` : "-",
    property: entity.property,
    type: entity.type,
    direction: entity.direction,
    img: entity.img,
    transactionType: getTransactionType(entity.property),
    status: getStatusText(entity.property?.status),
    // 빨간 줄이 나오는 이유 : TS 문법 오류(number지만 문자열로 null값 처리 중임)
    salePrice: entity.property?.salePrice ?? "-",
    jeonsePrice: entity.property?.jeonsePrice ?? "-",
    deposit: entity.property?.deposit ?? "-",
    monthPrice: entity.property?.monthPrice ?? "-",
    ownerName: entity.property?.ownerName ?? "-",
    ownerPhone: entity.property?.ownerPhone ?? "-",
  };
}
