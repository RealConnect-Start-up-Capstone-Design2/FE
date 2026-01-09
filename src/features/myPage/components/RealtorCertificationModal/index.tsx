import { useState, useEffect } from "react";
import { ModalHeader } from "@/components/common/ModalHeader";
import { CertificationFormSection } from "./CertificationFormSection";
import { ActionButtons } from "./ActionButtons";
import {
  submitOfficeForm,
  type SubmitOfficeFormRequest,
} from "@/shared/api/mypage";

interface RealtorCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName?: string;
  onProfileUpdated?: () => void;
}

export function RealtorCertificationModal({
  isOpen,
  onClose,
  profileName,
  onProfileUpdated,
}: RealtorCertificationModalProps) {
  const [formData, setFormData] = useState({
    representativeName: "",
    address1: "",
    address2: "",
    address3: "",
    officeName: "",
    officePhone: "",
    businessNumber: "",
    registrationNumber: "",
    sigunguCode: "",
    roadNameAddressCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        representativeName: profileName || "",
        address1: "",
        address2: "",
        address3: "",
        officeName: "",
        officePhone: "",
        businessNumber: "",
        registrationNumber: "",
        sigunguCode: "",
        roadNameAddressCode: "",
      });
    }
  }, [isOpen, profileName]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const normalizeString = (str: string): string => {
    return str.trim();
  };

  const normalizeBusinessNo = (businessNo: string): string => {
    const normalized = businessNo.replace(/[^0-9]/g, "");
    if (normalized.length !== 10) {
      throw new Error("사업자등록번호는 10자리 숫자여야 합니다.");
    }
    return normalized;
  };

  const normalizePhone = (phone: string): string => {
    return phone.replace(/-/g, "");
  };

  const handleSubmit = async () => {
    try {
      if (!formData.officeName.trim()) {
        alert("상호명을 입력해주세요.");
        return;
      }
      if (!formData.officePhone.trim()) {
        alert("사업장 대표 전화번호를 입력해주세요.");
        return;
      }
      if (!formData.businessNumber.trim()) {
        alert("사업자 등록번호를 입력해주세요.");
        return;
      }
      if (!formData.registrationNumber.trim()) {
        alert("중개사무소 개설 등록번호를 입력해주세요.");
        return;
      }
      if (!formData.address1.trim()) {
        alert("중개사무소 주소를 입력해주세요.");
        return;
      }
      if (!formData.sigunguCode) {
        alert("주소 검색을 통해 시군구 코드를 가져와주세요.");
        return;
      }

      setIsSubmitting(true);

      const submitData: SubmitOfficeFormRequest = {
        businessName: normalizeString(formData.officeName),
        businessNo: normalizeBusinessNo(formData.businessNumber),
        officeNo: normalizeString(formData.registrationNumber),
        officePhone: normalizePhone(normalizeString(formData.officePhone)),
        sigunguCode: formData.sigunguCode,
        roadNameAddress: normalizeString(formData.address1),
        roadNameAddressCode: formData.roadNameAddressCode || "",
        jibunAddress: normalizeString(formData.address2),
        addressDetail: normalizeString(formData.address3),
      };

      await submitOfficeForm(submitData);
      alert("인증 폼이 성공적으로 제출되었습니다.");
      onClose();
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    } catch (error) {
      const apiError = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            code?: string;
            errors?: unknown[];
          };
        };
        message?: string;
      };

      let errorMessage = "인증 폼 제출에 실패했습니다. 다시 시도해주세요.";

      if (apiError.response?.status === 409) {
        errorMessage =
          apiError.response.data?.message ||
          "이미 인증 요청이 진행 중이거나 완료된 상태입니다.";
      } else if (apiError.response?.status === 503) {
        errorMessage = "서버가 바쁩니다. 잠시 후 다시 시도해주세요.";
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#B1B6C7]/40" onClick={onClose} />

      <div className="relative z-[101] w-[586px] h-[calc(100vh-80px)] bg-white rounded-lg border border-[#DDE2F2] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)] flex flex-col overflow-hidden my-[40px]">
        <div className="flex-1 overflow-y-auto">
          <div className="p-[40px]">
            <ModalHeader
              title="중개사 회원 인증"
              description="사업자 정보를 통해 중개사 회원 자격을 인증하세요"
              onClose={onClose}
            />

            <CertificationFormSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ActionButtons
              onClose={onClose}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
