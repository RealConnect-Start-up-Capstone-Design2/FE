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
  // [시연 임시] 백엔드 다운 중 로그인 없이 웹빌딩 스튜디오만 시연. 복구 시 "/login"으로 되돌릴 것.
  {
    path: "/",
    element: <Navigate to="/demo" replace />,
  },
  // [시연 임시] 가드/대시보드 레이아웃 없이 웹빌딩 스튜디오 단독. 시연 종료 후 이 라우트 삭제.
  {
    path: "/demo",
    element: <WebsiteGeneratorPage />,
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
