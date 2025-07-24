import { InquiryEntity } from "../shared-entity/InquiryEntity";

export interface InquiryTableRow {
  id: number;
  name: string | null;
  phone: string | null;
  inquiryType: string | null;
  apartmentName: string | null;
  area: string | null;
  salePrice: number | null;
  jeonsePrice: number | null;
  deposit: number | null;
  monthPrice: number | null;
  memo: string | null;
  status: string | null;
  createdAt: string | null;
  favorite: boolean;
}

export function toInquiryTableRow(entity: InquiryEntity): InquiryTableRow {
  return {
    id: entity.id,
    name: entity.name,
    phone: entity.phone,
    inquiryType: entity.inquiryType,
    apartmentName: entity.apartmentName,
    area: entity.area,
    salePrice: entity.salePrice,
    jeonsePrice: entity.jeonsePrice,
    deposit: entity.deposit,
    monthPrice: entity.monthPrice,
    memo: entity.memo,
    status: entity.status,
    createdAt: entity.createdAt,
    favorite: entity.favorite,
  };
}
