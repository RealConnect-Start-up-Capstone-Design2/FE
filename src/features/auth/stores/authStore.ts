import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      username: null,
      isLoading: true,
      setAuth: ({ accessToken, refreshToken, username }) =>
        set({
          accessToken,
          refreshToken: refreshToken ?? null,
          username,
          isLoading: false,
        }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          username: null,
          isLoading: false,
        }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        username: state.username,
      }),
    }
  )
);
