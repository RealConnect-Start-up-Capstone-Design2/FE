import { createBrowserRouter, Navigate } from "react-router-dom";
import { UserLayout } from "@/shared/layouts/UserLayout";
import { AdminLayout } from "@/shared/layouts/AdminLayout";
import { ProtectedRoute } from "@/features/auth";
import { DashboardPage } from "@/pages/dashboard";
import { PropertyManagePage } from "@/pages/propertyManage";
import { LoginPage, SignupPage, TermsDetailPage } from "@/pages/auth";
import { MyPage } from "@/pages/myPage";
import { AdminPage } from "@/pages/admin";
import { InquiryManagePage } from "@/pages/inquiryManage";
import { WebsiteGeneratorPage } from "@/pages/websiteGenerate";

export const routes = createBrowserRouter([
  // 루트 경로
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/terms/:type", // 개인정보처리방침, 마케팅정보수신동의, 서비스이용약관
    element: <TermsDetailPage />,
  },
  // 관리자 영역
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <AdminPage />,
      },
    ],
  },
  // 일반 사용자 영역
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/property-manage",
        element: <PropertyManagePage />,
      },
      {
        path: "/inquiry-manage",
        element: <InquiryManagePage />,
      },
      {
        path: "/contract-manage",
        element: <div className="p-6">계약 관리 페이지</div>,
      },
      {
        path: "/inquiry-share",
        element: <div className="p-6">문의 공유 페이지</div>,
      },
      {
        path: "/website-generate",
        element: <WebsiteGeneratorPage />,
      },
      {
        path: "/my-page",
        element: <MyPage />,
      },
    ],
  },
]);
