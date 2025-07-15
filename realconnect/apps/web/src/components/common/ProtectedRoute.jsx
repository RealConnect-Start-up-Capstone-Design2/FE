import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const ProtectedRoute = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  // zustand store에 accessToken이 없으면 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
