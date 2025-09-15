import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const ProtectedRoute = ({ children }) => {
  const { accessToken, isLoading } = useAuthStore();
  const location = useLocation();

  // 토큰 복구 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        인증 확인 중...
      </div>
    );
  }

  // 로딩 완료 후 accessToken이 없으면 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
