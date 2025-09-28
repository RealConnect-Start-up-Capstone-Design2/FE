import axios from "axios";

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
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
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기 (추후 Zustand로 변경 예정)
    const accessToken = localStorage.getItem("accessToken");
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
        // 토큰 재발급 시도
        const response = await apiClient.get("/api/refresh-token", {
          withCredentials: true,
        });

        const newAccessToken = response.headers["authorization"]?.replace(
          "Bearer ",
          ""
        );

        if (!newAccessToken) {
          throw new Error("새로운 액세스 토큰이 없습니다.");
        }

        // 새로운 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 대기 중인 모든 요청들에게 새 토큰 전달
        processQueue(null, newAccessToken);

        // 원래 요청에 새 토큰 추가하여 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 시 로그아웃 처리
        processQueue(refreshError, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");

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
