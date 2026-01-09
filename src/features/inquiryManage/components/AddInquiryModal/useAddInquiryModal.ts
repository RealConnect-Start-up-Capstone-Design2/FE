import { useState, useEffect, useCallback } from "react";
import type { AddInquiryFormData, RegionOption } from "./types";
import {
  fetchSidoList,
  fetchSigunguList,
  fetchEmdList,
} from "@/shared/api/region";
import type { Sido, Sigungu, Emd } from "@/shared/api/region";

interface UseAddInquiryModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddInquiryFormData) => Promise<void>;
}

const initialFormData: AddInquiryFormData = {
  requestType: "NONE",
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

  // 지역 옵션 상태
  const [sidoOptions, setSidoOptions] = useState<RegionOption[]>([]);
  const [sigunguOptions, setSigunguOptions] = useState<RegionOption[]>([]);
  const [emdOptions, setEmdOptions] = useState<RegionOption[]>([]);

  // 로딩 상태
  const [isLoadingSido, setIsLoadingSido] = useState(false);
  const [isLoadingSigungu, setIsLoadingSigungu] = useState(false);
  const [isLoadingEmd, setIsLoadingEmd] = useState(false);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setSigunguOptions([]);
      setEmdOptions([]);
    }
  }, [isOpen]);

  // 시/도 목록 로드
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadSidoOptions = async () => {
      setIsLoadingSido(true);
      try {
        const data = await fetchSidoList();
        if (!isMounted) return;

        const options = data.map(
          (sido: Sido): RegionOption => ({
            label: sido.name_kr,
            value: sido.sidoCode,
          })
        );
        setSidoOptions(options);
      } catch (error) {
        console.error("시/도 목록 조회 실패:", error);
      } finally {
        if (isMounted) setIsLoadingSido(false);
      }
    };

    void loadSidoOptions();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // 시/군/구 목록 로드 (시/도 변경 시)
  useEffect(() => {
    if (!formData.sido) {
      setSigunguOptions([]);
      return;
    }

    let isMounted = true;

    const loadSigunguOptions = async () => {
      setIsLoadingSigungu(true);
      try {
        const data = await fetchSigunguList(formData.sido);
        if (!isMounted) return;

        const options = data.map(
          (sigungu: Sigungu): RegionOption => ({
            label: sigungu.name_kr,
            value: sigungu.sigunguCode,
          })
        );
        setSigunguOptions(options);
      } catch (error) {
        console.error("시/군/구 목록 조회 실패:", error);
      } finally {
        if (isMounted) setIsLoadingSigungu(false);
      }
    };

    void loadSigunguOptions();

    return () => {
      isMounted = false;
    };
  }, [formData.sido]);

  // 읍/면/동 목록 로드 (시/군/구 변경 시)
  useEffect(() => {
    if (!formData.sigungu) {
      setEmdOptions([]);
      return;
    }

    let isMounted = true;

    const loadEmdOptions = async () => {
      setIsLoadingEmd(true);
      try {
        const data = await fetchEmdList(formData.sigungu);
        if (!isMounted) return;

        const options = data.map(
          (emd: Emd): RegionOption => ({
            label: emd.name_kr,
            value: emd.emdCode,
          })
        );
        setEmdOptions(options);
      } catch (error) {
        console.error("읍/면/동 목록 조회 실패:", error);
      } finally {
        if (isMounted) setIsLoadingEmd(false);
      }
    };

    void loadEmdOptions();

    return () => {
      isMounted = false;
    };
  }, [formData.sigungu]);

  // 폼 필드 변경 핸들러
  const handleFieldChange = useCallback(
    <K extends keyof AddInquiryFormData>(
      field: K,
      value: AddInquiryFormData[K]
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
    []
  );

  // 면적 단위 토글
  const toggleAreaUnit = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isAreaInPyeong: !prev.isAreaInPyeong,
      // 값은 유지하고 단위만 변경
    }));
  }, []);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    // 기본 유효성 검사
    if (!formData.requestType || formData.requestType === "NONE") {
      alert("유형을 선택해주세요.");
      return;
    }

    if (!formData.title.trim()) {
      alert("문의 제목을 입력해주세요.");
      return;
    }

    if (formData.title.length > 40) {
      alert("문의 제목은 40자 이하로 입력해주세요.");
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
