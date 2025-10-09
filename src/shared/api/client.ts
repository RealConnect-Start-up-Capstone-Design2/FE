import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.realconnect.co.kr",
});

// 토큰 재발급 중임을 표시하는 플래그
let isRefreshing = false;
// 토큰 재발급을 기다리는 요청들을 저장하는 배열
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};

// 요청 인터셉터: 모든 요청에 인증 토큰을 추가
apiClient.interceptors.request.use(
  (config) => {
    // authStore는 동적 import로 가져와서 순환 의존성 방지
    const authStore = localStorage.getItem("auth-storage");
    if (authStore) {
      try {
        const { state } = JSON.parse(authStore);
        const accessToken = state?.accessToken;
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Failed to parse auth storage:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 토큰 재발급 시도
apiClient.interceptors.response.use(
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
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 동적 import를 사용하여 순환 의존성 방지
        const { refreshAccessToken } = await import(
          "@/features/auth/services/authService"
        );
        const newAccessToken = await refreshAccessToken();

        // 대기 중인 모든 요청들에게 새 토큰 전달
        processQueue(null, newAccessToken);

        // 원래 요청에 새 토큰 추가하여 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 시 로그아웃 처리
        processQueue(refreshError as Error, null);

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

export default apiClient;
