import { useMutation } from "@tanstack/react-query";
import { login } from "@entities/user";
import { useNavigate } from "react-router-dom";

/**
 * 로그인 뮤테이션 훅
 */
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ username, password }) => login(username, password),
    onSuccess: (data) => {
      // 로그인 성공 시 토큰과 사용자 정보 저장
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("username", data.username);

      // 대시보드로 리다이렉트
      navigate("/");
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
      // 에러 처리 (toast 등으로 사용자에게 알림)
    },
  });
};

/**
 * 로그아웃 함수
 */
export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");

    // 로그인 페이지로 리다이렉트
    navigate("/login");
  };

  return logout;
};
