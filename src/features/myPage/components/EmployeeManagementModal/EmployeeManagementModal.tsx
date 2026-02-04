import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { VerificationButton } from "../ProfileEditModal/VerificationButton";
import { INPUT_STYLE, LABEL_STYLE } from "../ProfileEditModal/constants";
import { formatPhoneNumber } from "@/shared/utils";
import CancelIcon from "@/assets/Cancel.svg";
import {
  sendStaffVerificationCode,
  verifyStaffCode,
  addStaff,
} from "@/shared/api/mypage";

interface Employee {
  id: string;
  name: string;
  phone: string;
  username: string;
}

interface EmployeeManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeManagementModal({
  isOpen,
  onClose,
}: EmployeeManagementModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    displayPhone: "",
    username: "",
    password: "",
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmployees([]);
      setFormData({
        name: "",
        phone: "",
        displayPhone: "",
        username: "",
        password: "",
      });
      setIsPhoneVerified(false);
      setIsCodeSent(false);
      setCountdown(60);
      setVerificationCode("");
      setIsVerifying(false);
      setPasswordError("");
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      displayPhone: formatPhoneNumber(prev.phone) || "",
    }));
  }, [formData.phone]);

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

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      const phoneDigits = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, phone: phoneDigits }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (field === "password") {
        setPasswordError("");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      phone: "",
      displayPhone: "",
      username: "",
      password: "",
    });
    setIsPhoneVerified(false);
    setIsCodeSent(false);
    setCountdown(60);
      setVerificationCode("");
      setIsVerifying(false);
  };

  const handleSendVerificationCode = async () => {
    if (!formData.phone || formData.phone.trim().length === 0) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    const phoneDigits = formData.phone.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 10) {
      alert("올바른 전화번호를 입력해주세요.");
      return;
    }

    try {
      setIsSendingCode(true);
      const response = await sendStaffVerificationCode(formData.phone);
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
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      setIsVerifying(true);
      await verifyStaffCode(formData.phone, verificationCode.trim());
      setIsPhoneVerified(true);
      setIsCodeSent(false);
      setCountdown(60);
      setVerificationCode("");
      alert("인증이 완료되었습니다.");
    } catch {
      alert("인증번호가 일치하지 않습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasLetter && hasNumber && hasSpecialChar;
  };

  const handleSave = async () => {
    setPasswordError("");

    if (!formData.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!isPhoneVerified) {
      alert("연락처 인증이 필요합니다.");
      return;
    }
    if (!formData.username.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    if (!formData.password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    if (!validatePassword(formData.password)) {
      setPasswordError("6자 이상의 영문, 숫자, 특수문자를 사용해 주세요.");
      return;
    }

    try {
      setIsAddingStaff(true);
      await addStaff(
        formData.username,
        formData.password,
        formData.password,
        formData.name,
        formData.phone
      );
      alert("직원이 성공적으로 추가되었습니다.");
      handleCancel();
    } catch {
      alert("직원 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsAddingStaff(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 이 직원을 삭제하시겠습니까?")) {
      try {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } catch {
        alert("직원 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#B1B6C7]/40" onClick={onClose} />

      <div className="relative z-[101] w-[750px] h-[calc(100vh-32px)] bg-white rounded-lg shadow-[0px_4px_25px_1px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-[50px]">
            <div className="flex items-center justify-between mb-[48px]">
              <h2 className="text-[24px] font-semibold text-black">
                직원 추가
              </h2>
              <button
                onClick={onClose}
                className="w-[33.92px] h-[33.92px] flex items-center justify-center flex-shrink-0"
              >
                <img
                  src={CancelIcon}
                  alt="닫기"
                  className="w-6 h-6"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(8%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                  }}
                />
              </button>
            </div>

            <div className="flex flex-col gap-[50px]">
              <div className="flex flex-col gap-[30px] items-end">
                <div className="w-full flex flex-col gap-[30px]">
                  <div className="flex gap-[40px]">
                    <div className="flex flex-col gap-[12px] w-[305px]">
                      <label className={LABEL_STYLE}>이름</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="이름을 입력해주세요"
                        className={`w-full ${INPUT_STYLE}`}
                      />
                    </div>
                    <div className="flex flex-col gap-[12px] w-[305px]">
                      <label className={LABEL_STYLE}>연락처</label>
                      <div className="flex gap-[12px]">
                        <input
                          type="text"
                          value={formData.displayPhone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="010-1234-2334"
                          className={`flex-1 ${INPUT_STYLE}`}
                        />
                        <VerificationButton
                          onClick={handleSendVerificationCode}
                          disabled={isSendingCode || isPhoneVerified}
                          isCodeSent={isCodeSent}
                          countdown={formatCountdown(countdown)}
                          className="w-[94px] h-[38px] rounded-md"
                        />
                      </div>
                      {isCodeSent && !isPhoneVerified && (
                        <div className="flex gap-[12px] mt-[8px]">
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) =>
                              setVerificationCode(e.target.value)
                            }
                            placeholder="인증번호 입력"
                            className={`w-[199px] ${INPUT_STYLE}`}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleVerifyCode();
                              }
                            }}
                          />
                          <Button
                            onClick={handleVerifyCode}
                            disabled={isVerifying}
                            className="w-[94px] h-[38px] rounded-md bg-[#1C2882] text-white text-[15px] font-semibold hover:bg-[#1C2882] disabled:opacity-50"
                          >
                            {isVerifying ? "확인 중..." : "확인"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-[40px]">
                    <div className="flex flex-col gap-[12px] w-[305px]">
                      <label className={LABEL_STYLE}>아이디</label>
                      <div className="flex gap-[12px]">
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) =>
                            handleInputChange("username", e.target.value)
                          }
                          placeholder="아이디를 입력해주세요"
                          className={`flex-1 ${INPUT_STYLE}`}
                        />
                        <Button
                          onClick={() => {}}
                          disabled={true}
                          className="w-[94px] h-[38px] rounded-md bg-[#EDEDED] text-[#8D8D8D] text-[15px] font-semibold hover:bg-[#EDEDED] cursor-not-allowed"
                        >
                          중복 확인
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[12px] w-[305px]">
                      <div className="flex items-center gap-2">
                        <label className={LABEL_STYLE}>비밀번호</label>
                        <span className="text-[12px] font-medium text-[#989898]">
                          (특수 문자 포함 6자리 이상)
                        </span>
                      </div>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        placeholder="비밀번호를 입력해주세요"
                        className={`w-full ${INPUT_STYLE}`}
                      />
                      {passwordError && (
                        <p className="text-[12px] font-medium text-[#FF4545]">
                          {passwordError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isAddingStaff}
                  className="w-[97px] h-[41px] rounded-lg bg-[#1C2882] text-white text-[18px] font-semibold hover:bg-[#1C2882] disabled:opacity-50"
                >
                  {isAddingStaff ? "추가 중..." : "추가"}
                </Button>
              </div>

              <div className="h-px w-full bg-[rgba(177,182,199,0.4)]" />

              <div className="flex flex-col gap-[30px]">
                <h3 className="text-[24px] font-semibold text-black">
                  직원 목록
                </h3>

                {employees.length > 0 ? (
                  <div className="w-[650px] rounded-lg overflow-hidden border border-[#B1B6C7]">
                    <div className="bg-[#EDEDED] h-[42px] flex items-center rounded-t-lg">
                      <div className="w-[74px] text-center text-[15px] font-medium text-[#8D8D8D]">
                        이름
                      </div>
                      <div className="w-[145px] text-center text-[15px] font-medium text-[#8D8D8D]">
                        연락처
                      </div>
                      <div className="w-[160px] text-center text-[15px] font-medium text-[#8D8D8D]">
                        아이디
                      </div>
                      <div className="flex-1 text-center text-[15px] font-medium text-[#8D8D8D]">
                        삭제 버튼
                      </div>
                    </div>
                    <div className="bg-white">
                      {employees.map((employee) => (
                        <div key={employee.id}>
                          <div className="h-[60px] flex items-center border-b border-[rgba(177,182,199,0.4)]">
                            <div className="w-[74px] text-center text-[13px] font-medium text-[#1B1B1B]">
                              {employee.name}
                            </div>
                            <div className="w-[145px] text-center text-[13px] font-medium text-[#1B1B1B]">
                              {formatPhoneNumber(employee.phone)}
                            </div>
                            <div className="w-[160px] text-center text-[13px] font-medium text-[#1B1B1B]">
                              {employee.username}
                            </div>
                            <div className="flex-1 flex justify-center">
                              <Button
                                onClick={() => handleDelete(employee.id)}
                                className="w-[63px] h-[32px] rounded-md bg-[#1C2882] text-white text-[13px] font-semibold hover:bg-[#1C2882]"
                              >
                                삭제
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-[40px] text-center text-[15px] font-medium text-[#8D8D8D]">
                    등록된 직원이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
