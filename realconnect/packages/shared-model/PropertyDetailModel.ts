import { PropertyEntity } from "../shared-entity/PropertyEntity";

/**
 * 매물 상세 정보용 데이터 모델
 * Entity를 상세 화면에서 사용하기 편한 구조로 변환 (비즈니스 로직 제외)
 */
export interface PropertyDetailModel {
  // 기본 정보
  apartmentId: number;
  apartmentName: string;
  dong: string;
  ho: string;
  area: string;

  // 상세 정보 (평탄화, 원본 값 그대로)
  ownerName: string | null;
  ownerPhone: string | null;
  tenantName: string | null;
  tenantPhone: string | null;
  salePrice: number | null;
  jeonsePrice: number | null;
  deposit: number | null;
  monthPrice: number | null;
  status: string | null;
  memo: string | null;
  startDate: string | null;
  endDate: string | null;

  // 추가 정보
  direction: string | null;
  img: string | null;
  type: string | null;
}

/**
 * PropertyEntity를 PropertyDetailModel로 변환
 * 순수한 데이터 구조 변환만 수행 (비즈니스 로직 없음)
 */
export function toPropertyDetailModel(
  entity: PropertyEntity
): PropertyDetailModel {
  return {
    // 기본 정보 (원본 그대로)
    apartmentId: entity.apartmentId,
    apartmentName: entity.apartmentName,
    dong: entity.dong,
    ho: entity.ho,
    area: entity.area,

    // 상세 정보 평탄화 (null 체크만, 변환 없음)
    ownerName: entity.property?.ownerName ?? null,
    ownerPhone: entity.property?.ownerPhone ?? null,
    tenantName: entity.property?.tenantName ?? null,
    tenantPhone: entity.property?.tenantPhone ?? null,
    salePrice: entity.property?.salePrice ?? null,
    jeonsePrice: entity.property?.jeonsePrice ?? null,
    deposit: entity.property?.deposit ?? null,
    monthPrice: entity.property?.monthPrice ?? null,
    status: entity.property?.status ?? null,
    memo: entity.property?.memo ?? null,
    startDate: entity.property?.startDate ?? null,
    endDate: entity.property?.endDate ?? null,

    // 추가 정보 (원본 그대로)
    direction: entity.direction,
    img: entity.img,
    type: entity.type,
  };
}
