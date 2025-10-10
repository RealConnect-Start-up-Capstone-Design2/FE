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
          "flex-1 overflow-hidden bg-gray-50",
          showSidebar && "ml-70"
        )}
      >
        <div className="h-full overflow-y-auto p-13">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
