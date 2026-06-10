import apiClient from "@/shared/api/client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  SendVerifyCodeRequest,
  VerifyCodeRequest,
} from "../types";
import { useAuthStore } from "../stores";

/**
 * 로그인을 요청하는 함수
 */
export const login = async (
  username: string,
  password: string,
  stayIn: boolean
): Promise<AuthResponse> => {
  const response = await apiClient.post("/login", {
    username,
    password,
    stayIn,
  } as LoginRequest,
  { withCredentials: true }
);

  // 액세스 토큰은 Authorization 헤더에서 추출
  const accessToken = response.headers["authorization"]?.replace("Bearer ", "");

  if (!accessToken) {
    throw new Error("액세스 토큰이 없습니다.");
  }

  // username은 응답 body에 없고(빈 body), JWT의 username 클레임도 UUID라
  // 로그인 ID로 쓸 수 없다. 사용자가 입력한 로그인 ID를 그대로 보존해야
  // CRM 컨텍스트(CRM_ACCOUNTS 키 = asd10203/qwe10203)가 계정별로 매칭된다.
  return { accessToken, username };
};

/**
 * 회원가입을 요청하는 함수
 */
export const register = async (data: RegisterRequest): Promise<void> => {
  await apiClient.post("/api/register", data, { withCredentials: true });
};

/**
 * 액세스 토큰을 재발급받는 함수
 */
export const refreshAccessToken = async (): Promise<string> => {
  const response = await apiClient.post("/api/refresh-token", undefined, {
    withCredentials: true, // 쿠키(리프레시 토큰) 전송을 위함
  });

  // 액세스 토큰은 Authorization 헤더에서 추출
  const accessToken = response.headers["authorization"]?.replace("Bearer ", "");

  if (!accessToken) {
    throw new Error("새로운 액세스 토큰이 없습니다.");
  }

  useAuthStore.setState({ accessToken });
  return accessToken;
};

export const sendVerifyCode = async (phone: string): Promise<void> => {
  await apiClient.post(
    "/api/verify/sendCode",
    {
      phone,
    } as SendVerifyCodeRequest,
    { withCredentials: true }
  );
};

export const verifyCode = async (
  phone: string,
  authCode: string
): Promise<void> => {
  await apiClient.post(
    "/api/verify/verifyCode",
    {
      phone,
      authCode,
    } as VerifyCodeRequest,
    { withCredentials: true }
  );
};

export const logout = async (accessToken: string): Promise<void> => {
  await apiClient.post("/api/logout", undefined, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
