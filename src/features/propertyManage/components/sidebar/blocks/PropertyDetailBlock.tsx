import { SidebarBlock } from "@/shared/components/detail-sidebar";
import {
  EmptyBlockState,
  Field,
  FieldRow,
  PhotoStrip,
  SidebarInput,
  SidebarSelect,
  UploadDropzone,
} from "./SidebarFormControls";
import type {
  ApartmentWithProperty,
  PropertyDetailInfo,
} from "../../../types";

interface PropertyDetailBlockProps {
  apartment?: ApartmentWithProperty;
  detail?: PropertyDetailInfo;
  isOpen: boolean;
  onDetailChange?: (detail: PropertyDetailInfo) => void;
}

const defaultPropertyDetail: PropertyDetailInfo = {
  direction: "NONE",
  directionBase: "LIVING_ROOM",
  floorLevel: "LOW",
  roomCount: 0,
  bathroomCount: 0,
  totalParking: 0,
  parkingPerHousehold: 0,
  structureType: "SINGLE",
  entranceType: "NONE",
  mainUsage: "NONE",
};

const directionOptions = [
  { label: "선택", value: "NONE" },
  { label: "북향", value: "NORTH" },
  { label: "남향", value: "SOUTH" },
  { label: "동향", value: "EAST" },
  { label: "서향", value: "WEST" },
  { label: "북동향", value: "NORTHEAST" },
  { label: "남동향", value: "SOUTHEAST" },
  { label: "남서향", value: "SOUTHWEST" },
  { label: "북서향", value: "NORTHWEST" },
];

const directionBaseOptions = [
  { label: "거실", value: "LIVING_ROOM" },
  { label: "안방", value: "BEDROOM" },
];

const floorLevelOptions = [
  { label: "저", value: "LOW" },
  { label: "중", value: "MIDDLE" },
  { label: "고", value: "HIGH" },
];

const structureTypeOptions = [
  { label: "단층식", value: "SINGLE" },
  { label: "복층식", value: "DUPLEX" },
];

const entranceTypeOptions = [
  { label: "선택", value: "NONE" },
  { label: "계단식", value: "STAIR" },
  { label: "복도식", value: "CORRIDOR" },
  { label: "혼합식", value: "MIXED" },
];

const mainUsageOptions = [
  { label: "선택", value: "NONE" },
  { label: "주거시설", value: "RESIDENTIAL" },
  { label: "숙박시설", value: "ACCOMMODATION" },
  { label: "업무시설", value: "OFFICE" },
];

/**
 * 매물 상세 블록
 */
export function PropertyDetailBlock({
  apartment,
  detail,
  onDetailChange,
}: PropertyDetailBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="매물 상세">
        <EmptyBlockState />
      </SidebarBlock>
    );
  }

  const propertyDetail = detail ?? defaultPropertyDetail;

  const updateDetail = <Key extends keyof PropertyDetailInfo>(
    key: Key,
    value: PropertyDetailInfo[Key],
  ) => {
    onDetailChange?.({
      ...propertyDetail,
      [key]: value,
    });
  };

  const updateNumberDetail = (
    key:
      | "roomCount"
      | "bathroomCount"
      | "totalParking"
      | "parkingPerHousehold",
    value: string,
  ) => {
    const parsedValue = Number(value);
    updateDetail(key, Number.isNaN(parsedValue) ? 0 : parsedValue);
  };

  return (
    <SidebarBlock title="매물 상세" contentClassName="mt-5">
      <div className="flex flex-col gap-[18px]">
        {apartment.img ? (
          <img
            src={apartment.img}
            alt={`${apartment.apartmentName} 평면도`}
            className="h-[180px] w-full rounded-md bg-white object-cover"
          />
        ) : (
          <div className="flex h-[180px] items-center justify-center rounded-md bg-white text-[13px] font-medium tracking-[-0.025em] text-[#8D8D8D]">
            평면도 이미지
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-medium tracking-[-0.025em] text-[#1B1B1B]">
            위치/구조
          </h4>

          <FieldRow>
            <Field label="층">
              <SidebarInput defaultValue="3층" />
            </Field>
            <Field label="고/중/저">
              <SidebarSelect
                value={propertyDetail.floorLevel}
                options={floorLevelOptions}
                onChange={(value) =>
                  updateDetail(
                    "floorLevel",
                    value as PropertyDetailInfo["floorLevel"],
                  )
                }
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="방수">
              <SidebarInput
                type="number"
                value={propertyDetail.roomCount}
                onChange={(event) =>
                  updateNumberDetail("roomCount", event.target.value)
                }
              />
            </Field>
            <Field label="욕실수">
              <SidebarInput
                type="number"
                value={propertyDetail.bathroomCount}
                onChange={(event) =>
                  updateNumberDetail("bathroomCount", event.target.value)
                }
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="방향">
              <SidebarSelect
                value={propertyDetail.direction}
                options={directionOptions}
                onChange={(value) =>
                  updateDetail(
                    "direction",
                    value as PropertyDetailInfo["direction"],
                  )
                }
              />
            </Field>
            <Field label="방향기준">
              <SidebarSelect
                value={propertyDetail.directionBase}
                options={directionBaseOptions}
                onChange={(value) =>
                  updateDetail(
                    "directionBase",
                    value as PropertyDetailInfo["directionBase"],
                  )
                }
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="총 주차대수">
              <SidebarInput
                type="number"
                value={propertyDetail.totalParking}
                onChange={(event) =>
                  updateNumberDetail("totalParking", event.target.value)
                }
              />
            </Field>
            <Field label="세대당 주차대수">
              <SidebarInput
                type="number"
                value={propertyDetail.parkingPerHousehold}
                onChange={(event) =>
                  updateNumberDetail("parkingPerHousehold", event.target.value)
                }
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="내부 구조">
              <SidebarSelect
                value={propertyDetail.structureType}
                options={structureTypeOptions}
                onChange={(value) =>
                  updateDetail(
                    "structureType",
                    value as PropertyDetailInfo["structureType"],
                  )
                }
              />
            </Field>
            <Field label="현관구조">
              <SidebarSelect
                value={propertyDetail.entranceType}
                options={entranceTypeOptions}
                onChange={(value) =>
                  updateDetail(
                    "entranceType",
                    value as PropertyDetailInfo["entranceType"],
                  )
                }
              />
            </Field>
          </FieldRow>

          <Field label="건축물 주용도">
            <SidebarSelect
              value={propertyDetail.mainUsage}
              options={mainUsageOptions}
              onChange={(value) =>
                updateDetail(
                  "mainUsage",
                  value as PropertyDetailInfo["mainUsage"],
                )
              }
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-medium tracking-[-0.025em] text-[#1B1B1B]">
            매물 사진
          </h4>
          <UploadDropzone />
          <PhotoStrip />
        </div>
      </div>
    </SidebarBlock>
  );
}
