import { create } from "zustand";
import { persist } from "zustand/middleware";

// 왼쪽 사이드바 열고 닫는 상태 관리에 대한 스토어
interface SidebarState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);
