import { describe, expect, it } from "vitest";

import { createDemoSeed } from "@/demo/seed";
import {
  buildDashboardKpis,
  buildPipeline,
  buildRecentInquiries,
  buildSchedule,
} from "./dashboardViewModel";

describe("dashboard view model", () => {
  it("derives every KPI and pipeline count from the current demo state", () => {
    const state = createDemoSeed();

    expect(
      buildDashboardKpis(state).map(({ id, value }) => [id, value]),
    ).toEqual([
      ["properties", 18],
      ["inquiries", 6],
      ["visits", 2],
      ["contracts", 2],
    ]);
    expect(
      Object.fromEntries(
        buildPipeline(state).map(({ status, count }) => [status, count]),
      ),
    ).toEqual({
      NEW: 1,
      CONTACTED: 2,
      VISIT_SCHEDULED: 2,
      NEGOTIATING: 1,
      COMPLETED: 1,
      ON_HOLD: 1,
    });
  });

  it("uses only persisted contract and inquiry dates for the schedule", () => {
    const state = createDemoSeed();
    const schedule = buildSchedule(state);

    expect(schedule).toHaveLength(4);
    expect(schedule.map((item) => item.source)).toEqual([
      "CONTRACT",
      "CONTRACT",
      "INQUIRY",
      "INQUIRY",
    ]);
    expect(schedule.every((item) => item.date.length === 10)).toBe(true);
  });

  it("orders recent inquiries without mutating repository order", () => {
    const state = createDemoSeed();
    const originalFirstId = state.inquiries[0].id;

    expect(buildRecentInquiries(state, 2).map((item) => item.id)).toEqual([
      "inquiry-004",
      "inquiry-001",
    ]);
    expect(state.inquiries[0].id).toBe(originalFirstId);
  });
});
