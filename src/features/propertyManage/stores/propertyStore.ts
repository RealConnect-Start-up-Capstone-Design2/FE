// ============================================
// 매물 데이터 타입 정의 (API 스펙 기준)
// ============================================

/**
 * 매물 상태
 */
export type PropertyStatus = "NONE" | "BEFORE" | "ADVERTISING" | "COMPLETED";

/**
 * 의뢰 유형
 */
export type RequestType =
  | "NONE"
  | "SELF"
  | "SALE"
  | "JEONSE"
  | "MONTHLY"
  | "JM";

/**
 * 방향
 */
export type Direction = "NORTH" | "SOUTH" | "EAST" | "WEST";

/**
 * 관리 유형 (즐겨찾기)
 */
export type ManageType = "NONE" | "ATTENTION" | "CAUTION";

/**
 * 매물 정보 (아파트에 등록된 내 매물)
 * property가 null이면 해당 아파트에 매물이 없는 것
 */
export interface PropertyInfo {
  salePrice: number; // 매매가
  jeonsePrice: number; // 전세가
  deposit: number; // 보증금
  monthPrice: number; // 월세
  propertyStatus: PropertyStatus; // 매물 상태
  requestType: RequestType; // 의뢰 유형
  manageType: ManageType; // 관리 타입 (즐겨찾기)
  ownerName: string; // 소유자 이름
  ownerPhone: string; // 소유자 연락처
}

/**
 * 아파트 정보 + 매물 정보
 * 목록 조회 시 반환되는 주요 데이터 타입
 */
export interface ApartmentWithProperty {
  apartmentId: number; // 아파트 ID (PK)
  apartmentName: string; // 아파트 단지명
  dong: string; // 동
  ho: string; // 호수
  area: number; // 면적 (㎡)
  direction: Direction; // 방향
  img: string; // 이미지 URL
  type: string; // 타입 (아파트, 빌라 등)
  contractDate: string; // 계약일
  property: PropertyInfo | null; // 매물 정보 (없으면 null)
  isFavorite?: boolean; // 즐겨찾기 여부 (UI 전용, 로컬 상태)
}

/**
 * 매물 목록 조회 응답 (커서 기반 페이지네이션)
 */
export interface PropertiesResponse {
  content: ApartmentWithProperty[]; // 아파트 목록
  nextCursor: number | null; // 다음 커서 (없으면 null)
  hasNext: boolean; // 다음 페이지 존재 여부
}

/**
 * 매물 목록 조회 파라미터
 */
export interface PropertiesQueryParams {
  apartmentComplexId: number; // 단지 ID (필수)
  cursorId?: number; // 커서 ID (첫 페이지는 생략)
  size?: number; // 페이지 크기 (기본 30, 최대 100)
  dong?: string; // 동 필터 ('dong%' 검색)
  ho?: string; // 호수 필터 ('ho%' 검색)
  area?: number; // 면적 필터
  propertyStatus?: PropertyStatus; // 매물 상태 필터
  requestType?: RequestType; // 의뢰 유형 필터
  manageType?: ManageType; // 관리 타입 필터 (즐겨찾기)
}

// ============================================
// 더미 데이터 (개발용)
// TODO: API 연동 후 제거 예정
// ============================================
const dummyApartments: ApartmentWithProperty[] = [
  {
    apartmentId: 1,
    apartmentName: "래미안 아파트",
    dong: "101",
    ho: "101",
    area: 84.75,
    direction: "NORTH",
    img: "",
    type: "아파트",
    contractDate: "2025-01-15",
    isFavorite: false,
    property: {
      salePrice: 500000000,
      jeonsePrice: 300000000,
      deposit: 10000000,
      monthPrice: 500000,
      propertyStatus: "BEFORE",
      requestType: "MONTHLY",
      ownerName: "홍길동",
      ownerPhone: "010-1234-5678",
      memo: "101호 매물 테스트 메모",
      tenantName: "",
      tenantPhone: "",
      startDate: "2025-01-01",
      endDate: "2026-01-01",
    },
  },
  {
    apartmentId: 2,
    apartmentName: "래미안 아파트",
    dong: "101",
    ho: "102",
    area: 84.75,
    direction: "SOUTH",
    img: "",
    type: "아파트",
    contractDate: "",
    isFavorite: false,
    property: null, // 매물 없음
  },
  {
    apartmentId: 3,
    apartmentName: "래미안 아파트",
    dong: "102",
    ho: "201",
    area: 59.5,
    direction: "EAST",
    img: "",
    type: "아파트",
    contractDate: "",
    isFavorite: false,
    property: null, // 매물 없음
  },
  {
    apartmentId: 4,
    apartmentName: "래미안 아파트",
    dong: "102",
    ho: "202",
    area: 59.5,
    direction: "WEST",
    img: "",
    type: "아파트",
    contractDate: "2025-02-10",
    isFavorite: true,
    property: {
      salePrice: 450000000,
      jeonsePrice: 280000000,
      deposit: 5000000,
      monthPrice: 300000,
      propertyStatus: "ADVERTISING",
      requestType: "JEONSE",
      ownerName: "김철수",
      ownerPhone: "010-9876-5432",
      memo: "",
      tenantName: "이영희",
      tenantPhone: "010-5555-6666",
      startDate: "2025-02-01",
      endDate: "2027-02-01",
    },
  },
  {
    apartmentId: 5,
    apartmentName: "래미안 아파트",
    dong: "103",
    ho: "301",
    area: 72.0,
    direction: "NORTH",
    img: "",
    type: "아파트",
    contractDate: "2024-12-20",
    isFavorite: false,
    property: {
      salePrice: 480000000,
      jeonsePrice: 0,
      deposit: 0,
      monthPrice: 0,
      propertyStatus: "COMPLETED",
      requestType: "SALE",
      ownerName: "박민수",
      ownerPhone: "010-1111-2222",
      memo: "매매 완료된 매물",
      tenantName: "",
      tenantPhone: "",
    },
  },
  {
    apartmentId: 6,
    apartmentName: "래미안 아파트",
    dong: "103",
    ho: "302",
    area: 72.0,
    direction: "SOUTH",
    img: "",
    type: "아파트",
    contractDate: "",
    isFavorite: false,
    property: null, // 매물 없음
  },
  {
    apartmentId: 7,
    apartmentName: "래미안 아파트",
    dong: "104",
    ho: "401",
    area: 72.0,
    direction: "NORTH",
    img: "",
    type: "아파트",
    contractDate: "",
    isFavorite: false,
    property: null, // 매물 없음
  },
  {
    apartmentId: 8,
    apartmentName: "래미안 아파트",
    dong: "104",
    ho: "402",
    area: 72.0,
    direction: "SOUTH",
    img: "",
    type: "아파트",
    contractDate: "",
    isFavorite: false,
    property: null, // 매물 없음
  },
  {
    apartmentId: 9,
    apartmentName: "래미안 아파트",
    dong: "105",
    ho: "501",
    area: 72.0,
    direction: "NORTH",
    img: "",
    type: "아파트",
    contractDate: "",
    isFavorite: false,
    property: null, // 매물 없음
  },
  {
    apartmentId: 10,
    apartmentName: "래미안 아파트",
    dong: "105",
    ho: "502",
    area: 72.0,
    direction: "SOUTH",
    img: "",
    type: "아파트",
    contractDate: "",
    isFavorite: false,
    property: null, // 매물 없음
  },
];

// ============================================
// 임시 전역 상태 (React Query 캐시 전환 전까지)
// TODO: API 연동 시 이 부분 제거하고 propertyService만 사용
// ============================================
let globalApartments = [...dummyApartments];

/**
 * 아파트 목록 조회 (더미 데이터, 커서 페이지네이션 시뮬레이션)
 * TODO: API 연동 시 propertyService.fetchProperties()로 대체
 */
export const getApartments = (params?: {
  cursorId?: number;
  size?: number;
}): PropertiesResponse => {
  const size = params?.size || 30;
  const cursorId = params?.cursorId;

  // cursorId가 있으면 해당 ID 이후의 데이터만 반환
  let startIndex = 0;
  if (cursorId) {
    const cursorIndex = globalApartments.findIndex(
      (apt) => apt.apartmentId === cursorId
    );
    startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  }

  const content = globalApartments.slice(startIndex, startIndex + size);
  const hasNext = startIndex + size < globalApartments.length;
  const nextCursor = hasNext ? content[content.length - 1]?.apartmentId : null;

  return {
    content,
    nextCursor,
    hasNext,
  };
};

/**
 * 매물 메모 업데이트 (로컬)
 * property가 null이면 새로 생성, 있으면 업데이트
 * TODO: API 연동 시 propertyService.updatePropertyMemoAPI()로 대체
 */
export const updatePropertyMemo = (apartmentId: number, memo: string): void => {
  globalApartments = globalApartments.map((apartment) => {
    if (apartment.apartmentId === apartmentId) {
      // property가 없으면 새로 생성
      if (!apartment.property) {
        return {
          ...apartment,
          property: {
            salePrice: 0,
            jeonsePrice: 0,
            deposit: 0,
            monthPrice: 0,
            propertyStatus: "NONE",
            requestType: "NONE",
            ownerName: "",
            ownerPhone: "",
            memo,
          },
        };
      }

      // property가 있으면 메모만 업데이트
      return {
        ...apartment,
        property: {
          ...apartment.property,
          memo,
        },
      };
    }
    return apartment;
  });
};

/**
 * 즐겨찾기 토글 (로컬)
 * TODO: API 연동 시 propertyService.toggleFavoriteAPI()로 대체
 */
export const toggleFavorite = (
  apartmentId: number,
  isFavorite: boolean
): void => {
  globalApartments = globalApartments.map((apartment) =>
    apartment.apartmentId === apartmentId
      ? { ...apartment, isFavorite }
      : apartment
  );
};

/**
 * 매물 정보 업데이트 (로컬)
 * property가 null이면 새로 생성, 있으면 업데이트
 * TODO: API 연동 시 propertyService.updatePropertyAPI()로 대체
 */
export const updateProperty = (
  apartmentId: number,
  field: string,
  value: string | number
): void => {
  globalApartments = globalApartments.map((apartment) => {
    if (apartment.apartmentId === apartmentId) {
      // property가 없으면 새로 생성
      if (!apartment.property) {
        return {
          ...apartment,
          property: {
            salePrice: 0,
            jeonsePrice: 0,
            deposit: 0,
            monthPrice: 0,
            propertyStatus: "NONE",
            requestType: "NONE",
            ownerName: "",
            ownerPhone: "",
            memo: "",
            [field]: value,
          },
        };
      }

      // property가 있으면 업데이트
      return {
        ...apartment,
        property: {
          ...apartment.property,
          [field]: value,
        },
      };
    }
    return apartment;
  });
};
