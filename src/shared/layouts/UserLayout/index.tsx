import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cn } from "@/shared/utils";
import { useSidebarStore } from "@/stores/sidebarStore";
import { DemoModeBar } from "./DemoModeBar";

interface UserLayoutProps {
  showSidebar?: boolean;
}

export function UserLayout({ showSidebar = true }: UserLayoutProps) {
  const { isSidebarCollapsed } = useSidebarStore();

  return (
    <div className="h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <main
        className={cn(
          "h-screen min-w-0 overflow-hidden bg-gray-50 transition-[margin] duration-300",
          showSidebar &&
            (isSidebarCollapsed ? "ml-20" : "ml-20 lg:ml-[208px]"),
        )}
      >
        <div className="flex h-full min-w-0 flex-col">
          <DemoModeBar />
          <div className="min-h-0 min-w-0 flex-1 overflow-auto px-4 py-5 lg:p-6 xl:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
