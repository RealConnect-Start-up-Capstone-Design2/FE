import { ContractTableRow } from "../shared-model/contractModel";
import {
  getTransactionTypeText,
  getContractStatusText,
  formatPrice,
  formatDate,
  formatArea,
  formatDongHo,
  formatPhoneNumber,
} from "../shared-utils";

/**
 * ContractTableRow를 웹 UI에서 표시할 수 있는 형태로 변환
 * 새로운 Utils 함수들을 활용하여 비즈니스 로직과 포맷팅 적용
 */
export function toContractViewRow(model: ContractTableRow) {
  const { dongText, hoText } = formatDongHo(model.dong, model.ho);

  return {
    ...model,
    // 비즈니스 로직 적용 (Utils 사용)
    contractTypeText: getTransactionTypeText(model.contractType),
    contractStatusText: getContractStatusText(model.contractStatus),

    // 포맷팅 적용
    contractPriceText: formatPrice(model.contractPrice),
    contractDateText: formatDate(model.contractDate),
    dueDateText: formatDate(model.dueDate),

    // UI 표시 포맷팅
    areaText: formatArea(model.area),
    dongText,
    hoText,
    ownerPhoneText: formatPhoneNumber(model.ownerPhone),
    tenantPhoneText: formatPhoneNumber(model.tenantPhone),

    // 기본 null 처리
    ownerNameText: model.ownerName ?? "-",
    tenantNameText: model.tenantName ?? "-",
    apartmentText: model.apartment ?? "-",
  };
}
