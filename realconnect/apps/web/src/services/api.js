import axios from "axios";
import useAuthStore from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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

export default api; 