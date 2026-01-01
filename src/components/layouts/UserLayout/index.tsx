import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cn } from "@/shared/utils";
import { useSidebarStore } from "@/stores/sidebarStore";

interface UserLayoutProps {
  showSidebar?: boolean;
}

export function UserLayout({ showSidebar = true }: UserLayoutProps) {
  const { isSidebarCollapsed } = useSidebarStore();
  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <main
        className={cn(
          "flex-1 overflow-hidden bg-gray-50 transition-all duration-300",
          showSidebar && (isSidebarCollapsed ? "ml-20" : "ml-70")
        )}
      >
        <div className="h-full overflow-y-auto p-9">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
