import { createDemoSeed } from "./seed";
import {
  selectConsultations,
  selectContractByPropertyId,
  selectInquiriesPage,
  selectPropertiesPage,
} from "./selectors";
import {
  DEMO_SCHEMA_VERSION,
  type DemoComplex,
  type DemoConsultationListQuery,
  type DemoConsultationLog,
  type DemoConsultationUpsert,
  type DemoContract,
  type DemoContractUpsert,
  type DemoInquiry,
  type DemoInquiryListQuery,
  type DemoInquiryUpsert,
  type DemoOffice,
  type DemoPage,
  type DemoProperty,
  type DemoPropertyListQuery,
  type DemoPropertyUpsert,
  type DemoState,
  type DemoStateChange,
  type DemoStateListener,
  type PersistedDemoState,
} from "./types";

export const DEMO_STORAGE_KEY = "realconnect.portfolio.demo-state";
export const DEMO_STATE_CHANGED_EVENT = "realconnect:demo-state-changed";

export interface DemoStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

export interface DemoRepositoryOptions {
  /** `undefined` auto-detects localStorage; `null` forces memory-only mode. */
  storage?: DemoStorage | null;
  /** `undefined` auto-detects window; `null` disables DOM events. */
  eventTarget?: EventTarget | null;
  now?: () => string;
}

export interface DemoRepository {
  getState(): DemoState;
  reset(): DemoState;
  subscribe(listener: DemoStateListener): () => void;
  getOffice(): DemoOffice;
  listComplexes(): DemoComplex[];
  listProperties(query?: DemoPropertyListQuery): DemoPage<DemoProperty>;
  getProperty(propertyId: string): DemoProperty | null;
  upsertProperty(input: DemoPropertyUpsert): DemoProperty;
  deleteProperty(propertyId: string): boolean;
  listInquiries(query?: DemoInquiryListQuery): DemoPage<DemoInquiry>;
  getInquiry(inquiryId: string): DemoInquiry | null;
  upsertInquiry(input: DemoInquiryUpsert): DemoInquiry;
  deleteInquiry(inquiryId: string): boolean;
  listConsultations(query?: DemoConsultationListQuery): DemoConsultationLog[];
  upsertConsultation(input: DemoConsultationUpsert): DemoConsultationLog;
  deleteConsultation(consultationId: string): boolean;
  listContracts(): DemoContract[];
  getContractByPropertyId(propertyId: string): DemoContract | null;
  upsertContract(input: DemoContractUpsert): DemoContract;
  deleteContract(contractId: string): boolean;
}

export function createDemoRepository(
  options: DemoRepositoryOptions = {},
): DemoRepository {
  let memoryValue: string | null = null;
  const listeners = new Set<DemoStateListener>();
  const now = options.now ?? (() => new Date().toISOString());

  function resolveStorage(): DemoStorage | null {
    if (options.storage !== undefined) return options.storage;
    try {
      return typeof window === "undefined" ? null : window.localStorage;
    } catch {
      return null;
    }
  }

  function resolveEventTarget(): EventTarget | null {
    if (options.eventTarget !== undefined) return options.eventTarget;
    return typeof window === "undefined" ? null : window;
  }

  function readRaw(): string | null {
    const storage = resolveStorage();
    if (storage) {
      try {
        const storedValue = storage.getItem(DEMO_STORAGE_KEY);
        if (storedValue !== null) {
          memoryValue = storedValue;
          return storedValue;
        }
      } catch {
        // Fall through to the in-memory mirror when storage access is blocked.
      }
    }
    return memoryValue;
  }

  function writeRaw(value: string): void {
    memoryValue = value;
    const storage = resolveStorage();
    if (!storage) return;
    try {
      storage.setItem(DEMO_STORAGE_KEY, value);
    } catch {
      // The in-memory mirror keeps the demo usable in restricted browsers.
    }
  }

  function persist(state: DemoState): void {
    const envelope: PersistedDemoState = {
      schemaVersion: DEMO_SCHEMA_VERSION,
      savedAt: now(),
      state: cloneDemoValue(state),
    };
    writeRaw(JSON.stringify(envelope));
  }

  function readState(): DemoState {
    const raw = readRaw();
    if (raw) {
      const restored = deserializeState(raw);
      if (restored) return cloneDemoValue(restored);
    }

    const recovered = createDemoSeed();
    persist(recovered);
    return cloneDemoValue(recovered);
  }

  function emit(state: DemoState, change: DemoStateChange): void {
    for (const listener of listeners) {
      try {
        listener(cloneDemoValue(state), { ...change });
      } catch {
        // A consumer error must not roll back an already persisted mutation.
      }
    }

    const eventTarget = resolveEventTarget();
    if (!eventTarget) return;
    const event = createChangeEvent(change);
    if (event) eventTarget.dispatchEvent(event);
  }

  function commit(
    state: DemoState,
    change: Omit<DemoStateChange, "revision">,
  ): DemoState {
    state.revision += 1;
    persist(state);
    emit(state, { ...change, revision: state.revision });
    return cloneDemoValue(state);
  }

  function mutate<T>(
    change: Omit<DemoStateChange, "revision">,
    mutation: (state: DemoState) => T,
  ): T {
    const state = readState();
    const result = mutation(state);
    const committedChange =
      change.entityId === undefined &&
      isRecord(result) &&
      typeof result.id === "string"
        ? { ...change, entityId: result.id }
        : change;
    commit(state, committedChange);
    return cloneDemoValue(result);
  }

  function subscribe(listener: DemoStateListener): () => void {
    listeners.add(listener);
    const eventTarget = resolveEventTarget();
    const onStorage = (event: Event) => {
      const storageEvent = event as StorageEvent;
      if (
        storageEvent.key !== DEMO_STORAGE_KEY ||
        storageEvent.newValue === null
      ) {
        return;
      }
      const state = deserializeState(storageEvent.newValue);
      if (!state) return;
      memoryValue = storageEvent.newValue;
      listener(cloneDemoValue(state), {
        action: "EXTERNAL_SYNC",
        revision: state.revision,
      });
    };
    eventTarget?.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      eventTarget?.removeEventListener("storage", onStorage);
    };
  }

  return {
    getState: readState,
    reset() {
      const previousRevision = readState().revision;
      const state = createDemoSeed();
      state.revision = previousRevision + 1;
      persist(state);
      emit(state, { action: "RESET", revision: state.revision });
      return cloneDemoValue(state);
    },
    subscribe,
    getOffice() {
      return cloneDemoValue(readState().office);
    },
    listComplexes() {
      return cloneDemoValue(readState().complexes);
    },
    listProperties(query = {}) {
      return cloneDemoValue(selectPropertiesPage(readState(), query));
    },
    getProperty(propertyId) {
      const property = readState().properties.find(
        (candidate) => candidate.id === propertyId,
      );
      return property ? cloneDemoValue(property) : null;
    },
    upsertProperty(input) {
      const entityId = input.id?.trim() || undefined;
      return mutate(
        { action: "PROPERTY_UPSERTED", entityId },
        (state): DemoProperty => {
          assertComplexExists(state, input.complexId);
          const id = entityId ?? nextId("property", state.properties);
          const index = state.properties.findIndex((item) => item.id === id);
          const existing = index >= 0 ? state.properties[index] : undefined;
          const timestamp = now();
          const property: DemoProperty = {
            ...cloneDemoValue(input),
            id,
            registeredAt:
              existing?.registeredAt ?? input.registeredAt ?? timestamp,
            updatedAt: timestamp,
          };
          if (index >= 0) state.properties[index] = property;
          else state.properties.push(property);
          return property;
        },
      );
    },
    deleteProperty(propertyId) {
      const state = readState();
      const index = state.properties.findIndex(
        (item) => item.id === propertyId,
      );
      if (index < 0) return false;
      state.properties.splice(index, 1);
      state.consultations = state.consultations.filter(
        (log) =>
          !(log.targetType === "PROPERTY" && log.targetId === propertyId),
      );
      state.contracts = state.contracts.filter(
        (contract) => contract.propertyId !== propertyId,
      );
      commit(state, { action: "PROPERTY_DELETED", entityId: propertyId });
      return true;
    },
    listInquiries(query = {}) {
      return cloneDemoValue(selectInquiriesPage(readState(), query));
    },
    getInquiry(inquiryId) {
      const inquiry = readState().inquiries.find(
        (candidate) => candidate.id === inquiryId,
      );
      return inquiry ? cloneDemoValue(inquiry) : null;
    },
    upsertInquiry(input) {
      const entityId = input.id?.trim() || undefined;
      return mutate(
        { action: "INQUIRY_UPSERTED", entityId },
        (state): DemoInquiry => {
          for (const complexId of input.desiredComplexIds) {
            assertComplexExists(state, complexId);
          }
          const id = entityId ?? nextId("inquiry", state.inquiries);
          const index = state.inquiries.findIndex((item) => item.id === id);
          const existing = index >= 0 ? state.inquiries[index] : undefined;
          const timestamp = now();
          const inquiry: DemoInquiry = {
            ...cloneDemoValue(input),
            id,
            createdAt: existing?.createdAt ?? input.createdAt ?? timestamp,
            updatedAt: timestamp,
          };
          if (index >= 0) state.inquiries[index] = inquiry;
          else state.inquiries.push(inquiry);
          return inquiry;
        },
      );
    },
    deleteInquiry(inquiryId) {
      const state = readState();
      const index = state.inquiries.findIndex((item) => item.id === inquiryId);
      if (index < 0) return false;
      state.inquiries.splice(index, 1);
      state.consultations = state.consultations.filter(
        (log) => !(log.targetType === "INQUIRY" && log.targetId === inquiryId),
      );
      state.contracts = state.contracts.map((contract) => {
        if (contract.inquiryId !== inquiryId) return contract;
        const remaining = { ...contract };
        delete remaining.inquiryId;
        return remaining;
      });
      commit(state, { action: "INQUIRY_DELETED", entityId: inquiryId });
      return true;
    },
    listConsultations(query = {}) {
      return cloneDemoValue(selectConsultations(readState(), query));
    },
    upsertConsultation(input) {
      return mutate(
        { action: "CONSULTATION_UPSERTED", entityId: input.id },
        (state): DemoConsultationLog => {
          assertConsultationTargetExists(state, input);
          const id =
            input.id?.trim() || nextId("consultation", state.consultations);
          const index = state.consultations.findIndex((item) => item.id === id);
          const existing = index >= 0 ? state.consultations[index] : undefined;
          const consultation: DemoConsultationLog = {
            ...cloneDemoValue(input),
            id,
            createdAt: existing?.createdAt ?? input.createdAt ?? now(),
          };
          if (index >= 0) state.consultations[index] = consultation;
          else state.consultations.push(consultation);
          return consultation;
        },
      );
    },
    deleteConsultation(consultationId) {
      const state = readState();
      const index = state.consultations.findIndex(
        (item) => item.id === consultationId,
      );
      if (index < 0) return false;
      state.consultations.splice(index, 1);
      commit(state, {
        action: "CONSULTATION_DELETED",
        entityId: consultationId,
      });
      return true;
    },
    listContracts() {
      return cloneDemoValue(
        readState().contracts.sort(
          (left, right) =>
            right.updatedAt.localeCompare(left.updatedAt) ||
            left.id.localeCompare(right.id),
        ),
      );
    },
    getContractByPropertyId(propertyId) {
      const contract = selectContractByPropertyId(readState(), propertyId);
      return contract ? cloneDemoValue(contract) : null;
    },
    upsertContract(input) {
      return mutate(
        { action: "CONTRACT_UPSERTED", entityId: input.id },
        (state): DemoContract => {
          assertPropertyExists(state, input.propertyId);
          if (input.inquiryId) assertInquiryExists(state, input.inquiryId);
          const samePropertyContract = state.contracts.find(
            (contract) => contract.propertyId === input.propertyId,
          );
          const id =
            input.id?.trim() ||
            samePropertyContract?.id ||
            nextId("contract", state.contracts);
          const index = state.contracts.findIndex((item) => item.id === id);
          const contract: DemoContract = {
            ...cloneDemoValue(input),
            id,
            updatedAt: now(),
          };
          if (index >= 0) state.contracts[index] = contract;
          else state.contracts.push(contract);
          return contract;
        },
      );
    },
    deleteContract(contractId) {
      const state = readState();
      const index = state.contracts.findIndex((item) => item.id === contractId);
      if (index < 0) return false;
      state.contracts.splice(index, 1);
      commit(state, { action: "CONTRACT_DELETED", entityId: contractId });
      return true;
    },
  };
}

const defaultRepository = createDemoRepository();

export const getDemoState = (): DemoState => defaultRepository.getState();
export const resetDemoState = (): DemoState => defaultRepository.reset();
export const subscribeDemoState = (listener: DemoStateListener): (() => void) =>
  defaultRepository.subscribe(listener);
export const getDemoOffice = (): DemoOffice => defaultRepository.getOffice();
export const listDemoComplexes = (): DemoComplex[] =>
  defaultRepository.listComplexes();
export const listDemoProperties = (
  query?: DemoPropertyListQuery,
): DemoPage<DemoProperty> => defaultRepository.listProperties(query);
export const getDemoProperty = (propertyId: string): DemoProperty | null =>
  defaultRepository.getProperty(propertyId);
export const upsertDemoProperty = (input: DemoPropertyUpsert): DemoProperty =>
  defaultRepository.upsertProperty(input);
export const deleteDemoProperty = (propertyId: string): boolean =>
  defaultRepository.deleteProperty(propertyId);
export const listDemoInquiries = (
  query?: DemoInquiryListQuery,
): DemoPage<DemoInquiry> => defaultRepository.listInquiries(query);
export const getDemoInquiry = (inquiryId: string): DemoInquiry | null =>
  defaultRepository.getInquiry(inquiryId);
export const upsertDemoInquiry = (input: DemoInquiryUpsert): DemoInquiry =>
  defaultRepository.upsertInquiry(input);
export const deleteDemoInquiry = (inquiryId: string): boolean =>
  defaultRepository.deleteInquiry(inquiryId);
export const listDemoConsultations = (
  query?: DemoConsultationListQuery,
): DemoConsultationLog[] => defaultRepository.listConsultations(query);
export const upsertDemoConsultation = (
  input: DemoConsultationUpsert,
): DemoConsultationLog => defaultRepository.upsertConsultation(input);
export const deleteDemoConsultation = (consultationId: string): boolean =>
  defaultRepository.deleteConsultation(consultationId);
export const listDemoContracts = (): DemoContract[] =>
  defaultRepository.listContracts();
export const getDemoContractByPropertyId = (
  propertyId: string,
): DemoContract | null => defaultRepository.getContractByPropertyId(propertyId);
export const upsertDemoContract = (input: DemoContractUpsert): DemoContract =>
  defaultRepository.upsertContract(input);
export const deleteDemoContract = (contractId: string): boolean =>
  defaultRepository.deleteContract(contractId);

export function cloneDemoValue<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function deserializeState(raw: string): DemoState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      parsed.schemaVersion !== DEMO_SCHEMA_VERSION ||
      typeof parsed.savedAt !== "string"
    ) {
      return null;
    }
    return isDemoState(parsed.state) ? parsed.state : null;
  } catch {
    return null;
  }
}

function isDemoState(value: unknown): value is DemoState {
  if (!isRecord(value)) return false;
  if (
    typeof value.seedId !== "string" ||
    !isNonNegativeInteger(value.revision)
  ) {
    return false;
  }
  if (!isOffice(value.office)) return false;
  if (!isEntityArray(value.complexes, isComplex)) return false;
  if (!isEntityArray(value.properties, isProperty)) return false;
  if (!isEntityArray(value.inquiries, isInquiry)) return false;
  if (!isEntityArray(value.consultations, isConsultation)) return false;
  if (!isEntityArray(value.contracts, isContract)) return false;

  const complexIds = new Set(value.complexes.map((item) => item.id));
  const propertyIds = new Set(value.properties.map((item) => item.id));
  const inquiryIds = new Set(value.inquiries.map((item) => item.id));
  if (value.properties.some((item) => !complexIds.has(item.complexId)))
    return false;
  if (
    value.inquiries.some((item) =>
      item.desiredComplexIds.some((id) => !complexIds.has(id)),
    )
  ) {
    return false;
  }
  if (
    value.consultations.some((item) =>
      item.targetType === "PROPERTY"
        ? !propertyIds.has(item.targetId)
        : !inquiryIds.has(item.targetId),
    )
  ) {
    return false;
  }
  return !value.contracts.some(
    (item) =>
      !propertyIds.has(item.propertyId) ||
      (item.inquiryId !== undefined && !inquiryIds.has(item.inquiryId)),
  );
}

function isOffice(value: unknown): value is DemoOffice {
  return (
    isRecord(value) &&
    hasStrings(value, [
      "id",
      "name",
      "representativeName",
      "registrationNumber",
      "phone",
      "email",
      "address",
      "businessHours",
      "introduction",
    ])
  );
}

function isComplex(value: unknown): value is DemoComplex {
  return (
    isRecord(value) &&
    hasStrings(value, ["id", "name", "address", "district", "legalDong"]) &&
    hasNumbers(value, ["builtYear", "totalHouseholds", "parkingPerHousehold"])
  );
}

function isProperty(value: unknown): value is DemoProperty {
  return (
    isRecord(value) &&
    hasStrings(value, [
      "id",
      "complexId",
      "propertyType",
      "building",
      "unit",
      "direction",
      "transactionType",
      "status",
      "priority",
      "occupancyStatus",
      "availableFrom",
      "registeredAt",
      "updatedAt",
      "memo",
    ]) &&
    hasNumbers(value, [
      "floor",
      "totalFloor",
      "supplyArea",
      "exclusiveArea",
      "rooms",
      "bathrooms",
    ]) &&
    typeof value.isFavorite === "boolean" &&
    isStringArray(value.tags) &&
    isContact(value.owner) &&
    isPrice(value.price)
  );
}

function isInquiry(value: unknown): value is DemoInquiry {
  return (
    isRecord(value) &&
    hasStrings(value, [
      "id",
      "title",
      "propertyType",
      "transactionType",
      "status",
      "priority",
      "moveInBy",
      "publicDescription",
      "privateNote",
      "createdAt",
      "updatedAt",
    ]) &&
    isContact(value.customer) &&
    isStringArray(value.desiredComplexIds) &&
    isStringArray(value.desiredDistricts) &&
    isStringArray(value.desiredDongs) &&
    isRange(value.area) &&
    isBudget(value.budget)
  );
}

function isConsultation(value: unknown): value is DemoConsultationLog {
  return (
    isRecord(value) &&
    hasStrings(value, [
      "id",
      "targetType",
      "targetId",
      "customerType",
      "channel",
      "content",
      "writerName",
      "createdAt",
    ])
  );
}

function isContract(value: unknown): value is DemoContract {
  return (
    isRecord(value) &&
    hasStrings(value, [
      "id",
      "propertyId",
      "transactionType",
      "status",
      "contractDate",
      "moveInDate",
      "expiresAt",
      "memo",
      "updatedAt",
    ]) &&
    (value.inquiryId === undefined || typeof value.inquiryId === "string") &&
    isContact(value.lessorOrSeller) &&
    isContact(value.lesseeOrBuyer) &&
    isPrice(value.price)
  );
}

function isContact(value: unknown): boolean {
  return isRecord(value) && hasStrings(value, ["name", "phone"]);
}

function isPrice(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasNumbers(value, ["sale", "jeonse", "monthlyDeposit", "monthlyRent"])
  );
}

function isRange(value: unknown): boolean {
  return isRecord(value) && hasNumbers(value, ["min", "max"]);
}

function isBudget(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return ["sale", "jeonse", "monthlyDeposit", "monthlyRent"].every(
    (key) => value[key] === null || isRange(value[key]),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStrings(value: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) => typeof value[key] === "string");
}

function hasNumbers(value: Record<string, unknown>, keys: string[]): boolean {
  return keys.every(
    (key) => typeof value[key] === "number" && Number.isFinite(value[key]),
  );
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isEntityArray<T extends { id: string }>(
  value: unknown,
  guard: (item: unknown) => item is T,
): value is T[] {
  if (!Array.isArray(value) || !value.every(guard)) return false;
  return new Set(value.map((item) => item.id)).size === value.length;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function assertComplexExists(state: DemoState, complexId: string): void {
  if (!state.complexes.some((complex) => complex.id === complexId)) {
    throw new Error(`Unknown demo complex: ${complexId}`);
  }
}

function assertPropertyExists(state: DemoState, propertyId: string): void {
  if (!state.properties.some((property) => property.id === propertyId)) {
    throw new Error(`Unknown demo property: ${propertyId}`);
  }
}

function assertInquiryExists(state: DemoState, inquiryId: string): void {
  if (!state.inquiries.some((inquiry) => inquiry.id === inquiryId)) {
    throw new Error(`Unknown demo inquiry: ${inquiryId}`);
  }
}

function assertConsultationTargetExists(
  state: DemoState,
  input: DemoConsultationUpsert,
): void {
  if (input.targetType === "PROPERTY") {
    assertPropertyExists(state, input.targetId);
  } else {
    assertInquiryExists(state, input.targetId);
  }
}

function nextId(
  prefix: string,
  entities: ReadonlyArray<{ id: string }>,
): string {
  const expression = new RegExp(`^${prefix}-(\\d+)$`);
  const highest = entities.reduce((maximum, entity) => {
    const match = expression.exec(entity.id);
    return match ? Math.max(maximum, Number(match[1])) : maximum;
  }, 0);
  return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
}

function createChangeEvent(change: DemoStateChange): Event | null {
  if (typeof CustomEvent === "function") {
    return new CustomEvent<DemoStateChange>(DEMO_STATE_CHANGED_EVENT, {
      detail: { ...change },
    });
  }
  if (typeof Event === "function") {
    const event = new Event(DEMO_STATE_CHANGED_EVENT);
    Object.defineProperty(event, "detail", { value: { ...change } });
    return event;
  }
  return null;
}
