import axios from "axios";
import useAuthStore from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 토큰 재발급 중임을 표시하는 플래그
let isRefreshing = false;
// 토큰 재발급을 기다리는 요청들을 저장하는 배열
let failedQueue = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// 요청 인터셉터: 모든 요청에 인증 토큰을 추가합니다.
api.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 직접 상태를 가져옵니다.
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 토큰 재발급을 시도합니다.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도하지 않은 요청이며, refresh-token 요청이 아닌 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/refresh-token")
    ) {
      // 이미 토큰 재발급 중이라면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 동적 import를 사용하여 순환 의존성 방지
        const { refreshAccessToken } = await import("./authService");
        const newAccessToken = await refreshAccessToken();

        // 새로운 토큰을 스토어에 저장
        const { setAuth, username } = useAuthStore.getState();
        setAuth({
          accessToken: newAccessToken,
          username: username,
        });

        // 대기 중인 모든 요청들에게 새 토큰 전달
        processQueue(null, newAccessToken);

        // 원래 요청에 새 토큰 추가하여 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 시 로그아웃 처리
        processQueue(refreshError, null);

        const { logout } = useAuthStore.getState();
        logout();

        // 로그인 페이지로 리다이렉트
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
