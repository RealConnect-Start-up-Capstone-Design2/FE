import { useEffect } from "react";
import { useAuthStore } from "../stores";
import { refreshAccessToken } from "../services";

/**
 * 앱 시작 시 인증 토큰 복구를 시도하는 훅
 */
export function useAuthInitialize() {
  const { setAuth, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 쿠키에 저장된 refresh token으로 access token 복구 시도
        const newAccessToken = await refreshAccessToken();

        // 성공하면 인증 정보 설정
        setAuth({
          accessToken: newAccessToken,
          username: "", // 필요시 별도 API로 사용자 정보 가져오기
        });
      } catch (error) {
        // refresh token이 없거나 만료된 경우 - 정상적인 상황
        console.log("토큰 복구 실패 - 로그인 필요");
      } finally {
        // 로딩 완료
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth, setLoading]);

  return { isLoading };
}
