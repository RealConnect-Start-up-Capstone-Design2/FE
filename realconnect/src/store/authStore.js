import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  username: null,
  setAuth: ({ accessToken, refreshToken, username }) =>
    set({ accessToken, refreshToken, username }),
  logout: () => set({ accessToken: null, refreshToken: null, username: null }),
}));

export default useAuthStore;
