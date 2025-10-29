import apiClient from "@/shared/api/client";

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
  const response = await apiClient.get<Sido[]>("/api/address/sido");
  return response.data;
};

/**
 * 시/군/구 목록 조회
 * GET /api/address/sigungu
 */
export const fetchSigunguList = async (
  sidoCode: string
): Promise<Sigungu[]> => {
  const response = await apiClient.get<Sigungu[]>("/api/address/sigungu", {
    params: {
      sidoCode,
    },
  });
  return response.data;
};

export const fetchEmdList = async (sigunguCode: string): Promise<Emd[]> => {
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
  code: string
): Promise<ApartmentComplex[]> => {
  const response = await apiClient.get<ApartmentComplex[]>(
    "/api/apartment-complex",
    {
      params: {
        code,
      },
    }
  );
  return response.data;
};

// 주거래 단지 추가
export const addApartmentComplex = async (
  preferredComplex: PreferredComplex
): Promise<PreferredComplex> => {
  const response = await apiClient.post<PreferredComplex>(
    "/api/user/preferred-complex",
    preferredComplex
  );
  return response.data;
};

// 주거래 단지 삭제
export const deleteApartmentComplex = async (
  apartmentComplexId: number
): Promise<void> => {
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
  const response = await apiClient.get<PreferredComplex[]>(
    "/api/user/preferred-complex"
  );
  return response.data;
};

// 아파트 단지 면적 목록 조회
export const fetchAreaList = async (
  apartmentComplexId: number
): Promise<number[]> => {
  const response = await apiClient.get<number[]>(
    "/api/apartment-complex/areaList",
    {
      params: {
        apartmentComplexId,
      },
    }
  );
  return response.data;
};
