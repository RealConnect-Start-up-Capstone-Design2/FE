import { PropertyEntity } from "../shared-entity/PropertyEntity";

/**
 * 매물 테이블 표시용 데이터 모델
 * Entity를 UI 테이블에서 사용하기 편한 구조로 변환 (비즈니스 로직 제외)
 */
export interface PropertyTableRow {
  // 기본 정보
  apartmentId: number;
  apartmentName: string;
  dong: string;
  ho: string;
  area: string;

  // 원본 property 데이터 (평탄화 전)
  property: PropertyEntity["property"];

  // 추가 정보
  type: string | null;
  direction: string | null;
  img: string | null;

  // 평탄화된 property 데이터 (원본 값 그대로)
  salePrice: number | null;
  jeonsePrice: number | null;
  deposit: number | null;
  monthPrice: number | null;
  status: string | null;
  ownerName: string | null;
  ownerPhone: string | null;
}

/**
 * PropertyEntity를 PropertyTableRow로 변환
 * 순수한 데이터 구조 변환만 수행 (비즈니스 로직 없음)
 */
export function toPropertyTableRow(entity: PropertyEntity): PropertyTableRow {
  return {
    // 기본 정보 (원본 그대로)
    apartmentId: entity.apartmentId,
    apartmentName: entity.apartmentName,
    dong: entity.dong,
    ho: entity.ho,
    area: entity.area,

    // 원본 property 데이터 유지
    property: entity.property,

    // 추가 정보 (원본 그대로)
    type: entity.type,
    direction: entity.direction,
    img: entity.img,

    // property 데이터 평탄화 (null 체크만, 변환 없음)
    salePrice: entity.property?.salePrice ?? null,
    jeonsePrice: entity.property?.jeonsePrice ?? null,
    deposit: entity.property?.deposit ?? null,
    monthPrice: entity.property?.monthPrice ?? null,
    status: entity.property?.status ?? null,
    ownerName: entity.property?.ownerName ?? null,
    ownerPhone: entity.property?.ownerPhone ?? null,
  };
}
