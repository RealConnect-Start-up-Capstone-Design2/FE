import type { InfiniteData } from "@tanstack/react-query";
import type { PropertiesResponse } from "../types";

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
