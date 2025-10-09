import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/components/common/Layout";
import { ProtectedRoute } from "@/features/auth";
import { HomePage } from "@/pages/home";
import { PropertyManagePage } from "@/pages/propertyManage";
import { LoginPage, SignupPage } from "@/pages/auth";

export const routes = createBrowserRouter([
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
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/property-manage",
        element: <PropertyManagePage />,
      },
      {
        path: "/inquiry-manage",
        element: <div className="p-6">문의 관리 페이지</div>,
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
        path: "/settings",
        element: <div className="p-6">설정 페이지</div>,
      },
    ],
  },
]);
