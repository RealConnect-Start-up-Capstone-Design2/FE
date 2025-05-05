import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";

// 레이아웃 컴포넌트
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// 페이지 컴포넌트
import Dashboard from "./pages/dashboard";
import Properties from "./pages/propertiesManage";
import Inquiries from "./pages/inquiries";
import Contracts from "./pages/contracts";
import SharedInquiries from "./pages/sharedInquiries";
import Settings from "./pages/settings";
import Logout from "./pages/logout";
import OnboardingLogin from "./pages/onboardingLogin/onboardingLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 외부(로그인X)에서 접속하는 페이지 */}
        <Route path="/login" element={<OnboardingLogin />} />

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
