import { describe, expect, it } from "vitest";

import { createDemoSeed } from "./seed";
import {
  selectConsultations,
  selectDashboardMetrics,
  selectInquiriesPage,
  selectPropertiesPage,
} from "./selectors";

describe("demo selectors", () => {
  const state = createDemoSeed();

  it("filters searchable property data and returns one-based pages", () => {
    const favorites = selectPropertiesPage(state, {
      complexId: "complex-hanbit",
      transactionType: "SALE",
      favoriteOnly: true,
      page: 1,
      pageSize: 1,
      sortBy: "price",
      sortOrder: "asc",
    });

    expect(favorites.totalItems).toBe(2);
    expect(favorites.totalPages).toBe(2);
    expect(favorites.items[0].id).toBe("property-001");
    expect(favorites.hasNext).toBe(true);

    const byOwner = selectPropertiesPage(state, { search: "김하늘" });
    expect(byOwner.items.map((property) => property.id)).toEqual([
      "property-001",
    ]);
  });

  it("filters inquiries by overlapping area and desired complex", () => {
    const result = selectInquiriesPage(state, {
      complexId: "complex-pureunddeul",
      transactionType: "JEONSE",
      minArea: 84,
      maxArea: 85,
    });

    expect(result.items.map((inquiry) => inquiry.id)).toEqual(["inquiry-005"]);
  });

  it("sorts consultation logs newest first without mutating seed order", () => {
    const originalFirst = state.consultations[0].id;
    const logs = selectConsultations(state, {
      targetType: "INQUIRY",
      targetId: "inquiry-001",
    });

    expect(logs.map((log) => log.id)).toEqual([
      "consultation-002",
      "consultation-001",
    ]);
    expect(state.consultations[0].id).toBe(originalFirst);
  });

  it("derives dashboard metrics from current domain state", () => {
    expect(selectDashboardMetrics(state)).toEqual({
      totalProperties: 18,
      activeProperties: 14,
      favoriteProperties: 8,
      activeInquiries: 6,
      scheduledVisits: 2,
      contractsInProgress: 2,
      completedContracts: 2,
      consultationCount: 12,
    });
  });
});
