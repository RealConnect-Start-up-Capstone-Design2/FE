import apiClient, { refreshAccessToken } from "@/shared/api/client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  SendVerifyCodeRequest,
  VerifyCodeRequest,
} from "../types";

export { refreshAccessToken };

/**
 * 로그인을 요청하는 함수
 */
export const login = async (
  username: string,
  password: string,
  stayIn: boolean,
): Promise<AuthResponse> => {
  const response = await apiClient.post(
    "/login",
    {
      username,
      password,
      stayIn,
    } as LoginRequest,
    { withCredentials: true },
  );

  // 액세스 토큰은 Authorization 헤더에서 추출
  const accessToken = response.headers["authorization"]?.replace("Bearer ", "");

  if (!accessToken) {
    throw new Error("액세스 토큰이 없습니다.");
  }

  // username은 응답 body에 없고(빈 body), JWT의 username 클레임도 UUID라
  // 로그인 ID로 쓸 수 없다. 사용자가 입력한 로그인 ID를 그대로 보존해야
  // API 모드에서는 인증 응답의 계정 식별자를 그대로 보존한다.
  return { accessToken, username };
};

/**
 * 회원가입을 요청하는 함수
 */
export const register = async (data: RegisterRequest): Promise<void> => {
  await apiClient.post("/api/register", data, { withCredentials: true });
};

export const sendVerifyCode = async (phone: string): Promise<void> => {
  await apiClient.post(
    "/api/verify/sendCode",
    {
      phone,
    } as SendVerifyCodeRequest,
    { withCredentials: true },
  );
};

export const verifyCode = async (
  phone: string,
  authCode: string,
): Promise<void> => {
  await apiClient.post(
    "/api/verify/verifyCode",
    {
      phone,
      authCode,
    } as VerifyCodeRequest,
    { withCredentials: true },
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
