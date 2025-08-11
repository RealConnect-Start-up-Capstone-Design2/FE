import { InquiryTableRow } from "../shared-model/InquiryModel";
import {
  toDisplayInquiryType,
  toDisplayStatus,
} from "../shared-utils/src/labelMaps.js";
import { formatPrice, formatDate } from "../shared-utils/src/formatters.js";

// 예시: UI에서 사용할 포맷팅된 row를 만드는 함수
export function toInquiryViewRow(model: InquiryTableRow) {
  return {
    ...model,
    inquiryTypeText: toDisplayInquiryType(model.inquiryType),
    statusText: toDisplayStatus(model.status),
    salePriceText: formatPrice(model.salePrice),
    jeonsePriceText: formatPrice(model.jeonsePrice),
    depositText: formatPrice(model.deposit),
    monthPriceText: formatPrice(model.monthPrice),
    createdAtText: formatDate(model.createdAt),
    areaText: model.area ? `${model.area} m²` : "-",
    nameText: model.name ?? "-",
    phoneText: model.phone ?? "-",
    apartmentNameText: model.apartmentName ?? "-",
    memoText: model.memo ?? "-",
  };
}
