import { useEffect, useId, useRef } from "react";

import { isDemoRuntime } from "@/demo/session";
import { cn } from "@/shared/utils";
import { Label, DropdownMenu, Textarea, Input } from "@/shared/ui";
import type { AddInquiryModalProps, InquirerRelation } from "./types";
import {
  formatNumericInput,
  normalizeDecimalInput,
  normalizeNumericInput,
} from "./formUtils";
import { useAddInquiryModal } from "./useAddInquiryModal";
import type { PropertyType, RequestType } from "../../types/inquiry";

// 이미지 불러오기
import RefreshIcon from "@/assets/Refresh.svg";

// 유형 옵션
const requestTypeOptions: { label: string; value: RequestType }[] = [
  { label: "매수", value: "SALE" },
  { label: "전세", value: "JEONSE" },
  { label: "월세", value: "MONTHLY" },
];

// 물건 종류 옵션
const propertyTypeOptions: { label: string; value: PropertyType }[] = [
  { label: "아파트", value: "APARTMENT" },
];

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

// 문의자 관계 옵션
const relationOptions: { label: string; value: InquirerRelation }[] = [
  { label: "본인", value: "SELF" },
  { label: "부모", value: "PARENTS" },
  { label: "자녀", value: "CHILDREN" },
  { label: "기타", value: "OTHER" },
];

// 라벨 컴포넌트
function BlackBgLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-11 w-full shrink-0 items-center justify-center rounded-md bg-[#1B1B1B] sm:h-[50px] sm:w-[102px]">
      <Label className="text-[15px] font-semibold text-white">{children}</Label>
    </div>
  );
}

// 면적/가격 입력 필드 (라벨 포함)
interface LabeledInputProps {
  kind: "area" | "money";
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function LabeledInput({
  kind,
  label,
  placeholder,
  value,
  onChange,
  className,
}: LabeledInputProps) {
  const inputId = useId();

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label
        htmlFor={inputId}
        className="text-[13px] font-medium text-[#989898]"
      >
        {label}
      </Label>
      <Input
        id={inputId}
        type="text"
        inputMode={kind === "area" ? "decimal" : "numeric"}
        pattern={kind === "area" ? "[0-9,.]*" : "[0-9,]*"}
        placeholder={placeholder}
        value={formatNumericInput(value)}
        onChange={(event) =>
          onChange(
            kind === "area"
              ? normalizeDecimalInput(event.target.value)
              : normalizeNumericInput(event.target.value),
          )
        }
        className={className}
      />
    </div>
  );
}

export function AddInquiryModal(props: AddInquiryModalProps) {
  const { isOpen } = props;
  const demoRuntime = isDemoRuntime();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const moveInById = useId();

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

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getClientRects().length > 0);

      if (focusableElements.length === 0) {
        event.preventDefault();
        modalRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === firstElement ||
          !modalRef.current.contains(activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === lastElement ||
          !modalRef.current.contains(activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [handleCancel, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/50"
        onClick={handleCancel}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-[101] flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[830px] flex-col rounded-lg bg-white shadow-[0px_4px_25px_1px_rgba(0,0,0,0.25)] sm:max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 pb-4 pt-5 sm:px-[50px] sm:pb-6 sm:pt-[45px]">
          <h2 id={titleId} className="text-2xl font-semibold text-black">
            문의 추가
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pt-[10px] sm:px-[50px]">
          <div className="flex flex-col gap-6 pb-8">
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
              {/* 유형 */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <BlackBgLabel>유형</BlackBgLabel>
                <DropdownMenu
                  placeholder="매수/전세/월세"
                  options={requestTypeOptions}
                  value={formData.requestType}
                  onChange={(v) =>
                    handleFieldChange("requestType", v as RequestType)
                  }
                  className="w-full sm:w-[180px]"
                />
              </div>

              {/* 물건 종류 */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <BlackBgLabel>물건 종류</BlackBgLabel>
                <div className="w-full sm:w-[180px]">
                  <DropdownMenu
                    placeholder="아파트"
                    options={propertyTypeOptions}
                    value={formData.propertyType}
                    onChange={(v) =>
                      handleFieldChange("propertyType", v as PropertyType)
                    }
                    className="w-full"
                  />
                  <p className="mt-1.5 text-xs leading-5 text-[#747B8C]">
                    포트폴리오 데모는 아파트 문의를 지원합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
              <BlackBgLabel>문의자</BlackBgLabel>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {/* 문의자 1 */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[120px_119px_minmax(180px,1fr)]">
                  <Input
                    ref={firstInputRef}
                    placeholder="문의자1"
                    aria-label="문의자1 이름"
                    aria-required="true"
                    required
                    value={formData.inquirer1Name}
                    onChange={(e) =>
                      handleFieldChange("inquirer1Name", e.target.value)
                    }
                    className="w-full"
                  />
                  <DropdownMenu
                    placeholder="관계1"
                    options={relationOptions}
                    value={formData.inquirer1Relation}
                    onChange={(v) =>
                      handleFieldChange(
                        "inquirer1Relation",
                        v as InquirerRelation,
                      )
                    }
                    className="w-full"
                  />
                  <Input
                    placeholder="연락처1"
                    aria-label="문의자1 연락처"
                    aria-required="true"
                    required
                    value={formData.inquirer1Phone}
                    onChange={(e) =>
                      handleFieldChange("inquirer1Phone", e.target.value)
                    }
                    className="w-full"
                    type="tel"
                  />
                </div>
                {demoRuntime ? (
                  <p className="text-[13px] leading-5 text-[#747B8C]">
                    샘플 데모는 문의자 1명만 저장합니다.
                  </p>
                ) : (
                  <>
                    {/* 문의자 2 */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[120px_119px_minmax(180px,1fr)]">
                      <Input
                        placeholder="문의자2"
                        aria-label="문의자2 이름"
                        value={formData.inquirer2Name}
                        onChange={(e) =>
                          handleFieldChange("inquirer2Name", e.target.value)
                        }
                        className="w-full"
                      />
                      <DropdownMenu
                        placeholder="관계2"
                        options={relationOptions}
                        value={formData.inquirer2Relation}
                        onChange={(v) =>
                          handleFieldChange(
                            "inquirer2Relation",
                            v as InquirerRelation,
                          )
                        }
                        className="w-full"
                      />
                      <Input
                        placeholder="연락처2"
                        aria-label="문의자2 연락처"
                        value={formData.inquirer2Phone}
                        onChange={(e) =>
                          handleFieldChange("inquirer2Phone", e.target.value)
                        }
                        className="w-full"
                        type="tel"
                      />
                    </div>
                    {/* 안내 문구 */}
                    <div className="flex items-center gap-1.5 text-[13px] text-[#989898]">
                      <div className="flex h-[13px] w-[13px] items-center justify-center rounded-full bg-[#D9D9D9]">
                        <span className="text-[9px] font-semibold text-[#989898]">
                          i
                        </span>
                      </div>
                      <span>
                        문의자 정보는 공동중개 등록 시 노출되지 않습니다
                      </span>
                    </div>
                    {/* 문의자 주소 */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[13px] font-medium text-[#8D8D8D]">
                        문의자 주소
                      </span>
                      <Input
                        placeholder="직접 입력"
                        aria-label="문의자 주소"
                        value={formData.inquirerAddress}
                        onChange={(e) =>
                          handleFieldChange("inquirerAddress", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <BlackBgLabel>지역</BlackBgLabel>
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[120px_120px_120px_minmax(180px,1fr)]">
                <DropdownMenu
                  placeholder="시/도"
                  options={sidoOptions}
                  value={formData.sido}
                  onChange={(v) => handleFieldChange("sido", v)}
                  className="w-full"
                  disabled={isLoadingSido}
                />
                <DropdownMenu
                  placeholder="시/군/구"
                  options={sigunguOptions}
                  value={formData.sigungu}
                  onChange={(v) => handleFieldChange("sigungu", v)}
                  className="w-full"
                  disabled={!formData.sido || isLoadingSigungu}
                />
                <DropdownMenu
                  placeholder="읍/면/동"
                  options={emdOptions}
                  value={formData.eupmyeondong}
                  onChange={(v) => handleFieldChange("eupmyeondong", v)}
                  className="w-full"
                  disabled={!formData.sigungu || isLoadingEmd}
                />
                <Input
                  placeholder="단지명 (직접 입력)"
                  aria-label="희망 단지명"
                  value={formData.complexName}
                  onChange={(e) =>
                    handleFieldChange("complexName", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <BlackBgLabel>입주 희망일</BlackBgLabel>
              <div className="w-full sm:max-w-[240px]">
                <Label htmlFor={moveInById} className="sr-only">
                  입주 희망일
                </Label>
                <Input
                  id={moveInById}
                  type="date"
                  value={formData.moveInBy}
                  onChange={(event) =>
                    handleFieldChange("moveInBy", event.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-end">
              <BlackBgLabel>
                {formData.isAreaInPyeong ? "평" : "면적"}
              </BlackBgLabel>
              <LabeledInput
                kind="area"
                label={formData.isAreaInPyeong ? "평1" : "면적1"}
                placeholder={formData.isAreaInPyeong ? "평1" : "㎡"}
                value={formData.area1}
                onChange={(v) => handleFieldChange("area1", v)}
                className="w-full lg:w-[186px]"
              />
              <LabeledInput
                kind="area"
                label={formData.isAreaInPyeong ? "평2" : "면적2"}
                placeholder={formData.isAreaInPyeong ? "평2" : "㎡"}
                value={formData.area2}
                onChange={(v) => handleFieldChange("area2", v)}
                className="w-full lg:w-[186px]"
              />
              {/* 단위 변환 버튼 */}
              <button
                type="button"
                onClick={toggleAreaUnit}
                className="flex h-[50px] w-full items-center justify-center rounded-md bg-[#EDEDED] transition-colors hover:bg-[#E0E0E0] lg:w-[50px]"
                aria-label={
                  formData.isAreaInPyeong ? "제곱미터로 변환" : "평으로 변환"
                }
                title={
                  formData.isAreaInPyeong ? "면적(㎡)으로 전환" : "평으로 전환"
                }
              >
                <img src={RefreshIcon} alt="" className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
              <BlackBgLabel>가격</BlackBgLabel>
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <LabeledInput
                  kind="money"
                  label="매수가1"
                  placeholder="매수가1"
                  value={formData.purchasePrice1}
                  onChange={(v) => handleFieldChange("purchasePrice1", v)}
                  className="w-full"
                />
                <LabeledInput
                  kind="money"
                  label="매수가2"
                  placeholder="매수가2"
                  value={formData.purchasePrice2}
                  onChange={(v) => handleFieldChange("purchasePrice2", v)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:pl-[114px]">
              <LabeledInput
                kind="money"
                label="보증금1"
                placeholder="보증금1"
                value={formData.deposit1}
                onChange={(v) => handleFieldChange("deposit1", v)}
                className="w-full"
              />
              <LabeledInput
                kind="money"
                label="보증금2"
                placeholder="보증금2"
                value={formData.deposit2}
                onChange={(v) => handleFieldChange("deposit2", v)}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:pl-[114px]">
              <LabeledInput
                kind="money"
                label="월세1"
                placeholder="월세1"
                value={formData.monthlyRent1}
                onChange={(v) => handleFieldChange("monthlyRent1", v)}
                className="w-full"
              />
              <LabeledInput
                kind="money"
                label="월세2"
                placeholder="월세2"
                value={formData.monthlyRent2}
                onChange={(v) => handleFieldChange("monthlyRent2", v)}
                className="w-full"
              />
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
              <BlackBgLabel>메모</BlackBgLabel>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {/* 문의 제목 */}
                <Input
                  placeholder="문의 제목 (40자 이하) - 공동중개 등록 시 노출되는 제목입니다"
                  aria-label="문의 제목"
                  aria-required="true"
                  required
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
        <div className="flex justify-end gap-3 px-5 py-4 sm:px-[50px] sm:py-6">
          <button
            type="button"
            onClick={handleCancel}
            className="h-11 flex-1 rounded-lg bg-black text-lg font-semibold text-white transition-colors hover:bg-gray-800 sm:w-[97px] sm:flex-none"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-11 flex-1 rounded-lg bg-[#1C2882] text-lg font-semibold text-white transition-colors hover:bg-[#151d66] disabled:opacity-50 sm:w-[97px] sm:flex-none"
          >
            {isSaving ? "저장중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
