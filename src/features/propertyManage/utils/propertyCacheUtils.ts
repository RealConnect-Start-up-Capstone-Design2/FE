import type { InfiniteData } from "@tanstack/react-query";
import type {
  ApartmentWithProperty,
  PropertiesResponse,
} from "../stores/propertyStore";
import type { PropertyMutationPayload } from "../services/propertyService";
import { propertyInfoDefaults } from "../constants/propertyConstants";

/**
 * 낙관적 업데이트에서 단일 아파트 데이터를 새 payload로 대체
 * @param apartment - 업데이트할 아파트 데이터
 * @param payload - 새로운 매물 정보
 * @returns 업데이트된 아파트 데이터
 */
export const buildUpdatedApartment = (
  apartment: ApartmentWithProperty,
  payload: PropertyMutationPayload
): ApartmentWithProperty => {
  return {
    ...apartment,
    property: {
      ...propertyInfoDefaults,
      ...(apartment.property ?? {}),
      ...payload,
      contractDate: payload.contractDate ?? "",
    },
  };
};

/**
 * 페이지/목록 단위에서 특정 apartmentId를 찾아 갱신
 * @param apartments - 아파트 목록
 * @param payload - 업데이트할 매물 정보
 * @returns 변경 여부와 업데이트된 목록
 */
export const updateApartmentList = (
  apartments: ApartmentWithProperty[],
  payload: PropertyMutationPayload
): { changed: boolean; content: ApartmentWithProperty[] } => {
  let changed = false;
  const content = apartments.map((apt) => {
    if (apt.apartmentId !== payload.apartmentId) {
      return apt;
    }
    changed = true;
    return buildUpdatedApartment(apt, payload);
  });

  return { changed, content };
};

/**
 * useInfiniteQuery 형태인지 판별 (pages/pageParams 존재 여부로 확인)
 * @param data - 확인할 데이터
 * @returns Infinite Query 데이터면 true
 */
export const isInfinitePropertiesData = (
  data: unknown
): data is InfiniteData<PropertiesResponse> => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const maybeInfinite = data as InfiniteData<PropertiesResponse>;
  return (
    Array.isArray(maybeInfinite.pages) &&
    Array.isArray(maybeInfinite.pageParams)
  );
};

/**
 * 단일 페이지 응답인지 판별
 * @param data - 확인할 데이터
 * @returns 단일 페이지 응답이면 true
 */
export const isPropertiesResponse = (
  data: unknown
): data is PropertiesResponse => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const maybeResponse = data as PropertiesResponse;
  return (
    Array.isArray(maybeResponse.content) &&
    typeof maybeResponse.hasNext === "boolean" &&
    Object.prototype.hasOwnProperty.call(maybeResponse, "nextCursor")
  );
};
