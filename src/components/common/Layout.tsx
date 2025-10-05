import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cn } from "@/shared/utils";

interface LayoutProps {
  showSidebar?: boolean;
}

export function Layout({ showSidebar = true }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <main
        className={cn(
          "flex-1 overflow-auto px-[52px]",
          showSidebar && "ml-[270px]"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
