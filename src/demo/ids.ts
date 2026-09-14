const PROPERTY_ID_PREFIX = "property-";

/** Converts repository IDs such as `property-007` to the numeric UI/API ID. */
export function demoPropertyIdToApartmentId(propertyId: string): number {
  const match = propertyId.match(/(\d+)$/);
  const apartmentId = match ? Number(match[1]) : Number.NaN;

  if (!Number.isSafeInteger(apartmentId) || apartmentId <= 0) {
    throw new Error(`Invalid demo property ID: ${propertyId}`);
  }

  return apartmentId;
}

/** Converts the numeric UI/API ID back to the repository property ID. */
export function apartmentIdToDemoPropertyId(apartmentId: number): string {
  if (!Number.isSafeInteger(apartmentId) || apartmentId <= 0) {
    throw new Error(`Invalid apartment ID: ${apartmentId}`);
  }

  return `${PROPERTY_ID_PREFIX}${String(apartmentId).padStart(3, "0")}`;
}

/**
 * Produces a stable positive number for string complex IDs. Reversal uses the
 * current repository complex IDs, so no ordering-dependent index is persisted.
 */
export function demoComplexIdToApartmentComplexId(complexId: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < complexId.length; index += 1) {
    hash ^= complexId.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0 || 1;
}

export function apartmentComplexIdToDemoComplexId(
  apartmentComplexId: number,
  complexIds: readonly string[],
): string | null {
  const matches = complexIds.filter(
    (complexId) =>
      demoComplexIdToApartmentComplexId(complexId) === apartmentComplexId,
  );

  if (matches.length > 1) {
    throw new Error(`Demo complex ID collision: ${apartmentComplexId}`);
  }

  return matches[0] ?? null;
}
