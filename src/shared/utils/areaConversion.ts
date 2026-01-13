/** 1평 = 3.3058㎡ */
const PYEONG_TO_SQM = 3.3058;

/** ㎡ → 평 변환 */
export const sqmToPyeong = (sqm: number): number => {
  return sqm / PYEONG_TO_SQM;
};

/** 평 → ㎡ 변환 */
export const pyeongToSqm = (pyeong: number): number => {
  return pyeong * PYEONG_TO_SQM;
};

/** 포맷팅된 면적 문자열 반환 */
export const formatArea = (
  value: number,
  unit: "pyeong" | "sqm" = "sqm"
): string => {
  if (unit === "pyeong") {
    return `${value.toFixed(0)}평`;
  }
  return `${value.toFixed(2)}㎡`;
};
