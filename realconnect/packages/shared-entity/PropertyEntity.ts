// 매물 상세 property 정보
export interface PropertyCore {
  id: number;
  status: string;
  ownerName: string;
  ownerPhone: string;
  tenantName: string;
  tenantPhone: string;
  salePrice: number | null;
  jeonsePrice: number | null;
  deposit: number | null;
  monthPrice: number | null;
  memo: string;
  startDate: string | null;
  endDate: string | null;
}

// 매물 목록의 각 아이템
export interface PropertyEntity {
  property: PropertyCore;
  type: string | null;
  dong: string;
  ho: string;
  area: string;
  apartmentName: string;
  apartmentId: number;
  direction: string | null;
  img: string | null;
}

// 페이징 정보
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// 매물 목록 전체 응답
export interface PropertyListResponse {
  content: PropertyEntity[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
