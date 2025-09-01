import { InquiryTableRow } from "../shared-model/InquiryModel";
import {
  getTransactionTypeText,
  getInquiryStatusText,
  formatPrice,
  formatDate,
  formatArea,
  formatPhoneNumber,
} from "../shared-utils";

/**
 * InquiryTableRow를 웹 UI에서 표시할 수 있는 형태로 변환
 * 새로운 Utils 함수들을 활용하여 비즈니스 로직과 포맷팅 적용
 */
export function toInquiryViewRow(model: InquiryTableRow) {
  return {
    ...model,
    // 새로운 Utils 함수 사용
    inquiryTypeText: getTransactionTypeText(model.inquiryType),
    statusText: getInquiryStatusText(model.status),

    // 포맷팅 함수 사용
    salePriceText: formatPrice(model.salePrice),
    jeonsePriceText: formatPrice(model.jeonsePrice),
    depositText: formatPrice(model.deposit),
    monthPriceText: formatPrice(model.monthPrice),
    createdAtText: formatDate(model.createdAt),

    // 새로운 display 포맷터 사용
    areaText: formatArea(model.area),
    phoneText: formatPhoneNumber(model.phone),

    // 기본 null 처리
    nameText: model.name ?? "-",
    apartmentNameText: model.apartmentName ?? "-",
    memoText: model.memo ?? "-",
  };
}
