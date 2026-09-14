import { beforeEach, describe, expect, it } from "vitest";

import { resetDemoState } from "@/demo/repository";
import type { CreateInquiryPayload } from "../types/inquiry";
import {
  createInquiry,
  deleteInquiry,
  fetchInquiries,
  fetchInquiryDetail,
  updateInquiryManageType,
  updateInquiryStatus,
} from "./inquiryService";

const validInquiryPayload: CreateInquiryPayload = {
  requestType: "SALE",
  propertyType: "APARTMENT",
  inquirerInfo: [
    {
      inquirerName: "테스트고객(데모)",
      inquirerRelation: "본인",
      contractPhone: "010-0000-9999",
    },
  ],
  inquirerAddress: "서울특별시 샘플구",
  sido: "서울특별시",
  sigungu: "샘플구",
  dong: "샘플동",
  complexName: "한빛샘플아파트",
  minArea: 59,
  maxArea: 85,
  minSalePrice: 80_000,
  maxSalePrice: 120_000,
  minDeposit: 0,
  maxDeposit: 0,
  minMonthlyPrice: 0,
  maxMonthlyPrice: 0,
  moveInBy: "2027-01-15",
  title: "테스트 매수 문의",
  publicDescription: "테스트",
  privateNote: "테스트",
};

describe("demo inquiry service adapter", () => {
  beforeEach(() => {
    resetDemoState();
  });

  it("returns ranked matches in descending score order", async () => {
    const detail = await fetchInquiryDetail(1);

    expect(detail.inquiry.id).toBe("inquiry-001");
    expect(detail.matches.length).toBeGreaterThan(0);
    expect(detail.matches.map((match) => match.score)).toEqual(
      [...detail.matches.map((match) => match.score)].sort((a, b) => b - a),
    );
    expect(detail.matches[0]?.reasons).toHaveLength(4);
  });

  it("persists create, status, priority, and delete operations", async () => {
    const created = await createInquiry(validInquiryPayload);

    expect((await fetchInquiryDetail(created.data)).inquiry.moveInBy).toBe(
      "2027-01-15",
    );

    await updateInquiryStatus(created.data, "CONTACTED");
    await updateInquiryManageType(created.data, "ATTENTION");

    const filtered = await fetchInquiries({
      keyword: "테스트 매수",
      inquiryStatus: "CONTACTED",
      manageType: "ATTENTION",
    });
    expect(filtered.totalElements).toBe(1);
    expect(filtered.content[0]).toMatchObject({
      inquiryId: created.data,
      inquiryStatus: "CONTACTED",
      manageType: "ATTENTION",
    });

    await deleteInquiry(created.data);
    expect(
      (await fetchInquiries({ keyword: "테스트 매수" })).totalElements,
    ).toBe(0);
  });

  it("rejects invalid demo input without resetting existing data", async () => {
    await expect(
      createInquiry({ ...validInquiryPayload, minArea: Number.NaN }),
    ).rejects.toThrow("유효한 숫자");
    await expect(
      createInquiry({ ...validInquiryPayload, inquirerInfo: [] }),
    ).rejects.toThrow("이름과 연락처");
    await expect(
      createInquiry({ ...validInquiryPayload, propertyType: "OFFICETEL" }),
    ).rejects.toThrow("아파트 문의만");

    expect((await fetchInquiries()).totalElements).toBe(8);
  });
});
