import { useState, useEffect } from "react";
import { ModalHeader } from "@/shared/components/ModalHeader";
import { ProfileImageSection } from "./ProfileImageSection";
import { ProfileFormSection } from "./ProfileFormSection";
import { SaveButton } from "./SaveButton";
import { Divider } from "./Divider";
import { PasswordChangeSection } from "./PasswordChangeSection";
import { OfficeInfoSection } from "./OfficeInfoSection";
import { fetchProfile, updateOwnerProfile } from "@/shared/api/mypage";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    blogLink: "",
    homepage: "",
    officeName: "",
    address: "",
    officePhone: "",
  });
  const [initialData, setInitialData] = useState({
    name: "",
    contact: "",
    email: "",
    blogLink: "",
    homepage: "",
    officeName: "",
    address: "",
    officePhone: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        try {
          const profile = await fetchProfile();
          const initial = {
            name: profile.name || "",
            contact: profile.phone || profile.contact || "",
            email: profile.email || "",
            blogLink: profile.blogUrl || profile.blogLink || "",
            homepage: profile.homepageUrl || profile.homepage || "",
            officeName: profile.officeName || "",
            address: profile.officeAddress || "",
            officePhone: profile.officePhone || "",
          };
          setFormData(initial);
          setInitialData(initial);
          setIsPhoneVerified(false);
        } catch {
          // 프로필 로드 실패 시 무시
        }
      };

      loadProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (formData.contact && formData.contact.trim().length === 0) {
      return "전화번호는 공백만 입력할 수 없습니다.";
    }
    if (formData.contact && formData.contact.trim().length < 1) {
      return "전화번호는 최소 1자 이상 입력해주세요.";
    }

    if (formData.email && formData.email.trim().length === 0) {
      return "이메일은 공백만 입력할 수 없습니다.";
    }
    if (formData.email && formData.email.trim().length < 1) {
      return "이메일은 최소 1자 이상 입력해주세요.";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "올바른 이메일 형식을 입력해주세요.";
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const updateData: {
      phone?: string;
      email?: string;
      blogUrl?: string;
      homepageUrl?: string;
    } = {};

    if (formData.contact !== initialData.contact) {
      if (isPhoneVerified) {
        updateData.phone = formData.contact;
      } else {
        alert("전화번호를 변경하려면 인증이 필요합니다.");
        return;
      }
    }

    if (formData.email !== initialData.email) {
      updateData.email = formData.email;
    }

    if (formData.blogLink !== initialData.blogLink) {
      updateData.blogUrl = formData.blogLink;
    }

    if (formData.homepage !== initialData.homepage) {
      updateData.homepageUrl = formData.homepage;
    }

    if (Object.keys(updateData).length === 0) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      await updateOwnerProfile(updateData);
      alert("프로필이 성공적으로 수정되었습니다.");
      onClose();
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    } catch {
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#B1B6C7]/40" onClick={onClose} />

      <div className="relative z-[101] w-[750px] h-[calc(100vh-32px)] bg-white rounded-lg shadow-[0px_4px_25px_1px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-[50px]">
            <ModalHeader title="프로필 수정" onClose={onClose} />

            <div className="flex flex-row gap-[40px]">
              <ProfileFormSection
                formData={formData}
                onInputChange={handleInputChange}
                onPhoneVerified={() => setIsPhoneVerified(true)}
                isModalOpen={isOpen}
              />
              <ProfileImageSection />
            </div>

            <div className="mb-[50px]">
              <SaveButton onClick={handleSave} isLoading={isSaving} />
            </div>

            <Divider />

            <PasswordChangeSection />

            <div className="mt-[50px]">
              <Divider />
            </div>

            <OfficeInfoSection
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
