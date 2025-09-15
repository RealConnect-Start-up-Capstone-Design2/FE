import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import api from "@/services/api";

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const { logout } = useAuthStore();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. 서버에 로그아웃 요청 (refreshToken 무효화)
        await api.post("/logout", {}, { withCredentials: true });
      } catch (error) {
        // 서버 로그아웃 실패해도 클라이언트는 정리
        console.error("서버 로그아웃 실패:", error);
      } finally {
        // 2. 클라이언트 상태 정리
        logout(); // Zustand 스토어 정리
        localStorage.removeItem("isAuthenticated"); // 기존 코드 유지
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [logout]);

  // 로그아웃 처리 중이면 로딩 표시
  if (isLoggingOut) {
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
        로그아웃 중...
      </div>
    );
  }

  // 로그아웃 후 로그인 페이지로 리다이렉션
  return <Navigate to="/login" replace />;
};

export default Logout;
