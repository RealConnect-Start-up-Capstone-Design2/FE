import apiClient from "@/shared/api/client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  SendVerifyCodeRequest,
  VerifyCodeRequest,
} from "../types";

/**
 * 로그인을 요청하는 함수
 */
export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<{ username: string }>(
    "/login",
    {
      username,
      password,
    } as LoginRequest,
    { withCredentials: true } // 쿠키(리프레시 토큰) 전송을 위함
  );

  // 액세스 토큰은 Authorization 헤더에서 추출
  const accessToken = response.headers["authorization"]?.replace("Bearer ", "");
  // 사용자 이름은 응답 데이터에서 추출
  const responseUsername = response.data.username;

  if (!accessToken) {
    throw new Error("액세스 토큰이 없습니다.");
  }

  // 성공 시 토큰과 사용자 정보를 반환
  return { accessToken, username: responseUsername };
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
  const response = await apiClient.get("/api/refresh-token", {
    withCredentials: true, // 쿠키(리프레시 토큰) 전송을 위함
  });

  // 액세스 토큰은 Authorization 헤더에서 추출
  const accessToken = response.headers["authorization"]?.replace("Bearer ", "");

  if (!accessToken) {
    throw new Error("새로운 액세스 토큰이 없습니다.");
  }

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
