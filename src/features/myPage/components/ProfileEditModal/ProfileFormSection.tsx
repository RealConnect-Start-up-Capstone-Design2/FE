import { FormField } from "@/shared/ui/form-field";
import { VerificationButton } from "./VerificationButton";
import { Button } from "@/shared/ui/button";
import { INPUT_STYLE, LABEL_STYLE } from "./constants";
import { formatPhoneNumber } from "@/shared/utils";
import { useState, useEffect } from "react";
import {
  sendPhoneVerificationCode,
  verifyPhoneCode,
} from "@/shared/api/mypage";

interface ProfileFormSectionProps {
  formData: {
    name: string;
    contact: string;
    email: string;
    blogLink: string;
    homepage: string;
  };
  onInputChange: (field: string, value: string) => void;
  onPhoneVerified?: () => void;
  isModalOpen?: boolean;
}

export function ProfileFormSection({
  formData,
  onInputChange,
  onPhoneVerified,
  isModalOpen,
}: ProfileFormSectionProps) {
  const [displayContact, setDisplayContact] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    setDisplayContact(formatPhoneNumber(formData.contact) || "");
  }, [formData.contact]);

  useEffect(() => {
    if (isModalOpen) {
      setIsPhoneVerified(false);
      setIsCodeSent(false);
      setCountdown(60);
      setVerificationCode("");
      setVerificationError("");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isCodeSent && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsCodeSent(false);
      setCountdown(60);
    }
  }, [isCodeSent, countdown]);

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendVerificationCode = async () => {
    if (!formData.contact || formData.contact.trim().length === 0) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    const phoneDigits = formData.contact.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 10) {
      alert("올바른 전화번호를 입력해주세요.");
      return;
    }

    try {
      setIsSendingCode(true);
      setVerificationError("");
      const response = await sendPhoneVerificationCode(formData.contact);
      if (response.success) {
        setIsCodeSent(true);
        setCountdown(60);
        setVerificationCode("");
      } else {
        alert(response.message || "인증 코드 발송에 실패했습니다.");
      }
    } catch {
      alert("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError("인증번호를 입력해주세요.");
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationError("");
      await verifyPhoneCode(formData.contact, verificationCode.trim());
      setIsCodeSent(false);
      setCountdown(60);
      setVerificationCode("");
      setIsPhoneVerified(true);
      if (onPhoneVerified) {
        onPhoneVerified();
      }
      alert("인증이 완료되었습니다.");
    } catch {
      setVerificationError("인증번호가 일치하지 않습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-[30px]">
      <FormField
        label="이름"
        name="name"
        value={formData.name}
        onChange={onInputChange}
        disabled={true}
        className="w-full"
      />
      <div className="flex flex-col gap-[12px]">
        <label className={LABEL_STYLE}>연락처</label>
        <div className="flex gap-[12px]">
          <input
            type="text"
            value={displayContact}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              onInputChange("contact", value);
            }}
            placeholder="010-1234-5678"
            className={`flex-1 ${INPUT_STYLE}`}
          />
          {!isPhoneVerified && (
            <VerificationButton
              onClick={handleSendVerificationCode}
              disabled={isSendingCode}
              isCodeSent={isCodeSent}
              countdown={formatCountdown(countdown)}
            />
          )}
        </div>
        {isCodeSent && (
          <div className="flex flex-col gap-[8px]">
            <div className="flex gap-[12px]">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setVerificationError("");
                }}
                placeholder="인증번호 입력"
                className={`flex-1 ${INPUT_STYLE}`}
              />
              <Button
                onClick={handleVerifyCode}
                disabled={isVerifying}
                className="w-[94px] h-[38px] rounded-md bg-[#1C2882] text-white text-[15px] font-semibold hover:bg-[#1C2882] disabled:opacity-50"
              >
                {isVerifying ? "확인 중..." : "확인"}
              </Button>
            </div>
            {verificationError && (
              <p className="text-[12px] font-medium text-[#FF4545]">
                {verificationError}
              </p>
            )}
          </div>
        )}
      </div>
      <FormField
        label="이메일"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        type="email"
        className="w-full"
      />
      <FormField
        label="블로그 링크"
        name="blogLink"
        value={formData.blogLink}
        onChange={onInputChange}
        className="w-full"
      />
      <FormField
        label="중개사 홈페이지"
        name="homepage"
        value={formData.homepage}
        onChange={onInputChange}
        className="w-full"
      />
    </div>
  );
}
