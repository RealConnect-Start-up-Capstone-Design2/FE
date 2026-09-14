import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { beginDemoSession, isDemoRuntime } from "@/demo/session";
import { useAuthStore } from "../stores";
import { login } from "../services";
import { AuthHeader } from "./AuthHeader";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import userIcon from "@/assets/icons/user.svg";
import lockIcon from "@/assets/icons/lock.svg";

export function LoginForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    stayIn: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  const demoMode = isDemoRuntime();

  const handleDemoStart = () => {
    queryClient.clear();
    beginDemoSession(setAuth);
    navigate("/dashboard", { replace: true });
  };

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
        form.password,
        form.stayIn,
      );

      // 계정 전환 시 이전 계정의 프로필·선호단지 캐시(staleTime 5분)가 남아
      // 다른 계정 데이터가 보이는 누수를 막는다. 로그인 = 계정 경계 → 캐시 초기화.
      setAuth({ accessToken, username });
      queryClient.clear();
      navigate("/dashboard");
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

      {demoMode ? (
        <div className="w-[640px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#DDE2F2] bg-white shadow-[0_18px_50px_-24px_rgba(28,40,130,0.4)]">
          <div className="bg-gradient-to-br from-[#1C2882] to-[#3548B5] px-8 py-7 text-white sm:px-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.12em]">
                PORTFOLIO DEMO
              </span>
              <ShieldCheck
                aria-hidden="true"
                className="h-6 w-6 text-[#AFC0FF]"
              />
            </div>
            <h2 className="text-[26px] font-bold leading-tight tracking-[-0.025em] sm:text-[30px]">
              공인중개사의 하루 업무를
              <br />
              하나의 CRM에서 관리합니다
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#DCE3FF] sm:text-base">
              별도 가입 없이 준비된 샘플 데이터로 핵심 업무 흐름을 바로 확인해
              보세요.
            </p>
          </div>

          <div className="px-8 py-7 sm:px-10 sm:py-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <DemoFeature
                icon={<Building2 aria-hidden="true" />}
                title="업무 대시보드"
                description="주요 현황을 한눈에"
              />
              <DemoFeature
                icon={<ClipboardCheck aria-hidden="true" />}
                title="매물 관리"
                description="검색부터 상태 관리까지"
              />
              <DemoFeature
                icon={<MessageSquareText aria-hidden="true" />}
                title="문의 관리"
                description="고객 요청을 놓치지 않게"
              />
            </div>

            <Button
              type="button"
              onClick={handleDemoStart}
              className="mt-7 h-13 w-full rounded-xl bg-[#1C2882] text-[17px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(28,40,130,0.9)] hover:bg-[#151F65] focus-visible:ring-2 focus-visible:ring-[#1C2882] focus-visible:ring-offset-2"
            >
              데모 데이터로 둘러보기
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Button>
            <p className="mt-3 text-center text-sm text-[#6F7789]">
              개인정보가 포함되지 않은 포트폴리오 전용 데이터입니다.
            </p>
          </div>
        </div>
      ) : (
        <ApiLoginForm
          form={form}
          error={error}
          onChange={handleChange}
          onSubmit={handleLogin}
        />
      )}
    </div>
  );
}

interface ApiLoginFormProps {
  form: {
    username: string;
    password: string;
    stayIn: boolean;
  };
  error: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function ApiLoginForm({ form, error, onChange, onSubmit }: ApiLoginFormProps) {
  return (
    <div className="w-[586px] max-w-[calc(100vw-2rem)] rounded-xl bg-white p-8 shadow-[0_0_25px_-10px_#B1B6C7] sm:p-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="mb-2 text-left text-[28px] font-bold text-[#222A3A]">
            로그인
          </h2>
          <p className="text-left text-lg text-[#8D8D8D]">
            계정 정보를 입력하여 로그인하세요
          </p>
        </div>
        <span className="mt-1 rounded-full bg-[#EEF1FF] px-3 py-1 text-xs font-semibold text-[#1C2882]">
          API MODE
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
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
              onChange={onChange}
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
              onChange={onChange}
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
              name="stayIn"
              checked={form.stayIn}
              onChange={onChange}
              className="h-4 w-4"
            />
            로그인 상태 유지
          </label>
        </div>

        <Button
          type="submit"
          className="mt-5 h-[42px] w-full rounded-md bg-brand text-lg font-semibold text-white hover:bg-[#151F65]"
        >
          로그인
        </Button>
      </form>
    </div>
  );
}

function DemoFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[#E2E6F2] bg-[#FAFBFF] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8EDFF] text-[#1C2882] [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <p className="text-sm font-semibold text-[#222A3A]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#7A8295]">{description}</p>
    </div>
  );
}
