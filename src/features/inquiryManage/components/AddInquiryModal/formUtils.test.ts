import { describe, expect, it } from "vitest";

import type { AddInquiryFormData } from "./types";
import {
  convertAreaValue,
  formatNumericInput,
  getInquiryFormValidationError,
  normalizeDecimalInput,
  normalizeNumericInput,
} from "./formUtils";

const validForm: AddInquiryFormData = {
  requestType: "SALE",
  propertyType: "APARTMENT",
  inquirer1Name: "김고객",
  inquirer1Phone: "010-0000-0000",
  inquirer1Relation: "SELF",
  inquirer2Name: "",
  inquirer2Phone: "",
  inquirer2Relation: "",
  sido: "샘플시",
  sigungu: "샘플구",
  eupmyeondong: "샘플동",
  complexName: "샘플 아파트",
  moveInBy: "2026-12-01",
  inquirerAddress: "",
  area1: "59",
  area2: "84",
  isAreaInPyeong: false,
  purchasePrice1: "80000",
  purchasePrice2: "100000",
  deposit1: "",
  deposit2: "",
  monthlyRent1: "",
  monthlyRent2: "",
  title: "아파트 매수 문의",
  publicDescription: "",
  privateNote: "",
};

describe("inquiry modal form utilities", () => {
  it("keeps only digits in stored numeric values", () => {
    expect(normalizeNumericInput(" 12,345만원 ")).toBe("12345");
  });

  it("formats stored digits with thousands separators", () => {
    expect(formatNumericInput("1234567")).toBe("1,234,567");
  });

  it("keeps one decimal point and at most two decimal places for area", () => {
    expect(normalizeDecimalInput("84.9")).toBe("84.9");
    expect(normalizeDecimalInput(" 1,234.567㎡ ")).toBe("1234.56");
    expect(formatNumericInput("1234.56")).toBe("1,234.56");
  });

  it("converts pyeong and square meters instead of relabeling values", () => {
    expect(convertAreaValue("25.41", true)).toBe("84");
    expect(convertAreaValue("84", false)).toBe("25.41");
    expect(convertAreaValue("", true)).toBe("");
  });

  it.each([
    ["inquirer1Name", " ", "문의자1 이름을 입력해주세요."],
    ["inquirer1Phone", "", "문의자1 연락처를 입력해주세요."],
  ] as const)("requires %s", (field, value, message) => {
    expect(
      getInquiryFormValidationError({ ...validForm, [field]: value }),
    ).toBe(message);
  });

  it("accepts a complete inquiry form", () => {
    expect(getInquiryFormValidationError(validForm)).toBeNull();
  });
});
