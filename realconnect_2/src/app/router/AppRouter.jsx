import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@pages/auth/LoginPage";
import { DashboardPage } from "@pages/dashboard/DashboardPage";
import { PropertyManagementPage } from "@pages/property-management/PropertyManagementPage";

export const AppRouter = () => {
  return (
    <Routes>
      {/* 인증 관련 라우트 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 메인 페이지들 */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/properties" element={<PropertyManagementPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
