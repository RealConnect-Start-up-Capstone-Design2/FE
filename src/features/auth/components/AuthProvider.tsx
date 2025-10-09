import type { PropsWithChildren } from "react";
import { useAuthInitialize } from "../hooks/useAuthInitialize";

/**
 * 인증 초기화를 담당하는 Provider 컴포넌트
 * 앱 시작 시 토큰 복구를 시도하고, 로딩 중일 때는 로딩 화면을 표시합니다.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const { isLoading } = useAuthInitialize();

  // 토큰 복구 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return <>{children}</>;
}

