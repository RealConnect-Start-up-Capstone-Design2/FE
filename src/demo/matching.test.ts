import { describe, expect, it } from "vitest";

import { rankPropertyMatches, scoreInquiryProperty } from "./matching";
import { createDemoSeed } from "./seed";

describe("demo matching engine", () => {
  const state = createDemoSeed();
  const inquiry = state.inquiries.find((item) => item.id === "inquiry-001")!;
  const complex = state.complexes.find(
    (item) => item.id === "complex-hanbit",
  )!;

  it("awards 100 points when request type, complex, area, and price all match", () => {
    const property = state.properties.find(
      (item) => item.id === "property-001",
    )!;
    const result = scoreInquiryProperty(inquiry, property, complex);

    expect(result.score).toBe(100);
    expect(result.isRecommended).toBe(true);
    expect(result.reasons).toEqual([
      expect.objectContaining({ code: "REQUEST_TYPE_EXACT", score: 35 }),
      expect.objectContaining({ code: "LOCATION_COMPLEX_EXACT", score: 25 }),
      expect.objectContaining({ code: "AREA_IN_RANGE", score: 20 }),
      expect.objectContaining({ code: "PRICE_IN_RANGE", score: 20 }),
    ]);
  });

  it("explains an incompatible request type and does not compare its price", () => {
    const property = state.properties.find(
      (item) => item.id === "property-002",
    )!;
    const result = scoreInquiryProperty(inquiry, property, complex);

    expect(result.score).toBe(45);
    expect(result.isRecommended).toBe(false);
    expect(result.reasons[0]).toMatchObject({
      code: "REQUEST_TYPE_MISMATCH",
      score: 0,
    });
    expect(result.reasons[3]).toMatchObject({
      code: "PRICE_NOT_COMPARABLE",
      score: 0,
    });
  });

  it("scores dong-level matches and monthly deposit/rent independently", () => {
    const jeonseInquiry = state.inquiries.find(
      (item) => item.id === "inquiry-002",
    )!;
    const jeonseProperty = state.properties.find(
      (item) => item.id === "property-005",
    )!;
    const jeonseResult = scoreInquiryProperty(
      jeonseInquiry,
      jeonseProperty,
      complex,
    );
    expect(jeonseResult.score).toBe(95);
    expect(jeonseResult.reasons[1]).toMatchObject({
      code: "LOCATION_DONG_MATCH",
      score: 20,
    });

    const monthlyInquiry = state.inquiries.find(
      (item) => item.id === "inquiry-003",
    )!;
    const monthlyProperty = state.properties.find(
      (item) => item.id === "property-015",
    )!;
    const monthlyComplex = state.complexes.find(
      (item) => item.id === monthlyProperty.complexId,
    )!;
    const monthlyResult = scoreInquiryProperty(
      monthlyInquiry,
      monthlyProperty,
      monthlyComplex,
    );
    expect(monthlyResult.score).toBe(100);
    expect(monthlyResult.reasons[3]).toMatchObject({
      code: "PRICE_IN_RANGE",
      score: 20,
    });
  });

  it("penalizes area and price outside the requested ranges", () => {
    const property = state.properties.find(
      (item) => item.id === "property-004",
    )!;
    const result = scoreInquiryProperty(inquiry, property, complex);

    expect(result.score).toBe(60);
    expect(result.reasons[2]).toMatchObject({
      code: "AREA_OUT_OF_RANGE",
      score: 0,
    });
    expect(result.reasons[3]).toMatchObject({
      code: "PRICE_OUT_OF_RANGE",
      score: 0,
    });
  });

  it("ranks equal scores deterministically by property id", () => {
    const source = state.properties.find(
      (item) => item.id === "property-001",
    )!;
    const results = rankPropertyMatches(
      inquiry,
      [
        { ...source, id: "property-z" },
        { ...source, id: "property-a" },
      ],
      state.complexes,
      { minimumScore: 100 },
    );

    expect(results.map((result) => result.propertyId)).toEqual([
      "property-a",
      "property-z",
    ]);
  });
});
