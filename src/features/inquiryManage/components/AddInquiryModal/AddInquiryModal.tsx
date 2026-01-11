import { cn } from "@/shared/utils";
import { Label, DropdownMenu, Textarea, Input } from "@/components/ui";
import type { AddInquiryModalProps, InquirerRelation } from "./types";
import { useAddInquiryModal } from "./useAddInquiryModal";
import type { PropertyType, InquiryRequestType } from "../../types/inquiry";

// 이미지 불러오기
import RefreshIcon from "@/assets/Refresh.svg";

// 유형 옵션
// TODO: 추후 constants로 분리
const requestTypeOptions: { label: string; value: InquiryRequestType }[] = [
  { label: "매수", value: "SALE" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY" },
];

// 물건 종류 옵션
const propertyTypeOptions: { label: string; value: PropertyType }[] = [
  { label: "아파트", value: "APARTMENT" },
  { label: "오피스텔", value: "OFFICETEL" },
  { label: "상가", value: "COMMERCIAL" },
  { label: "빌라", value: "VILLA" },
];

// 문의자 관계 옵션
const relationOptions: { label: string; value: InquirerRelation }[] = [
  { label: "본인", value: "SELF" },
  { label: "부모", value: "PARENT" },
  { label: "자녀", value: "CHILD" },
  { label: "타부동산", value: "OTHER_REALTOR" },
];

// 라벨 컴포넌트
function BlackBgLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[102px] h-[50px] flex items-center justify-center bg-[#1B1B1B] rounded-md">
      <Label className="text-[15px] font-semibold text-white">{children}</Label>
    </div>
  );
}

// 면적/가격 입력 필드 (라벨 포함)
interface LabeledInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
  className,
}: LabeledInputProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label className="text-[13px] font-medium text-[#989898]">{label}</Label>
      <Label>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      </Label>
    </div>
  );
}

export function AddInquiryModal(props: AddInquiryModalProps) {
  const { isOpen } = props;

  const {
    formData,
    isSaving,
    sidoOptions,
    sigunguOptions,
    emdOptions,
    isLoadingSido,
    isLoadingSigungu,
    isLoadingEmd,
    handleFieldChange,
    toggleAreaUnit,
    handleSave,
    handleCancel,
  } = useAddInquiryModal(props);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />

      {/* Modal Content */}
      <div className="relative z-[101] w-[830px] max-h-[90vh] bg-white rounded-lg shadow-[0px_4px_25px_1px_rgba(0,0,0,0.25)] flex flex-col">
        {/* Header */}
        <div className="px-[50px] pt-[45px] pb-6">
          <h2 className="text-2xl font-semibold text-black">문의 추가</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-[50px] pt-[10px] overflow-y-auto">
          <div className="flex flex-col gap-6 pb-8">
            <div className="flex gap-8">
              {/* 유형 */}
              <div className="flex items-center gap-3">
                <BlackBgLabel>유형</BlackBgLabel>
                <DropdownMenu
                  placeholder="매수/전세/월세"
                  options={requestTypeOptions}
                  value={
                    formData.requestType === "NONE" ? "" : formData.requestType
                  }
                  onChange={(v) =>
                    handleFieldChange("requestType", v as InquiryRequestType)
                  }
                  className="w-[180px]"
                />
              </div>

              {/* 물건 종류 */}
              <div className="flex items-center gap-3">
                <BlackBgLabel>물건 종류</BlackBgLabel>
                <DropdownMenu
                  placeholder="아파트"
                  options={propertyTypeOptions}
                  value={formData.propertyType}
                  onChange={(v) =>
                    handleFieldChange("propertyType", v as PropertyType)
                  }
                  className="w-[180px]"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BlackBgLabel>문의자</BlackBgLabel>
              <div className="flex flex-col gap-3">
                {/* 문의자 1 */}
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="문의자1"
                    value={formData.inquirer1Name}
                    onChange={(e) =>
                      handleFieldChange("inquirer1Name", e.target.value)
                    }
                    className="w-[120px]"
                  />
                  <DropdownMenu
                    placeholder="관계1"
                    options={relationOptions}
                    value={formData.inquirer1Relation}
                    onChange={(v) =>
                      handleFieldChange(
                        "inquirer1Relation",
                        v as InquirerRelation
                      )
                    }
                    className="w-[119px]"
                  />
                  <Input
                    placeholder="연락처1"
                    value={formData.inquirer1Phone}
                    onChange={(e) =>
                      handleFieldChange("inquirer1Phone", e.target.value)
                    }
                    className="w-[252px]"
                    type="tel"
                  />
                </div>
                {/* 문의자 2 */}
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="문의자2"
                    value={formData.inquirer2Name}
                    onChange={(e) =>
                      handleFieldChange("inquirer2Name", e.target.value)
                    }
                    className="w-[120px]"
                  />
                  <DropdownMenu
                    placeholder="관계2"
                    options={relationOptions}
                    value={formData.inquirer2Relation}
                    onChange={(v) =>
                      handleFieldChange(
                        "inquirer2Relation",
                        v as InquirerRelation
                      )
                    }
                    className="w-[119px]"
                  />
                  <Input
                    placeholder="연락처2"
                    value={formData.inquirer2Phone}
                    onChange={(e) =>
                      handleFieldChange("inquirer2Phone", e.target.value)
                    }
                    className="w-[252px]"
                    type="tel"
                  />
                </div>
                {/* 안내 문구 */}
                <div className="flex items-center gap-1.5 text-[13px] text-[#989898]">
                  <div className="w-[13px] h-[13px] rounded-full bg-[#D9D9D9] flex items-center justify-center">
                    <span className="text-[9px] font-semibold text-[#989898]">
                      i
                    </span>
                  </div>
                  <span>문의자 정보는 공동중개 등록 시 노출되지 않습니다</span>
                </div>
                {/* 문의자 주소 */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-medium text-[#8D8D8D]">
                    문의자 주소
                  </span>
                  <Input
                    placeholder="직접 입력"
                    value={formData.inquirerAddress}
                    onChange={(e) =>
                      handleFieldChange("inquirerAddress", e.target.value)
                    }
                    className="w-[404px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BlackBgLabel>지역</BlackBgLabel>
              <DropdownMenu
                placeholder="시/도"
                options={sidoOptions}
                value={formData.sido}
                onChange={(v) => handleFieldChange("sido", v)}
                className="w-[120px]"
                disabled={isLoadingSido}
              />
              <DropdownMenu
                placeholder="시/군/구"
                options={sigunguOptions}
                value={formData.sigungu}
                onChange={(v) => handleFieldChange("sigungu", v)}
                className="w-[120px]"
                disabled={!formData.sido || isLoadingSigungu}
              />
              <DropdownMenu
                placeholder="읍/면/동"
                options={emdOptions}
                value={formData.eupmyeondong}
                onChange={(v) => handleFieldChange("eupmyeondong", v)}
                className="w-[120px]"
                disabled={!formData.sigungu || isLoadingEmd}
              />
              <Input
                placeholder="단지명 (직접 입력)"
                value={formData.complexName}
                onChange={(e) =>
                  handleFieldChange("complexName", e.target.value)
                }
                className="w-[220px]"
              />
            </div>

            <div className="flex items-end gap-3">
              <BlackBgLabel>
                {formData.isAreaInPyeong ? "평" : "면적"}
              </BlackBgLabel>
              <LabeledInput
                label={formData.isAreaInPyeong ? "평1" : "면적1"}
                placeholder={formData.isAreaInPyeong ? "평1" : "㎡"}
                value={formData.area1}
                onChange={(v) => handleFieldChange("area1", v)}
                className="w-[186px]"
              />
              <LabeledInput
                label={formData.isAreaInPyeong ? "평2" : "면적2"}
                placeholder={formData.isAreaInPyeong ? "평2" : "㎡"}
                value={formData.area2}
                onChange={(v) => handleFieldChange("area2", v)}
                className="w-[186px]"
              />
              {/* 단위 변환 버튼 */}
              <button
                type="button"
                onClick={toggleAreaUnit}
                className="w-[50px] h-[50px] flex items-center justify-center bg-[#EDEDED] rounded-md hover:bg-[#E0E0E0] transition-colors"
                title={
                  formData.isAreaInPyeong ? "면적(㎡)으로 전환" : "평으로 전환"
                }
              >
                <img
                  src={RefreshIcon}
                  alt="단위 변환"
                  className="w-[18px] h-[18px]"
                />
              </button>
            </div>

            <div className="flex items-end gap-3 flex-wrap">
              <BlackBgLabel>가격</BlackBgLabel>
              <div className="flex gap-3">
                <LabeledInput
                  label="매수가1"
                  placeholder="매수가1"
                  value={formData.purchasePrice1}
                  onChange={(v) => handleFieldChange("purchasePrice1", v)}
                  className="w-[186px]"
                />
                <LabeledInput
                  label="매수가2"
                  placeholder="매수가2"
                  value={formData.purchasePrice2}
                  onChange={(v) => handleFieldChange("purchasePrice2", v)}
                  className="w-[186px]"
                />
              </div>
            </div>
            <div className="flex items-end gap-3 pl-[114px] flex-wrap">
              <LabeledInput
                label="보증금1"
                placeholder="보증금1"
                value={formData.deposit1}
                onChange={(v) => handleFieldChange("deposit1", v)}
                className="w-[186px]"
              />
              <LabeledInput
                label="보증금2"
                placeholder="보증금2"
                value={formData.deposit2}
                onChange={(v) => handleFieldChange("deposit2", v)}
                className="w-[186px]"
              />
            </div>
            <div className="flex items-end gap-3 pl-[114px] flex-wrap">
              <LabeledInput
                label="월세1"
                placeholder="월세1"
                value={formData.monthlyRent1}
                onChange={(v) => handleFieldChange("monthlyRent1", v)}
                className="w-[186px]"
              />
              <LabeledInput
                label="월세2"
                placeholder="월세2"
                value={formData.monthlyRent2}
                onChange={(v) => handleFieldChange("monthlyRent2", v)}
                className="w-[186px]"
              />
            </div>

            <div className="flex items-start gap-3">
              <BlackBgLabel>메모</BlackBgLabel>
              <div className="flex-1 flex flex-col gap-3">
                {/* 문의 제목 */}
                <Input
                  placeholder="문의 제목 (40자 이하) - 공동중개 등록 시 노출되는 제목입니다"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  maxLength={40}
                  className="w-full"
                />
                {/* 문의 상세 설명 (공개) */}
                <Textarea
                  placeholder="문의 상세 설명 (공개) - 공동중개 등록 시 노출되는 설명입니다"
                  value={formData.publicDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleFieldChange("publicDescription", e.target.value)
                  }
                />
                {/* 중개사 상담 내용 (비공개) */}
                <Textarea
                  placeholder="중개사 상담 내용 (비공개) - 공동중개 등록 시 노출되지 않는 내용입니다"
                  value={formData.privateNote}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleFieldChange("privateNote", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-[50px] py-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="w-[97px] h-[44px] bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-[97px] h-[44px] bg-[#1C2882] text-white rounded-lg text-lg font-semibold hover:bg-[#151d66] transition-colors disabled:opacity-50"
          >
            {isSaving ? "저장중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
