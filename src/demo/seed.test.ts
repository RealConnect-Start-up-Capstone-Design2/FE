import { describe, expect, it } from "vitest";

import { createDemoSeed } from "./seed";

describe("demo seed", () => {
  it("contains the documented fictional CRM dataset", () => {
    const state = createDemoSeed();

    expect(state.complexes).toHaveLength(2);
    expect(state.properties).toHaveLength(18);
    expect(state.inquiries).toHaveLength(8);
    expect(state.consultations).toHaveLength(12);
    expect(state.contracts).toHaveLength(4);
    expect(state.office.address).toContain("샘플구");
    expect(
      state.properties.every((item) => item.owner.phone.includes("-0000-")),
    ).toBe(true);
    expect(
      state.inquiries.every((item) => item.customer.name.includes("(데모)")),
    ).toBe(true);
  });

  it("returns a fresh deep copy on every call", () => {
    const first = createDemoSeed();
    const second = createDemoSeed();

    first.properties[0].owner.name = "변경됨";
    first.complexes[0].name = "변경됨";

    expect(second.properties[0].owner.name).toBe("김하늘(데모)");
    expect(second.complexes[0].name).toBe("한빛샘플아파트");
  });
});
