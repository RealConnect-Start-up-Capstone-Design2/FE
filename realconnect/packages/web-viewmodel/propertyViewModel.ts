import { PropertyTableRow, PropertyDetailModel } from "../shared-model";
import {
  determineTransactionType,
  getPropertyStatusText,
  formatPrice,
  formatArea,
  formatDongHo,
  formatPhoneNumber,
  formatMonthlyRent,
} from "../shared-utils";

/**
 * PropertyTableRow를 웹 UI 테이블에서 표시할 수 있는 형태로 변환
 * 새로운 Utils 함수들을 활용하여 비즈니스 로직과 포맷팅 적용
 */
export function toPropertyTableViewModel(model: PropertyTableRow) {
  const { dongText, hoText } = formatDongHo(model.dong, model.ho);

  return {
    ...model,
    // 비즈니스 로직 적용 (Utils 사용)
    transactionType: determineTransactionType(
      model.salePrice,
      model.jeonsePrice,
      model.deposit,
      model.monthPrice
    ),
    statusText: getPropertyStatusText(model.status),

    // 포맷팅 적용
    salePriceText: formatPrice(model.salePrice),
    jeonsePriceText: formatPrice(model.jeonsePrice),
    depositText: formatPrice(model.deposit),
    monthPriceText: formatPrice(model.monthPrice),
    monthlyRentText: formatMonthlyRent(model.deposit, model.monthPrice),

    // UI 표시 포맷팅
    areaText: formatArea(model.area),
    dongText,
    hoText,
    ownerPhoneText: formatPhoneNumber(model.ownerPhone),

    // 기본 null 처리
    ownerNameText: model.ownerName ?? "-",
    apartmentNameText: model.apartmentName ?? "-",
    typeText: model.type ?? "-",
    directionText: model.direction ?? "-",
  };
}

/**
 * PropertyDetailModel를 웹 UI 상세 화면에서 표시할 수 있는 형태로 변환
 * 새로운 Utils 함수들을 활용하여 비즈니스 로직과 포맷팅 적용
 */
export function toPropertyDetailViewModel(model: PropertyDetailModel) {
  const { dongText, hoText } = formatDongHo(model.dong, model.ho);

  return {
    ...model,
    // 비즈니스 로직 적용 (Utils 사용)
    transactionType: determineTransactionType(
      model.salePrice,
      model.jeonsePrice,
      model.deposit,
      model.monthPrice
    ),
    statusText: getPropertyStatusText(model.status),

    // 포맷팅 적용
    salePriceText: formatPrice(model.salePrice),
    jeonsePriceText: formatPrice(model.jeonsePrice),
    depositText: formatPrice(model.deposit),
    monthPriceText: formatPrice(model.monthPrice),

    // UI 표시 포맷팅
    areaText: formatArea(model.area),
    dongText,
    hoText,
    ownerPhoneText: formatPhoneNumber(model.ownerPhone),
    tenantPhoneText: formatPhoneNumber(model.tenantPhone),

    // 기본 null 처리
    ownerNameText: model.ownerName ?? "-",
    tenantNameText: model.tenantName ?? "-",
    apartmentNameText: model.apartmentName ?? "-",
    typeText: model.type ?? "-",
    directionText: model.direction ?? "-",
    memoText: model.memo ?? "-",
  };
}
