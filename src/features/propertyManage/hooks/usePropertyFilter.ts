import { useMemo } from "react";
import type { ApartmentWithProperty } from "../stores/propertyStore";

interface UsePropertyFilterParams {
  apartments: ApartmentWithProperty[];
  selectedManageType?: string;
  selectedRequestType?: string;
  selectedPropertyStatus?: string;
  selectedArea?: string;
  phoneNumber?: string;
  dong?: string;
  ho?: string;
}

/**
 * 매물 필터링 및 정렬 로직을 관리하는 커스텀 훅
 */
export function usePropertyFilter({
  apartments,
  selectedManageType,
  selectedRequestType,
  selectedPropertyStatus,
  selectedArea,
  phoneNumber,
  dong,
  ho,
}: UsePropertyFilterParams) {
  const filteredAndSortedApartments = useMemo(() => {
    let filtered = apartments;

    // 관리 타입 필터 적용
    if (selectedManageType !== undefined) {
      filtered = filtered.filter((apartment) => {
        const manageType = apartment.property?.manageType || "NONE";
        return manageType === selectedManageType;
      });
    }

    // 의뢰 유형 필터 적용
    if (selectedRequestType !== undefined) {
      filtered = filtered.filter((apartment) => {
        const requestType = apartment.property?.requestType || "NONE";
        return requestType === selectedRequestType;
      });
    }

    // 매물 상태 필터 적용
    if (selectedPropertyStatus !== undefined) {
      filtered = filtered.filter((apartment) => {
        const propertyStatus = apartment.property?.propertyStatus || "NONE";
        return propertyStatus === selectedPropertyStatus;
      });
    }

    // 면적 필터 적용
    if (selectedArea !== undefined) {
      filtered = filtered.filter((apartment) => {
        const apartmentArea = apartment.area;
        if (apartmentArea === undefined || apartmentArea === null) {
          return false;
        }
        return String(apartmentArea) === selectedArea;
      });
    }

    // 전화번호 필터 적용
    if (phoneNumber && phoneNumber.trim() !== "") {
      filtered = filtered.filter((apartment) => {
        const ownerPhone = apartment.property?.ownerPhone;

        // ownerPhone이 없으면 필터링에서 제외
        if (!ownerPhone || ownerPhone === "") {
          return false;
        }

        // 숫자만 추출하여 비교 (하이픈, 공백 등 제거)
        const normalizedOwnerPhone = String(ownerPhone).replace(/[^0-9]/g, "");
        const normalizedSearchPhone = phoneNumber.replace(/[^0-9]/g, "");

        // 부분 일치로 비교 (입력한 숫자가 연락처에 포함되면 매칭)
        return normalizedOwnerPhone.includes(normalizedSearchPhone);
      });
    }

    // 동 검색 필터 적용
    if (dong && dong.trim() !== "") {
      filtered = filtered.filter((apartment) => {
        const apartmentDong = String(apartment.dong || "");
        // 부분 일치로 비교 (입력한 값이 동에 포함되면 매칭)
        return apartmentDong.includes(dong.trim());
      });
    }

    // 호 검색 필터 적용
    if (ho && ho.trim() !== "") {
      filtered = filtered.filter((apartment) => {
        const apartmentHo = String(apartment.ho || "");
        // 부분 일치로 비교 (입력한 값이 호에 포함되면 매칭)
        return apartmentHo.includes(ho.trim());
      });
    }

    // 선택된 의뢰 유형이 있으면 위에서부터 정렬 (선택된 것이 먼저 나오도록)
    if (selectedRequestType && selectedRequestType !== "NONE") {
      filtered = [...filtered].sort((a, b) => {
        const aRequestType = a.property?.requestType || "NONE";
        const bRequestType = b.property?.requestType || "NONE";

        // 선택된 의뢰 유형이 먼저 오도록
        if (
          aRequestType === selectedRequestType &&
          bRequestType !== selectedRequestType
        ) {
          return -1;
        }
        if (
          aRequestType !== selectedRequestType &&
          bRequestType === selectedRequestType
        ) {
          return 1;
        }
        return 0;
      });
    }

    return filtered;
  }, [
    apartments,
    selectedRequestType,
    selectedPropertyStatus,
    selectedManageType,
    selectedArea,
    phoneNumber,
    dong,
    ho,
  ]);

  return { filteredAndSortedApartments };
}
