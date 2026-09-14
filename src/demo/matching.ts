import type {
  DemoComplex,
  DemoInquiry,
  DemoMatchReason,
  DemoMatchResult,
  DemoProperty,
  DemoRange,
  DemoRankMatchesOptions,
} from "./types";

const REQUEST_TYPE_WEIGHT = 35;
const LOCATION_WEIGHT = 25;
const AREA_WEIGHT = 20;
const PRICE_WEIGHT = 20;
const RECOMMENDED_SCORE = 75;
const NEAR_RANGE_RATIO = 0.1;

export function scoreInquiryProperty(
  inquiry: DemoInquiry,
  property: DemoProperty,
  complex?: DemoComplex | null,
): DemoMatchResult {
  const requestType = scoreRequestType(inquiry, property);
  const location = scoreLocation(inquiry, property, complex);
  const area = scoreArea(inquiry, property);
  const price = scorePrice(inquiry, property);
  const reasons = [requestType, location, area, price];
  const score = reasons.reduce((sum, reason) => sum + reason.score, 0);

  return {
    inquiryId: inquiry.id,
    propertyId: property.id,
    score,
    maxScore: 100,
    isRecommended:
      score >= RECOMMENDED_SCORE && requestType.score === REQUEST_TYPE_WEIGHT,
    reasons,
  };
}

export function rankPropertyMatches(
  inquiry: DemoInquiry,
  properties: DemoProperty[],
  complexes: DemoComplex[] = [],
  options: DemoRankMatchesOptions = {},
): DemoMatchResult[] {
  const complexesById = new Map(
    complexes.map((complex) => [complex.id, complex]),
  );
  const minimumScore = Math.max(0, Math.min(100, options.minimumScore ?? 0));
  const limit = Math.max(0, Math.trunc(options.limit ?? properties.length));

  return properties
    .map((property) =>
      scoreInquiryProperty(
        inquiry,
        property,
        complexesById.get(property.complexId),
      ),
    )
    .filter((result) => result.score >= minimumScore)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.propertyId.localeCompare(right.propertyId),
    )
    .slice(0, limit);
}

function scoreRequestType(
  inquiry: DemoInquiry,
  property: DemoProperty,
): DemoMatchReason {
  const matches = inquiry.transactionType === property.transactionType;
  return {
    criterion: "REQUEST_TYPE",
    code: matches ? "REQUEST_TYPE_EXACT" : "REQUEST_TYPE_MISMATCH",
    score: matches ? REQUEST_TYPE_WEIGHT : 0,
    maxScore: REQUEST_TYPE_WEIGHT,
    message: matches
      ? `${transactionLabel(inquiry.transactionType)} 의뢰와 거래 유형이 일치합니다.`
      : `${transactionLabel(inquiry.transactionType)} 의뢰와 매물 거래 유형이 다릅니다.`,
  };
}

function scoreLocation(
  inquiry: DemoInquiry,
  property: DemoProperty,
  complex?: DemoComplex | null,
): DemoMatchReason {
  const hasNoPreference =
    inquiry.desiredComplexIds.length === 0 &&
    inquiry.desiredDongs.length === 0 &&
    inquiry.desiredDistricts.length === 0;
  if (hasNoPreference) {
    return reason(
      "LOCATION",
      "LOCATION_UNRESTRICTED",
      LOCATION_WEIGHT,
      LOCATION_WEIGHT,
      "희망 지역 제한이 없어 위치 조건을 충족합니다.",
    );
  }

  if (inquiry.desiredComplexIds.includes(property.complexId)) {
    return reason(
      "LOCATION",
      "LOCATION_COMPLEX_EXACT",
      LOCATION_WEIGHT,
      LOCATION_WEIGHT,
      "희망 단지와 정확히 일치합니다.",
    );
  }

  if (complex && inquiry.desiredDongs.includes(complex.legalDong)) {
    return reason(
      "LOCATION",
      "LOCATION_DONG_MATCH",
      20,
      LOCATION_WEIGHT,
      `희망 법정동(${complex.legalDong})과 일치합니다.`,
    );
  }

  if (complex && inquiry.desiredDistricts.includes(complex.district)) {
    return reason(
      "LOCATION",
      "LOCATION_DISTRICT_MATCH",
      12,
      LOCATION_WEIGHT,
      `희망 자치구(${complex.district}) 범위에 있습니다.`,
    );
  }

  return reason(
    "LOCATION",
    complex ? "LOCATION_MISMATCH" : "LOCATION_UNKNOWN",
    0,
    LOCATION_WEIGHT,
    complex
      ? "희망 지역과 일치하지 않습니다."
      : "단지 위치 정보가 없어 지역 조건을 확인할 수 없습니다.",
  );
}

function scoreArea(
  inquiry: DemoInquiry,
  property: DemoProperty,
): DemoMatchReason {
  const score = scoreRange(property.exclusiveArea, inquiry.area, AREA_WEIGHT);
  const area = formatNumber(property.exclusiveArea);
  if (score === AREA_WEIGHT) {
    return reason(
      "AREA",
      "AREA_IN_RANGE",
      score,
      AREA_WEIGHT,
      `전용면적 ${area}㎡가 희망 범위 안에 있습니다.`,
    );
  }
  if (score > 0) {
    return reason(
      "AREA",
      "AREA_NEAR_RANGE",
      score,
      AREA_WEIGHT,
      `전용면적 ${area}㎡가 희망 범위에서 10% 이내로 벗어납니다.`,
    );
  }
  return reason(
    "AREA",
    "AREA_OUT_OF_RANGE",
    0,
    AREA_WEIGHT,
    `전용면적 ${area}㎡가 희망 범위를 벗어납니다.`,
  );
}

function scorePrice(
  inquiry: DemoInquiry,
  property: DemoProperty,
): DemoMatchReason {
  if (inquiry.transactionType !== property.transactionType) {
    return reason(
      "PRICE",
      "PRICE_NOT_COMPARABLE",
      0,
      PRICE_WEIGHT,
      "거래 유형이 달라 가격 조건을 비교할 수 없습니다.",
    );
  }

  if (inquiry.transactionType === "MONTHLY") {
    const depositScore = scoreOptionalRange(
      property.price.monthlyDeposit,
      inquiry.budget.monthlyDeposit,
      PRICE_WEIGHT / 2,
    );
    const rentScore = scoreOptionalRange(
      property.price.monthlyRent,
      inquiry.budget.monthlyRent,
      PRICE_WEIGHT / 2,
    );
    const score = depositScore + rentScore;
    return reason(
      "PRICE",
      priceCode(score),
      score,
      PRICE_WEIGHT,
      `보증금 ${formatMoney(property.price.monthlyDeposit)}, 월세 ${formatMoney(property.price.monthlyRent)} 조건을 비교했습니다.`,
    );
  }

  const range =
    inquiry.transactionType === "SALE"
      ? inquiry.budget.sale
      : inquiry.budget.jeonse;
  const value =
    inquiry.transactionType === "SALE"
      ? property.price.sale
      : property.price.jeonse;
  const score = scoreOptionalRange(value, range, PRICE_WEIGHT);
  return reason(
    "PRICE",
    priceCode(score),
    score,
    PRICE_WEIGHT,
    `${transactionLabel(inquiry.transactionType)} 가격 ${formatMoney(value)} 조건을 비교했습니다.`,
  );
}

function scoreOptionalRange(
  value: number,
  range: DemoRange | null,
  maxScore: number,
): number {
  return range ? scoreRange(value, range, maxScore) : maxScore;
}

function scoreRange(value: number, range: DemoRange, maxScore: number): number {
  if (value >= range.min && value <= range.max) return maxScore;

  const reference = value < range.min ? range.min : range.max;
  const gap = Math.abs(value - reference);
  const denominator = Math.max(Math.abs(reference), 1);
  return gap / denominator <= NEAR_RANGE_RATIO ? maxScore / 2 : 0;
}

function priceCode(score: number): string {
  if (score === PRICE_WEIGHT) return "PRICE_IN_RANGE";
  if (score > 0) return "PRICE_PARTIAL_OR_NEAR";
  return "PRICE_OUT_OF_RANGE";
}

function reason(
  criterion: DemoMatchReason["criterion"],
  code: string,
  score: number,
  maxScore: number,
  message: string,
): DemoMatchReason {
  return { criterion, code, score, maxScore, message };
}

function transactionLabel(
  transactionType: DemoInquiry["transactionType"],
): string {
  if (transactionType === "SALE") return "매매";
  if (transactionType === "JEONSE") return "전세";
  return "월세";
}

function formatMoney(value: number): string {
  return `${new Intl.NumberFormat("ko-KR").format(value)}만원`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 2,
  }).format(value);
}
