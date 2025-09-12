import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    // authentication token 삭제해서 로그인 상태 지우기
    localStorage.removeItem("isAuthenticated");
  }, []);

  // 로그아웃 후 홈으로 리다이렉션
  return <Navigate to="/login" replace />;
};

export default Logout;
