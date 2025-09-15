import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  username: null,
  isLoading: true, // 앱 시작 시 토큰 복구 중인지 여부
  setAuth: ({ accessToken, refreshToken, username }) =>
    set({ accessToken, refreshToken, username }),
  logout: () =>
    set({
      accessToken: null,
      refreshToken: null,
      username: null,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
