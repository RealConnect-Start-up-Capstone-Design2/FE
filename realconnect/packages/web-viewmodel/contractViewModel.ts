import { ContractTableRow } from "../shared-model/contractModel";

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

export function formatPrice(price: number | string | null): string {
  if (price === null || price === undefined || price === "" || price === 0)
    return "-";
  const numPrice = typeof price === "string" ? parseInt(price, 10) : price;
  if (isNaN(numPrice)) return "-";
  if (numPrice >= 100000000) {
    return (numPrice / 100000000).toFixed(1) + "억";
  } else {
    return numPrice.toLocaleString() + "만원";
  }
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "-";
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
