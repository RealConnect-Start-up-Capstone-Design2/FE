import { pyeongToSqm, sqmToPyeong } from "@/shared/utils";

import type { AddInquiryFormData } from "./types";

const NON_DIGIT_PATTERN = /[^0-9]/g;
const THOUSANDS_PATTERN = /\B(?=(\d{3})+(?!\d))/g;

export function normalizeNumericInput(value: string): string {
  return value.replace(NON_DIGIT_PATTERN, "");
}

export function normalizeDecimalInput(value: string): string {
  const [integerPart = "", ...fractionParts] = value
    .replace(/,/g, "")
    .split(".");
  const integer = normalizeNumericInput(integerPart);

  if (fractionParts.length === 0) return integer;

  const fraction = normalizeNumericInput(fractionParts.join("")).slice(0, 2);
  return `${integer || "0"}.${fraction}`;
}

export function formatNumericInput(value: string): string {
  const [integerPart = "", fractionPart] = value.split(".");
  const integer = normalizeNumericInput(integerPart).replace(
    THOUSANDS_PATTERN,
    ",",
  );

  return fractionPart === undefined
    ? integer
    : `${integer}.${normalizeNumericInput(fractionPart)}`;
}

export function convertAreaValue(value: string, fromPyeong: boolean): string {
  if (!value.trim()) return "";

  const numericValue = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(numericValue)) return "";

  const converted = fromPyeong
    ? pyeongToSqm(numericValue)
    : sqmToPyeong(numericValue);

  return converted
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
}

export function getInquiryFormValidationError(
  formData: AddInquiryFormData,
): string | null {
  if (!formData.requestType) return "유형을 선택해주세요.";
  if (!formData.inquirer1Name.trim()) return "문의자1 이름을 입력해주세요.";
  if (!formData.inquirer1Phone.trim()) return "문의자1 연락처를 입력해주세요.";
  if (!formData.title.trim()) return "문의 제목을 입력해주세요.";
  if (formData.title.length > 40)
    return "문의 제목은 40자 이하로 입력해주세요.";

  return null;
}
