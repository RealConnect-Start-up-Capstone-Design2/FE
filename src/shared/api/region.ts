import apiClient from "@/shared/api/client";
import {
  apartmentComplexIdToDemoComplexId,
  demoComplexIdToApartmentComplexId,
} from "@/demo/ids";
import { listDemoComplexes, listDemoProperties } from "@/demo/repository";
import { isDemoRuntime } from "@/demo/session";

export interface Sido {
  sidoCode: string;
  name_kr: string;
}

export interface Sigungu {
  sigunguCode: string;
  name_kr: string;
}

export interface Emd {
  emdCode: string;
  name_kr: string;
}

export interface ApartmentComplex {
  id: number;
  apartmentName: string;
}

export interface PreferredComplex {
  id: number;
  apartmentComplexId: number;
  apartmentName: string;
}

export interface DeletePreferredComplex {
  id: number;
}
/**
 * 시/도 목록 조회
 * GET /api/address/sido
 */
export const fetchSidoList = async (): Promise<Sido[]> => {
  if (isDemoRuntime()) {
    return [{ sidoCode: "demo-seoul", name_kr: "서울특별시" }];
  }

  const response = await apiClient.get<Sido[]>("/api/address/sido");
  return response.data;
};

/**
 * 시/군/구 목록 조회
 * GET /api/address/sigungu
 */
export const fetchSigunguList = async (
  sidoCode: string,
): Promise<Sigungu[]> => {
  if (isDemoRuntime()) {
    return Array.from(
      new Set(listDemoComplexes().map((complex) => complex.district)),
    ).map((district) => ({
      sigunguCode: `demo-${district}`,
      name_kr: district,
    }));
  }

  const response = await apiClient.get<Sigungu[]>("/api/address/sigungu", {
    params: {
      sidoCode,
    },
  });
  return response.data;
};

export const fetchEmdList = async (sigunguCode: string): Promise<Emd[]> => {
  if (isDemoRuntime()) {
    return listDemoComplexes().map((complex) => ({
      emdCode: complex.id,
      name_kr: complex.legalDong,
    }));
  }

  const response = await apiClient.get<Emd[]>("/api/address/emd", {
    params: {
      sigunguCode,
    },
  });
  return response.data;
};

// 아파트 단지 목록 조회
// 선택한 지역에 있는 모든 아파트를 조회함.
export const fetchApartmentComplexList = async (
  code: string,
): Promise<ApartmentComplex[]> => {
  if (isDemoRuntime()) {
    const complexes = listDemoComplexes();
    const matchingComplexes = complexes.filter(
      (complex) => complex.id === code || complex.legalDong === code,
    );

    return (matchingComplexes.length > 0 ? matchingComplexes : complexes).map(
      (complex) => ({
        id: demoComplexIdToApartmentComplexId(complex.id),
        apartmentName: complex.name,
      }),
    );
  }

  const response = await apiClient.get<ApartmentComplex[]>(
    "/api/apartment-complex",
    {
      params: {
        code,
      },
    },
  );
  return response.data;
};

// 주거래 단지 추가
export const addApartmentComplex = async (
  preferredComplex: PreferredComplex,
): Promise<PreferredComplex> => {
  if (isDemoRuntime()) {
    return { ...preferredComplex };
  }

  const response = await apiClient.post<PreferredComplex>(
    "/api/user/preferred-complex",
    preferredComplex,
  );
  return response.data;
};

// 주거래 단지 삭제
export const deleteApartmentComplex = async (
  apartmentComplexId: number,
): Promise<void> => {
  if (isDemoRuntime()) {
    return;
  }

  await apiClient.delete("/api/user/preferred-complex", {
    data: {
      apartmentComplexId,
    },
  });
};

// 사용자 선호 단지 목록 조회
export const fetchPreferredComplexList = async (): Promise<
  PreferredComplex[]
> => {
  if (isDemoRuntime()) {
    return listDemoComplexes()
      .map((complex) => {
        const apartmentComplexId = demoComplexIdToApartmentComplexId(
          complex.id,
        );
        return {
          id: apartmentComplexId,
          apartmentComplexId,
          apartmentName: complex.name,
        };
      })
      .sort(
        (left, right) => left.apartmentComplexId - right.apartmentComplexId,
      );
  }

  const response = await apiClient.get<PreferredComplex[]>(
    "/api/user/preferred-complex",
  );
  // BE가 단지 목록을 비결정적 순서로 반환 → 단지ID 기준 정렬로 고정.
  // (새로고침마다 매물장 기본 단지·대시보드 주거래 단지 순서가 바뀌는 문제 방지)
  return [...response.data].sort(
    (a, b) => a.apartmentComplexId - b.apartmentComplexId,
  );
};

// 아파트 단지 면적 목록 조회
export const fetchAreaList = async (
  apartmentComplexId: number,
): Promise<number[]> => {
  if (isDemoRuntime()) {
    const complexIds = listDemoComplexes().map((complex) => complex.id);
    const complexId = apartmentComplexIdToDemoComplexId(
      apartmentComplexId,
      complexIds,
    );
    if (!complexId) return [];

    const properties = listDemoProperties({
      complexId,
      page: 1,
      pageSize: 100,
    }).items;
    return Array.from(
      new Set(properties.map((property) => property.supplyArea)),
    ).sort((left, right) => left - right);
  }

  const response = await apiClient.get<number[]>(
    "/api/apartment-complex/areaList",
    {
      params: {
        apartmentComplexId,
      },
    },
  );
  return response.data;
};
