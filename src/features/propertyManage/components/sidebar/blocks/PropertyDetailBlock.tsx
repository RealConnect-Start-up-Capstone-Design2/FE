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
import {
  DIRECTION_LABELS,
  directionOptions,
  type ApartmentWithProperty,
} from "../../../types";

interface PropertyDetailBlockProps {
  apartment?: ApartmentWithProperty;
  isOpen: boolean;
}

/**
 * 매물 상세 블록
 */
export function PropertyDetailBlock({ apartment }: PropertyDetailBlockProps) {
  if (!apartment) {
    return (
      <SidebarBlock title="매물 상세">
        <EmptyBlockState />
      </SidebarBlock>
    );
  }

  const directionLabel = DIRECTION_LABELS[apartment.direction] ?? "선택";

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
                value="middle"
                options={[
                  { label: "고", value: "high" },
                  { label: "중", value: "middle" },
                  { label: "저", value: "low" },
                ]}
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="방수">
              <SidebarInput placeholder="1개" />
            </Field>
            <Field label="욕실수">
              <SidebarInput defaultValue="2개" />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="방향">
              <SidebarSelect
                placeholder={directionLabel || "선택"}
                value={apartment.direction}
                options={directionOptions}
              />
            </Field>
            <Field label="방향기준">
              <SidebarSelect
                value="living"
                options={[
                  { label: "거실", value: "living" },
                  { label: "안방", value: "main_room" },
                  { label: "주방", value: "kitchen" },
                ]}
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="총 주차대수">
              <SidebarInput defaultValue="123대" />
            </Field>
            <Field label="세대당 주차대수">
              <SidebarInput defaultValue="1.82대" />
            </Field>
          </FieldRow>

          <Field label="냉난방구조">
            <SidebarSelect
              value="individual"
              options={[
                { label: "개별난방", value: "individual" },
                { label: "중앙난방", value: "central" },
                { label: "지역난방", value: "district" },
              ]}
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
