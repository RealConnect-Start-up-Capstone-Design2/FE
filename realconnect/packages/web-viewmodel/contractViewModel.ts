import { ContractTableRow } from "../shared-model/contractModel";
import { formatPrice, formatDate } from "../shared-utils/src/formatters.js";

export function getTransactionTypeText(contractType: string | null): string {
  switch (contractType) {
    case "BUY":
      return "매매";
    case "JEONSE":
      return "전세";
    case "MONTH_RENT":
      return "월세";
    default:
      return contractType ?? "-";
  }
}

export function getContractStatusText(status: string | null): string {
  switch (status) {
    case "ACTIVE":
      return "계약중";
    case "COMPLETED":
      return "계약완료";
    case "TERMINATED":
      return "계약파기";
    case "EXPIRED":
      return "계약만료";
    default:
      return status ?? "-";
  }
}

export function toContractViewRow(model: ContractTableRow) {
  return {
    ...model,
    contractTypeText: getTransactionTypeText(model.contractType),
    contractPriceText: formatPrice(model.contractPrice),
    contractStatusText: getContractStatusText(model.contractStatus),
    areaText: model.area ? `${model.area}m²` : "-",
    contractDateText: formatDate(model.contractDate),
    dueDateText: formatDate(model.dueDate),
    ownerNameText: model.ownerName ?? "-",
    tenantNameText: model.tenantName ?? "-",
    apartmentText: model.apartment ?? "-",
    dongText: model.dong ? `${model.dong}동` : "-",
    hoText: model.ho ? `${model.ho}호` : "-",
  };
}
