import { useState, useEffect } from "react";
import LockIcon from "@/assets/Lock.svg";
import { VerificationButton } from "./VerificationButton";
import { Button } from "@/shared/ui/button";
import { INPUT_STYLE, LABEL_STYLE, SECTION_TITLE_STYLE } from "./constants";
import { formatPhoneNumber } from "@/shared/utils";
import {
  sendPasswordChangeVerificationCode,
  verifyPasswordChangeCode,
  changePassword,
} from "@/shared/api/mypage";

export function PasswordChangeSection() {
  const [phone, setPhone] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setDisplayPhone(formatPhoneNumber(phone) || "");
  }, [phone]);

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
    if (!phone || phone.trim().length === 0) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    const phoneDigits = phone.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 10) {
      alert("올바른 전화번호를 입력해주세요.");
      return;
    }

    try {
      setIsSendingCode(true);
      setVerificationError("");
      const response = await sendPasswordChangeVerificationCode(phone);
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
      await verifyPasswordChangeCode(phone, verificationCode.trim());
      setIsCodeSent(false);
      setCountdown(60);
      setVerificationCode("");
      setIsPhoneVerified(true);
      alert("인증이 완료되었습니다.");
    } catch {
      setVerificationError("인증번호가 일치하지 않습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasLetter && hasNumber && hasSpecialChar;
  };

  const handleChangePassword = async () => {
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!newPassword) {
      setNewPasswordError("새 비밀번호를 입력해주세요.");
      hasError = true;
    } else if (!validatePassword(newPassword)) {
      setNewPasswordError("8자 이상의 영문, 숫자, 특수문자를 사용해 주세요.");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("새 비밀번호 확인을 입력해주세요.");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(currentPassword, newPassword, confirmPassword);
      alert("비밀번호가 성공적으로 변경되었습니다.");
      window.location.href = "/login";
    } catch (error) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string }; status?: number };
          }
        ).response?.data?.message ||
        (error as { message?: string }).message ||
        "";
      const status = (error as { response?: { status?: number } }).response
        ?.status;
      if (
        errorMessage.includes("기존 비밀번호") ||
        errorMessage.includes("현재 비밀번호") ||
        errorMessage.includes("currentPassword") ||
        status === 400
      ) {
        setCurrentPasswordError("기존 비밀번호와 일치하지 않습니다.");
      } else {
        alert(
          errorMessage || "비밀번호 변경에 실패했습니다. 다시 시도해주세요."
        );
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mt-[50px]">
      <h3 className={SECTION_TITLE_STYLE}>비밀번호 변경</h3>
      {!isPhoneVerified ? (
        <>
          <div className="mt-[27px] flex justify-center">
            <img src={LockIcon} alt="자물쇠" />
          </div>
          <p className="mt-[32px] text-[20px] font-medium text-[#1C2882] text-center">
            휴대폰 인증이 필요합니다
          </p>
          <div className="mt-[22px] flex justify-center gap-[12px]">
            <input
              type="text"
              value={displayPhone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setPhone(value);
              }}
              placeholder="010-1234-5678"
              className={`w-[199px] ${INPUT_STYLE}`}
            />
            <VerificationButton
              onClick={handleSendVerificationCode}
              disabled={isSendingCode}
              isCodeSent={isCodeSent}
              countdown={formatCountdown(countdown)}
              className="w-[94px] h-[41px] rounded-lg"
            />
          </div>
          {isCodeSent && (
            <div className="mt-[12px] flex flex-col gap-[8px] items-center">
              <div className="flex gap-[12px]">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setVerificationError("");
                  }}
                  placeholder="인증번호 입력"
                  className={`w-[199px] ${INPUT_STYLE}`}
                />
                <Button
                  onClick={handleVerifyCode}
                  disabled={isVerifying}
                  className="w-[94px] h-[41px] rounded-md bg-[#1C2882] text-white text-[15px] font-semibold hover:bg-[#1C2882] disabled:opacity-50"
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
        </>
      ) : (
        <div className="mt-[30px] flex flex-col gap-[12px]">
          {/* 기존 비밀번호 */}
          <div className="flex flex-col gap-[12px]">
            <label className={LABEL_STYLE}>기존 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setCurrentPasswordError("");
              }}
              placeholder="기존 비밀번호 입력"
              className={`w-full ${INPUT_STYLE}`}
            />
            {currentPasswordError && (
              <p className="text-[12px] font-medium text-[#FF4545]">
                {currentPasswordError}
              </p>
            )}
          </div>

          {/* 새 비밀번호와 새 비밀번호 확인 */}
          <div className="flex gap-[40px]">
            <div className="flex-1 flex flex-col gap-[12px]">
              <label className={LABEL_STYLE}>새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setNewPasswordError("");
                }}
                placeholder="새 비밀번호 입력"
                className={`w-full ${INPUT_STYLE}`}
              />
              {newPasswordError && (
                <p className="text-[12px] font-medium text-[#FF4545]">
                  {newPasswordError}
                </p>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-[12px]">
              <label className={LABEL_STYLE}>새 비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                placeholder="새 비밀번호 확인"
                className={`w-full ${INPUT_STYLE}`}
              />
              {confirmPasswordError && (
                <p className="text-[12px] font-medium text-[#FF4545]">
                  {confirmPasswordError}
                </p>
              )}
            </div>
          </div>

          {/* 변경하기 버튼 */}
          <div className="flex justify-end mt-[12px]">
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-[122px] h-[41px] rounded-lg bg-[#1C2882] text-white text-[18px] font-semibold hover:bg-[#1C2882] disabled:opacity-50"
            >
              {isChangingPassword ? "변경 중..." : "변경하기"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
