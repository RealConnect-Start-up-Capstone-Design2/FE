import { useState } from "react";
import { ModalHeader } from "./ModalHeader";
import { CertificationFormSection } from "./CertificationFormSection";
import { ActionButtons } from "./ActionButtons";

interface RealtorCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RealtorCertificationModal({
  isOpen,
  onClose,
}: RealtorCertificationModalProps) {
  const [formData, setFormData] = useState({
    representativeName: "최정현",
    address1: "",
    address2: "",
    address3: "",
    officeName: "",
    officePhone: "",
    businessNumber: "",
    registrationNumber: "",
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // 제출 로직
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#B1B6C7]/40" onClick={onClose} />

      <div className="relative z-[101] w-[586px] h-[calc(100vh-80px)] bg-white rounded-lg border border-[#DDE2F2] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)] flex flex-col overflow-hidden my-[40px]">
        <div className="flex-1 overflow-y-auto">
          <div className="p-[40px]">
            <ModalHeader onClose={onClose} />

            <CertificationFormSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ActionButtons onClose={onClose} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

