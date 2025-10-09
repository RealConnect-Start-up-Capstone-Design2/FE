import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { accessToken, isLoading } = useAuthStore();
  const location = useLocation();

  // 토큰 복구 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">인증 확인 중...</div>
      </div>
    );
  }

  // 로딩 완료 후 accessToken이 없으면 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

