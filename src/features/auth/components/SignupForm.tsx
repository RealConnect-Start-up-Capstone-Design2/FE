import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services";
import { usePhoneVerification, useSignupComplexSelection } from "../hooks";
import { AuthHeader } from "./AuthHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import userIcon from "@/assets/icons/user.svg";
import lockIcon from "@/assets/icons/lock.svg";
import mailIcon from "@/assets/icons/mail.svg";
import phoneIcon from "@/assets/icons/phone.svg";

interface SignupFormState {
  username: string;
  password: string;
  passwordVerify: string;
  name: string;
  phone: string;
  email: string;
  apartmentComplexId?: number;
}

export function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupFormState>({
    username: "",
    password: "",
    passwordVerify: "",
    name: "",
    phone: "",
    email: "",
    apartmentComplexId: undefined,
  });
  const {
    selection: complexSelection,
    selectedComplexLabel,
    hasSelectedComplex,
    sidoOptions,
    sigunguOptions,
    eupmyeondongOptions,
    complexOptions,
    selectSido,
    selectSigungu,
    selectEupmyeondong,
    selectComplex,
  } = useSignupComplexSelection({
    onSelect: ({ apartmentComplexId }) => {
      setForm((prev) => ({
        ...prev,
        apartmentComplexId,
      }));
    },
  });
  const {
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isCodeVerified,
    sendCooldown,
    isSendingCode,
    isVerifyingCode,
    canSendCode,
    sendCode,
    verifyCode: verifyCodeAction,
  } = usePhoneVerification({
    phone: form.phone,
  });

  const getErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (error instanceof Error) {
      if ("response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };

        if (axiosError.response?.data?.message) {
          return axiosError.response.data.message;
        }
      }

      if (error.message) {
        return error.message;
      }
    }

    return fallbackMessage;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async () => {
    if (isSendingCode || sendCooldown > 0) {
      return;
    }

    try {
      await sendCode();
      alert("인증번호를 발송했습니다.");
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "인증번호 발송 중 오류가 발생했습니다."
      );
      alert(message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyCodeAction();
      alert("휴대폰 번호 인증이 완료되었습니다.");
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "인증번호 확인 중 오류가 발생했습니다."
      );
      alert(message);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (form.password !== form.passwordVerify) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!form.email.includes("@")) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (!isCodeVerified) {
      alert("휴대폰 번호 인증을 완료해주세요.");
      return;
    }

    if (form.apartmentComplexId === undefined) {
      alert("주거래 단지를 선택해주세요.");
      return;
    }

    const sanitizedPhone = form.phone.replace(/\D/g, "");

    try {
      await register({
        username: form.username,
        password: form.password,
        passwordVerify: form.passwordVerify,
        phone: sanitizedPhone,
        email: form.email,
        name: form.name,
        apartmentComplexId: form.apartmentComplexId,
      });
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "회원가입 요청 중 오류가 발생했습니다."
      );
      alert(message);
    }
  };

  const sendButtonLabel = isCodeVerified
    ? "인증완료"
    : isSendingCode
    ? "발송중..."
    : sendCooldown > 0
    ? `${sendCooldown}초`
    : "인증번호 발송";
  const isSendButtonDisabled =
    isCodeVerified || isSendingCode || sendCooldown > 0 || !canSendCode;
  const verifyButtonLabel = isCodeVerified
    ? "완료"
    : isVerifyingCode
    ? "확인중..."
    : "인증확인";
  const isVerifyButtonDisabled =
    isCodeVerified || isVerifyingCode || verificationCode.trim().length === 0;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <AuthHeader />

      <div className="w-[586px] max-w-[95vw] overflow-y-auto rounded-xl border border-[#DDE2F2] bg-white p-10 shadow-[0_0_25px_-10px_#B1B6C7]">
        <h2 className="mb-2 text-left text-[28px] font-bold text-[#222A3A]">
          회원가입
        </h2>
        <p className="mb-10 text-left text-xl text-[#8D8D8D]">
          새로운 부동산 계정을 생성하세요
        </p>

        <form onSubmit={handleRegister}>
          <div className="mb-5 flex flex-col">
            <Label
              htmlFor="username"
              className="mb-2 text-base font-semibold text-[#222A3A]"
            >
              아이디
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-[#B1B6C7] bg-white px-4 py-3 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_1.5px_#2563EB]">
              <img
                src={userIcon}
                alt="아이디"
                className="h-5 w-5 flex-shrink-0 stroke-[#8D8D8D]"
              />
              <Input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="아이디 입력"
                autoComplete="username"
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-col">
            <Label
              htmlFor="password"
              className="mb-2 text-base font-semibold text-[#222A3A]"
            >
              비밀번호
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-[#B1B6C7] bg-white px-4 py-3 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_1.5px_#2563EB]">
              <img
                src={lockIcon}
                alt="비밀번호"
                className="h-5 w-5 flex-shrink-0 stroke-[#8D8D8D]"
              />
              <Input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호 입력(영문, 숫자, 특수문자 포함 8자리 이상)"
                autoComplete="new-password"
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-col">
            <Label
              htmlFor="passwordVerify"
              className="mb-2 text-base font-semibold text-[#222A3A]"
            >
              비밀번호 확인
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-[#B1B6C7] bg-white px-4 py-3 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_1.5px_#2563EB]">
              <img
                src={lockIcon}
                alt="비밀번호 확인"
                className="h-5 w-5 flex-shrink-0 stroke-[#8D8D8D]"
              />
              <Input
                type="password"
                id="passwordVerify"
                name="passwordVerify"
                value={form.passwordVerify}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
                autoComplete="new-password"
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-col">
            <Label
              htmlFor="email"
              className="mb-2 text-base font-semibold text-[#222A3A]"
            >
              이메일
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-[#B1B6C7] bg-white px-4 py-3 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_1.5px_#2563EB]">
              <img
                src={mailIcon}
                alt="이메일"
                className="h-5 w-5 flex-shrink-0 stroke-[#8D8D8D]"
              />
              <Input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일 입력"
                autoComplete="email"
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-col">
            <Label
              htmlFor="name"
              className="mb-2 text-base font-semibold text-[#222A3A]"
            >
              이름
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-[#B1B6C7] bg-white px-4 py-3 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_1.5px_#2563EB]">
              <img
                src={userIcon}
                alt="이름"
                className="h-5 w-5 flex-shrink-0 stroke-[#8D8D8D]"
              />
              <Input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름 입력"
                autoComplete="name"
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-col">
            <Label
              htmlFor="phone"
              className="mb-2 text-base font-semibold text-[#222A3A]"
            >
              휴대폰 번호
            </Label>
            <div className="flex flex-row gap-2">
              <div className="flex w-full items-center gap-2 rounded-xl border border-[#B1B6C7] bg-white px-4 py-3 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_1.5px_#2563EB]">
                <img
                  src={phoneIcon}
                  alt="휴대폰 번호"
                  className="h-5 w-5 flex-shrink-0 stroke-[#8D8D8D]"
                />
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="휴대폰 번호 입력"
                  autoComplete="tel"
                  className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                  disabled={isCodeVerified}
                />
              </div>
              <Button
                type="button"
                onClick={handleSendCode}
                disabled={isSendButtonDisabled}
                className="h-auto rounded-md bg-[#1C2882] px-5 py-4 text-white disabled:opacity-60"
              >
                {sendButtonLabel}
              </Button>
            </div>
            {isCodeSent && (
              <div className="mt-4 flex flex-col">
                <Label
                  htmlFor="verificationCode"
                  className="mb-2 text-base font-semibold text-[#222A3A]"
                >
                  인증번호
                </Label>
                <div className="flex flex-row gap-2">
                  <div className="flex w-full items-center gap-2 rounded-xl border border-[#B1B6C7] bg-white px-4 py-3 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_1.5px_#2563EB]">
                    <Input
                      type="text"
                      id="verificationCode"
                      name="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="수신한 인증번호 입력"
                      className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                      disabled={isCodeVerified}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isVerifyButtonDisabled}
                    className="h-auto rounded-md bg-[#1C2882] px-5 py-4 text-white disabled:opacity-60"
                  >
                    {verifyButtonLabel}
                  </Button>
                </div>
                {isCodeVerified && (
                  <p className="mt-2 text-sm font-medium text-[#1C2882]">
                    휴대폰 번호 인증이 완료되었습니다.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mb-5 flex flex-col">
            <Label className="mb-2 text-base font-semibold text-[#222A3A]">
              주거래 단지
            </Label>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                <DropdownMenu
                  placeholder="시/도"
                  options={sidoOptions}
                  value={
                    complexSelection.sidoCode
                      ? complexSelection.sidoCode
                      : undefined
                  }
                  onChange={selectSido}
                  buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
                  className="w-[165px]"
                  selectedTextColor="text-[#1B1B1B]"
                  placeholderTextColor="text-[#989898]"
                />
                <DropdownMenu
                  placeholder="시/군/구"
                  options={sigunguOptions}
                  value={
                    complexSelection.sigunguCode
                      ? complexSelection.sigunguCode
                      : undefined
                  }
                  onChange={selectSigungu}
                  disabled={!complexSelection.sidoCode}
                  buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
                  className="w-[165px]"
                  selectedTextColor="text-[#1B1B1B]"
                  placeholderTextColor="text-[#989898]"
                />
                <DropdownMenu
                  placeholder="읍/면/동"
                  options={eupmyeondongOptions}
                  value={
                    complexSelection.emdCode
                      ? complexSelection.emdCode
                      : undefined
                  }
                  onChange={selectEupmyeondong}
                  disabled={!complexSelection.sigunguCode}
                  buttonClassName="w-[165px] h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
                  className="w-[165px]"
                  selectedTextColor="text-[#1B1B1B]"
                  placeholderTextColor="text-[#989898]"
                />
              </div>
              <DropdownMenu
                placeholder="단지"
                options={complexOptions}
                value={
                  complexSelection.apartmentComplexId !== undefined
                    ? String(complexSelection.apartmentComplexId)
                    : undefined
                }
                onChange={selectComplex}
                disabled={!complexSelection.emdCode}
                buttonClassName="w-full h-[38px] rounded-md border border-[#B1B6C7] bg-white px-3 text-[15px] font-medium"
                className="w-full"
                selectedTextColor="text-[#1B1B1B]"
                placeholderTextColor="text-[#989898]"
              />
            </div>
            {hasSelectedComplex && (
              <p className="mt-3 text-sm font-medium text-[#1C2882]">
                {selectedComplexLabel}
              </p>
            )}
          </div>

          <Button
            // type="submit"
            // TEMP : 임시 비활성화 처리
            disabled={true}
            className="mt-5 h-[42px] w-full rounded-md bg-brand text-lg font-semibold text-white hover:bg-[#151F65]"
          >
            회원가입
          </Button>
        </form>
      </div>
    </div>
  );
}
