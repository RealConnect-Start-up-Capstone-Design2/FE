import { useState } from "react";
import { ModalHeader } from "./ModalHeader";
import { ProfileImageSection } from "./ProfileImageSection";
import { ProfileFormSection } from "./ProfileFormSection";
import { SaveButton } from "./SaveButton";
import { Divider } from "./Divider";
import { PasswordChangeSection } from "./PasswordChangeSection";
import { OfficeInfoSection } from "./OfficeInfoSection";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: "최정현",
    contact: "010-1234-2334",
    email: "kim@example.com",
    blogLink: "naver.blog.com/realconnect",
    homepage: "realconnect.co.kr",
    officeName: "리얼커넥트 부동산",
    address1: "도로명 주소로 검색",
    address2: "검색 결과 선택한 값 매핑",
    address3: "상세주소 입력",
    officePhone: "02-1111-1111",
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#B1B6C7]/40" onClick={onClose} />

      <div className="relative z-[101] w-[750px] h-[calc(100vh-32px)] bg-white rounded-lg shadow-[0px_4px_25px_1px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-[50px]">
            <ModalHeader onClose={onClose} />

            <div className="flex flex-row gap-[40px]">
              <ProfileFormSection
                formData={formData}
                onInputChange={handleInputChange}
              />
              <ProfileImageSection />
            </div>

            <div className="mb-[50px]">
              <SaveButton onClick={handleSave} />
            </div>

            <Divider />

            <PasswordChangeSection />

            <div className="mt-[50px]">
              <Divider />
            </div>

            <OfficeInfoSection
              formData={formData}
              onInputChange={handleInputChange}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

