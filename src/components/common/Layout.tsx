import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cn } from "@/shared/utils";

interface LayoutProps {
  showSidebar?: boolean;
}

export function Layout({ showSidebar = true }: LayoutProps) {
  return (
    <div className="flex bg-gray-50 min-w-[1200px]">
      {showSidebar && <Sidebar />}
      <main
        className={cn(
          "flex-1 overflow-auto pl-[52px] min-w-[1200px] bg-gray-50",
          showSidebar && "ml-[270px]"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
