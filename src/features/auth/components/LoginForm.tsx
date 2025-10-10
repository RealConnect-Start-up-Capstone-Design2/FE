import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores";
import { login } from "../services";
import { AuthHeader } from "./AuthHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import userIcon from "@/assets/icons/user.svg";
import lockIcon from "@/assets/icons/lock.svg";
import kakaoIcon from "@/assets/icons/kakaotalk.svg";
import naverIcon from "@/assets/icons/naver.svg";

export function LoginForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    setError("");
    try {
      const { accessToken, username } = await login(
        form.username,
        form.password
      );

      setAuth({ accessToken, username });
      navigate("/home");
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError("로그인에 실패했습니다.");
        }
      } else {
        setError("로그인에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <AuthHeader />

      <div className="w-[586px] max-w-[95vw] rounded-xl bg-white p-10 shadow-[0_0_25px_-10px_#B1B6C7]">
        <h2 className="mb-2 text-left text-[28px] font-bold text-[#222A3A]">
          로그인
        </h2>
        <p className="mb-10 text-left text-xl text-[#8D8D8D]">
          계정 정보를 입력하여 로그인하세요
        </p>

        {error && (
          <div className="mb-5 rounded bg-red-100 py-2.5 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
                className="h-5 w-5 flex-shrink-0 text-[#8D8D8D]"
              />
              <Input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="아이디를 입력해주세요"
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
                className="h-5 w-5 flex-shrink-0 text-[#8D8D8D]"
              />
              <Input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                autoComplete="current-password"
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <label className="flex items-center gap-1 text-lg text-black">
              <input
                type="checkbox"
                name="keepLogin"
                // checked={form.keepLogin}
                onChange={handleChange}
                className="h-4 w-4"
              />
              로그인 상태 유지
            </label>
            <div className="mr-3 flex items-center gap-1">
              <a
                href="#"
                className="text-lg text-brand no-underline transition-colors hover:text-blue-700"
              >
                아이디 찾기
              </a>
              <span className="text-lg text-[#B0B8C1]">|</span>
              <a
                href="#"
                className="text-lg text-brand no-underline transition-colors hover:text-blue-700"
              >
                비밀번호 찾기
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-5 h-[42px] w-full rounded-md bg-brand text-lg font-semibold text-white hover:bg-[#151F65]"
          >
            로그인
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t border-[#D4D8E5]"></div>
          <div className="text-base text-[#8D8D8D]">또는</div>
          <div className="flex-1 border-t border-[#D4D8E5]"></div>
        </div>

        <div className="mb-6 flex gap-4">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#B1B6C7] bg-white py-3 text-base font-medium text-[#1B1B1B] transition-shadow hover:shadow-md">
            <img src={kakaoIcon} alt="카카오" className="h-5 w-5" />
            카카오로 로그인
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#B1B6C7] bg-white py-3 text-base font-medium text-[#1B1B1B] transition-shadow hover:shadow-md">
            <img src={naverIcon} alt="네이버" className="h-5 w-5" />
            네이버로 로그인
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center text-lg text-[#8D8D8D]">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="ml-1 font-medium text-brand underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
