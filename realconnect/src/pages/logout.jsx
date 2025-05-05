import React from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  // 여기에 로그아웃 로직을 구현할 수 있습니다.
  // 예: 토큰 삭제, 서버에 로그아웃 요청 등

  // 로그아웃 후 홈으로 리디렉션
  return <Navigate to="/" replace />;
};

export default Logout;
