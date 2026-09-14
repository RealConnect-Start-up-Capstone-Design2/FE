import { describe, expect, it, vi } from "vitest";

import {
  DEMO_STATE_CHANGED_EVENT,
  DEMO_STORAGE_KEY,
  createDemoRepository,
  type DemoStorage,
} from "./repository";
import { createDemoSeed } from "./seed";
import { DEMO_SCHEMA_VERSION, type DemoStateChange } from "./types";

class MemoryStorage implements DemoStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("demo repository", () => {
  it("works without window/localStorage and protects persisted data from mutation", () => {
    const repository = createDemoRepository({ storage: null, eventTarget: null });
    const first = repository.getState();

    expect(first.properties).toHaveLength(18);
    expect(first.inquiries).toHaveLength(8);

    first.properties[0].owner.name = "외부에서 변경";
    expect(repository.getState().properties[0].owner.name).toBe("김하늘(데모)");
  });

  it("recovers corrupt and old persisted payloads with the current seed schema", () => {
    const storage = new MemoryStorage();
    storage.setItem(DEMO_STORAGE_KEY, "{not-json");
    const repository = createDemoRepository({ storage, eventTarget: null });

    expect(repository.getState().properties).toHaveLength(18);
    const recovered = JSON.parse(storage.getItem(DEMO_STORAGE_KEY) ?? "null") as {
      schemaVersion: number;
      state: { seedId: string };
    };
    expect(recovered.schemaVersion).toBe(DEMO_SCHEMA_VERSION);
    expect(recovered.state.seedId).toBe(createDemoSeed().seedId);

    storage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 0, state: { stale: true } }),
    );
    expect(repository.getState().properties).toHaveLength(18);
    expect(
      JSON.parse(storage.getItem(DEMO_STORAGE_KEY) ?? "null").schemaVersion,
    ).toBe(DEMO_SCHEMA_VERSION);
  });

  it("creates deterministic ids, persists CRUD changes, and notifies consumers", () => {
    const repository = createDemoRepository({
      storage: null,
      eventTarget: null,
      now: () => "2026-09-14T12:00:00.000Z",
    });
    const listener = vi.fn();
    const unsubscribe = repository.subscribe(listener);
    const source = repository.getProperty("property-001");
    expect(source).not.toBeNull();

    const created = repository.upsertProperty({
      ...source!,
      id: "",
      unit: "1204호",
      owner: { name: "신규고객(데모)", phone: "010-0000-0099" },
    });

    expect(created.id).toBe("property-019");
    expect(created.updatedAt).toBe("2026-09-14T12:00:00.000Z");
    expect(repository.getProperty(created.id)?.unit).toBe("1204호");
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({ revision: 1 }),
      expect.objectContaining({
        action: "PROPERTY_UPSERTED",
        entityId: "property-019",
        revision: 1,
      }),
    );

    expect(repository.deleteProperty(created.id)).toBe(true);
    expect(repository.deleteProperty(created.id)).toBe(false);
    expect(repository.getProperty(created.id)).toBeNull();
    unsubscribe();
  });

  it("dispatches the documented same-tab custom event", () => {
    const eventTarget = new EventTarget();
    const repository = createDemoRepository({ storage: null, eventTarget });
    const received: DemoStateChange[] = [];
    eventTarget.addEventListener(DEMO_STATE_CHANGED_EVENT, (event) => {
      received.push((event as CustomEvent<DemoStateChange>).detail);
    });

    repository.reset();

    expect(received).toEqual([
      expect.objectContaining({ action: "RESET", revision: 1 }),
    ]);
  });

  it("cascades property and inquiry deletions to dependent demo records", () => {
    const repository = createDemoRepository({ storage: null, eventTarget: null });

    expect(repository.getContractByPropertyId("property-006")).not.toBeNull();
    expect(
      repository.listConsultations({
        targetType: "PROPERTY",
        targetId: "property-006",
      }),
    ).toHaveLength(1);
    repository.deleteProperty("property-006");
    expect(repository.getContractByPropertyId("property-006")).toBeNull();
    expect(
      repository.listConsultations({
        targetType: "PROPERTY",
        targetId: "property-006",
      }),
    ).toHaveLength(0);

    expect(repository.getContractByPropertyId("property-017")?.inquiryId).toBe(
      "inquiry-008",
    );
    repository.deleteInquiry("inquiry-008");
    expect(
      repository.getContractByPropertyId("property-017")?.inquiryId,
    ).toBeUndefined();
  });

  it("upserts and deletes inquiries, consultations, and contracts", () => {
    const repository = createDemoRepository({
      storage: null,
      eventTarget: null,
      now: () => "2026-09-14T13:00:00.000Z",
    });
    const inquirySource = repository.getInquiry("inquiry-001")!;
    const createdInquiry = repository.upsertInquiry({
      ...inquirySource,
      id: "",
      title: "새 문의(데모)",
    });
    expect(createdInquiry.id).toBe("inquiry-009");

    const consultationSource = repository.listConsultations()[0];
    const createdConsultation = repository.upsertConsultation({
      ...consultationSource,
      id: "",
      targetType: "INQUIRY",
      targetId: createdInquiry.id,
      content: "새 문의에 연결한 가상 상담 기록.",
    });
    expect(createdConsultation.id).toBe("consultation-013");

    const contractSource = repository.listContracts()[0];
    const createdContract = repository.upsertContract({
      ...contractSource,
      id: "",
      propertyId: "property-001",
      inquiryId: createdInquiry.id,
      status: "DRAFT",
    });
    expect(createdContract.id).toBe("contract-005");
    expect(repository.getContractByPropertyId("property-001")?.inquiryId).toBe(
      createdInquiry.id,
    );

    const updatedInquiry = repository.upsertInquiry({
      ...createdInquiry,
      status: "CONTACTED",
    });
    expect(updatedInquiry.status).toBe("CONTACTED");
    expect(repository.listInquiries().totalItems).toBe(9);

    expect(repository.deleteConsultation(createdConsultation.id)).toBe(true);
    expect(repository.deleteContract(createdContract.id)).toBe(true);
    expect(repository.deleteInquiry(createdInquiry.id)).toBe(true);
  });

  it("resets edited state back to a fresh seed while advancing revision", () => {
    const repository = createDemoRepository({ storage: null, eventTarget: null });
    repository.deleteInquiry("inquiry-001");
    expect(repository.getState().inquiries).toHaveLength(7);

    const reset = repository.reset();
    expect(reset.inquiries).toHaveLength(8);
    expect(reset.properties).toHaveLength(18);
    expect(reset.revision).toBe(2);
  });
});
