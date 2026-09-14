import { useEffect, useRef } from "react";
import {
  DEMO_ACCESS_TOKEN,
  DEMO_USERNAME,
  isDemoAccessToken,
  isDemoRuntime,
} from "@/demo/session";
import { useAuthStore } from "../stores";
import { refreshAccessToken, logout } from "../services";

/**
 * 앱 시작 시 인증 토큰 복구를 시도하는 훅
 */
export function useAuthInitialize() {
  const {
    setAuth,
    setLoading,
    logout: logoutStore,
    isLoading,
  } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 초기화가 이미 실행되었으면 다시 실행하지 않음
    if (hasInitialized.current) {
      return;
    }

    const initializeAuth = async () => {
      hasInitialized.current = true;

      const currentAccessToken = useAuthStore.getState().accessToken;

      // Demo mode is local-first: never contact the unavailable authentication API.
      if (isDemoRuntime()) {
        if (isDemoAccessToken(currentAccessToken)) {
          setAuth({
            accessToken: DEMO_ACCESS_TOKEN,
            username: DEMO_USERNAME,
          });
        } else {
          // Remove stale production tokens when entering a portfolio build.
          logoutStore();
        }
        setLoading(false);
        return;
      }

      try {
        // 쿠키에 저장된 refresh token으로 access token 복구 시도
        const newAccessToken = await refreshAccessToken();

        // 성공하면 인증 정보 설정 (persist에 저장된 username 유지 — 새로고침 시 계정 식별 보존)
        setAuth({
          accessToken: newAccessToken,
          username: useAuthStore.getState().username ?? "",
        });
      } catch {
        // 토큰 갱신 실패 시 액세스 토큰 블랙리스트 처리를 위해 로그아웃 API 호출
        if (currentAccessToken) {
          try {
            await logout(currentAccessToken);
          } catch (logoutError) {
            // 로그아웃 API 실패해도 무시하고 계속 진행 (이미 토큰이 만료된 경우일 수 있음)
            console.error("로그아웃 API 호출 실패:", logoutError);
          }
        }

        // 로컬 상태 클리어
        logoutStore();

        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          window.location.href = "/login";
        }
      } finally {
        // 로딩 완료
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth, setLoading, logoutStore]);

  return { isLoading };
}
