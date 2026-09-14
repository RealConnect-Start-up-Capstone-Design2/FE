import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { UserLayout } from "@/shared/layouts/UserLayout";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

const LoginPage = lazy(() =>
  import("@/pages/auth/ui/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
const DashboardPage = lazy(() =>
  import("@/pages/dashboard/ui/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const PropertyManagePage = lazy(() =>
  import("@/pages/propertyManage/ui/PropertyManagePage").then((module) => ({
    default: module.PropertyManagePage,
  })),
);
const InquiryManagePage = lazy(() =>
  import("@/pages/inquiryManage/ui/InquiryManagePage").then((module) => ({
    default: module.InquiryManagePage,
  })),
);

const routeFallback = (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[240px] w-full items-center justify-center"
  >
    <div className="flex items-center gap-3 text-sm font-medium text-[#6F7789]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D8DDF1] border-t-[#1C2882]" />
      화면을 불러오는 중입니다
    </div>
  </div>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={routeFallback}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={routeFallback}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "/property-manage",
        element: (
          <Suspense fallback={routeFallback}>
            <PropertyManagePage />
          </Suspense>
        ),
      },
      {
        path: "/inquiry-manage",
        element: (
          <Suspense fallback={routeFallback}>
            <InquiryManagePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
