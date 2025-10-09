import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services";
import { AuthHeader } from "./AuthHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import userIcon from "@/assets/icons/user.svg";
import lockIcon from "@/assets/icons/lock.svg";
import mailIcon from "@/assets/icons/mail.svg";
import phoneIcon from "@/assets/icons/phone.svg";

export function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordVerify: "",
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.passwordVerify) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!form.email.includes("@")) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    try {
      await register({
        username: form.username,
        password: form.password,
        passwordVerify: form.passwordVerify,
        email: form.email,
        name: form.name,
      });
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          alert(axiosError.response.data.message);
        } else {
          alert("회원가입 요청 중 오류가 발생했습니다.");
        }
      } else {
        alert("회원가입 요청 중 오류가 발생했습니다.");
      }
    }
  };

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
              휴대폰 번호
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-[#B1B6C7] bg-white px-4 py-3 transition-all focus-within:border-blue-600 focus-within:shadow-[0_0_0_1.5px_#2563EB]">
              <img
                src={phoneIcon}
                alt="휴대폰 번호"
                className="h-5 w-5 flex-shrink-0 stroke-[#8D8D8D]"
              />
              <Input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="휴대폰 번호 입력"
                autoComplete="tel"
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-5 h-[42px] w-full rounded-md bg-brand text-lg font-semibold text-white hover:bg-[#151F65]"
          >
            회원가입
          </Button>
        </form>
      </div>
    </div>
  );
}
