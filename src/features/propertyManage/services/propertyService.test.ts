import { beforeEach, describe, expect, it } from "vitest";

import {
  getDemoContractByPropertyId,
  getDemoProperty,
  getDemoState,
  resetDemoState,
} from "@/demo/repository";
import { fetchPreferredComplexList } from "@/shared/api/region";
import {
  createPropertyConsultationLogAPI,
  fetchApartmentById,
  fetchPropertyContractInfo,
  fetchPropertyList,
  updatePropertyContractInfoAPI,
  updatePropertyDetailAPI,
  updatePropertyManage,
} from "./propertyService";

describe("propertyService demo adapter", () => {
  beforeEach(() => {
    resetDemoState();
  });

  it("persists one property workflow in the shared demo repository", async () => {
    const complexes = await fetchPreferredComplexList();
    const hanbit = complexes.find(
      (complex) => complex.apartmentName === "한빛샘플아파트",
    );
    expect(hanbit).toBeDefined();

    const list = await fetchPropertyList({
      apartmentComplexId: hanbit!.apartmentComplexId,
      size: 100,
    });
    expect(list.content.some((property) => property.apartmentId === 2)).toBe(
      true,
    );

    await updatePropertyManage(2, "CAUTION");
    const log = await createPropertyConsultationLogAPI(2, {
      customerType: "OWNER",
      content: "포트폴리오 서비스 어댑터 저장 확인",
    });

    const detail = await fetchApartmentById(2);
    await updatePropertyDetailAPI(2, {
      ...detail,
      roomCount: 4,
      mainUsage: "OFFICE",
    });

    const contract = await fetchPropertyContractInfo(2);
    await updatePropertyContractInfoAPI(2, {
      ...contract,
      jeonsePrice: 73_000,
      loanAmount: 8_000,
      contractOffice: "RealConnect 데모",
    });

    const state = getDemoState();
    expect(getDemoProperty("property-002")).toMatchObject({
      priority: "CAUTION",
      rooms: 4,
    });
    expect(
      state.consultations.find((consultation) =>
        consultation.id.endsWith(String(log.id).padStart(3, "0")),
      ),
    ).toMatchObject({
      targetId: "property-002",
      content: "포트폴리오 서비스 어댑터 저장 확인",
    });
    expect(getDemoContractByPropertyId("property-002")).toMatchObject({
      price: { jeonse: 73_000 },
    });
    await expect(fetchApartmentById(2)).resolves.toMatchObject({
      roomCount: 4,
      mainUsage: "OFFICE",
    });
    await expect(fetchPropertyContractInfo(2)).resolves.toMatchObject({
      jeonsePrice: 73_000,
      loanAmount: 8_000,
      contractOffice: "RealConnect 데모",
    });
  });

  it("does not present a listing price as contract money", async () => {
    expect(getDemoContractByPropertyId("property-001")).toBeNull();

    await expect(fetchPropertyContractInfo(1)).resolves.toMatchObject({
      salePrice: 0,
      jeonsePrice: 0,
      deposit: 0,
      monthlyRent: 0,
      registrationDate: "",
      contractOffice: "",
    });

    const detail = await fetchApartmentById(1);
    await updatePropertyDetailAPI(1, { ...detail, roomCount: 4 });

    expect(getDemoContractByPropertyId("property-001")).toBeNull();
  });
});
