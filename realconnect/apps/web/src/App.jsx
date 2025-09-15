import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";

// 레이아웃 컴포넌트
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import useAuthStore from "./store/authStore";
import { refreshAccessToken } from "./services/authService";

// 페이지 컴포넌트
import Dashboard from "./pages/dashboard/dashboard";
import Properties from "./pages/propertiesManage/propertiesManage";
import Inquiries from "./pages/inquiries/inquiries";
import Contracts from "./pages/contracts/contracts";
import SharedInquiries from "./pages/sharedInquiries/sharedInquiries";
import Settings from "./pages/settings";
import Logout from "./pages/logout";
import OnboardingLogin from "./pages/onboardingLogin/onboardingLogin";
import Profile from "./pages/profile/profile";
import Register from "./pages/onboardingLogin/register";
function App() {
  const { setAuth, setLoading, isLoading } = useAuthStore();

  // 앱 시작 시 토큰 복구 시도
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 쿠키에 저장된 refresh token으로 access token 복구 시도
        const newAccessToken = await refreshAccessToken();

        // 성공하면 인증 정보 설정 (username은 토큰에서 추출하거나 별도 API 호출 필요)
        setAuth({
          accessToken: newAccessToken,
          username: null, // 필요시 별도 API로 사용자 정보 가져오기
        });
      } catch (error) {
        // refresh token이 없거나 만료된 경우 - 정상적인 상황
        console.log("토큰 복구 실패 - 로그인 필요:", error.message);
        console.log(
          "Error details:",
          error.response?.status,
          error.response?.data
        );
      } finally {
        // 로딩 완료
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth, setLoading]);

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
        로딩 중...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 외부(로그인X)에서 접속하는 페이지 */}
        <Route path="/login" element={<OnboardingLogin />} />
        <Route path="/register" element={<Register />} />
        {/* 로그인 후 접속하는 페이지 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <Layout>
                <Properties />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inquiries"
          element={
            <ProtectedRoute>
              <Layout>
                <Inquiries />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contracts"
          element={
            <ProtectedRoute>
              <Layout>
                <Contracts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared-inquiries"
          element={
            <ProtectedRoute>
              <Layout>
                <SharedInquiries />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />

        {/* 로그인 후 접속하는 페이지가 아닌 경우 로그인 페이지로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
