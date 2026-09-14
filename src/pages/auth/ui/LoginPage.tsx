import { useEffect } from "react";
import { LoginForm } from "@/features/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores";
import { isDemoAccessToken, isDemoRuntime } from "@/demo/session";

export function LoginPage() {
  const navigate = useNavigate();
  const { accessToken, isLoading } = useAuthStore();

  useEffect(() => {
    const isAuthenticated = isDemoRuntime()
      ? isDemoAccessToken(accessToken)
      : Boolean(accessToken);
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [accessToken, navigate, isLoading]);
  return (
    <div className="flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
