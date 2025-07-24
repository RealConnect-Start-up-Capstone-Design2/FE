import { InquiryTableRow } from "../shared-model/InquiryModel";

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined || price === 0) return "-";
  if (price >= 100000000) {
    return (price / 100000000).toFixed(1) + "억";
  } else {
    return price.toLocaleString() + "만원";
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

export function getStatusText(status: string | null): string {
  switch (status) {
    case "IN_PROGRESS":
      return "진행 중";
    case "COMPLETED":
      return "완료";
    case "CANCEL":
      return "취소";
    default:
      return status ?? "-";
  }
}

export function getInquiryTypeText(type: string | null): string {
  switch (type) {
    case "BUY":
      return "매매";
    case "JEONSE":
      return "전세";
    case "MONTH_RENT":
      return "월세";
    default:
      return type ?? "-";
  }
}

// 예시: UI에서 사용할 포맷팅된 row를 만드는 함수
export function toInquiryViewRow(model: InquiryTableRow) {
  return {
    ...model,
    inquiryTypeText: getInquiryTypeText(model.inquiryType),
    statusText: getStatusText(model.status),
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
