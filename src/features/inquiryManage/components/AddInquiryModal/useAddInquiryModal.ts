import { useState, useEffect, useCallback } from "react";
import type { AddInquiryFormData } from "./types";
import { convertAreaValue, getInquiryFormValidationError } from "./formUtils";
import { useRegionOptions } from "./useRegionOptions";

interface UseAddInquiryModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddInquiryFormData) => Promise<void>;
}

const initialFormData: AddInquiryFormData = {
  requestType: "",
  propertyType: "APARTMENT",
  inquirer1Name: "",
  inquirer1Phone: "",
  inquirer1Relation: "",
  inquirer2Name: "",
  inquirer2Phone: "",
  inquirer2Relation: "",
  sido: "",
  sigungu: "",
  eupmyeondong: "",
  complexName: "",
  moveInBy: "",
  inquirerAddress: "",
  area1: "",
  area2: "",
  isAreaInPyeong: true, // 기본: 평
  purchasePrice1: "",
  purchasePrice2: "",
  deposit1: "",
  deposit2: "",
  monthlyRent1: "",
  monthlyRent2: "",
  title: "",
  publicDescription: "",
  privateNote: "",
};

export function useAddInquiryModal({
  isOpen,
  onClose,
  onSave,
}: UseAddInquiryModalParams) {
  const [formData, setFormData] = useState<AddInquiryFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  // 지역 옵션 (커스텀 훅 사용)
  const {
    sidoOptions,
    sigunguOptions,
    emdOptions,
    isLoadingSido,
    isLoadingSigungu,
    isLoadingEmd,
  } = useRegionOptions({
    isOpen,
    selectedSido: formData.sido,
    selectedSigungu: formData.sigungu,
  });

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  // 폼 필드 변경 핸들러
  const handleFieldChange = useCallback(
    <K extends keyof AddInquiryFormData>(
      field: K,
      value: AddInquiryFormData[K],
    ) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        // 지역 선택 연쇄 초기화
        if (field === "sido") {
          updated.sigungu = "";
          updated.eupmyeondong = "";
        } else if (field === "sigungu") {
          updated.eupmyeondong = "";
        }

        return updated;
      });
    },
    [],
  );

  // 면적 단위 토글
  const toggleAreaUnit = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      area1: convertAreaValue(prev.area1, prev.isAreaInPyeong),
      area2: convertAreaValue(prev.area2, prev.isAreaInPyeong),
      isAreaInPyeong: !prev.isAreaInPyeong,
    }));
  }, []);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    const validationError = getInquiryFormValidationError(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("문의 저장 실패:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, onClose]);

  // 취소 핸들러
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
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
  };
}
