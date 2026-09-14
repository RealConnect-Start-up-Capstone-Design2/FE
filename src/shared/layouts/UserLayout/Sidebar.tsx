import { Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/shared/utils";
import { useNavigate } from "react-router-dom";
import { isDemoAccessToken, isDemoRuntime } from "@/demo/session";
import { useAuthStore } from "@/features/auth/stores";
import { logout } from "@/features/auth/services/authService";
import { useSidebarStore } from "@/stores/sidebarStore";

// 이미지 불러오기
import Logo from "@/assets/Logo.svg";
import DatabaseIcon from "@/assets/Database.svg";
import ClipboardIcon from "@/assets/Clipboard.svg";
import EditIcon from "@/assets/Edit.svg";
import LogoutIcon from "@/assets/Logout.svg";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const mainMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    path: "/dashboard",
    icon: DatabaseIcon,
  },
  {
    id: "property-manage",
    label: "매물장",
    path: "/property-manage",
    icon: ClipboardIcon,
  },
  {
    id: "inquiry-manage",
    label: "문의장",
    path: "/inquiry-manage",
    icon: EditIcon,
  },
];

interface SidebarProps {
  className?: string;
}

function MenuIcon({
  icon,
  isActive,
}: {
  icon: MenuItem["icon"];
  isActive: boolean;
}) {
  return (
    <img
      src={icon}
      alt=""
      aria-hidden="true"
      className={cn(
        "w-5 h-5",
        isActive ? "brightness-0 invert" : "brightness-0 saturate-100",
      )}
    />
  );
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { accessToken, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isSidebarCollapsed: isCollapsed, toggleSidebar } = useSidebarStore();

  const handleLogout = async () => {
    try {
      if (!isDemoRuntime() && accessToken && !isDemoAccessToken(accessToken)) {
        await logout(accessToken);
      }
    } catch (error) {
      console.error("Failed to call logout API:", error);
    } finally {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    }
  };

  return (
    <aside
      aria-label="주요 메뉴"
      className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r border-[rgba(177,182,199,0.4)] bg-white shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)] transition-[width] duration-300",
        isCollapsed ? "w-20" : "w-20 lg:w-[208px]",
        className,
      )}
    >
      {/* Header */}
      <Link
        to="/dashboard"
        aria-label="대시보드로 이동"
        title="대시보드로 이동"
        className="flex items-center justify-center bg-[#1C2882] px-2 py-9 transition-colors hover:bg-[#17226F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C2882]"
      >
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt=""
            aria-hidden="true"
            className="h-[29px] w-[29px] text-white"
          />
          {!isCollapsed && (
            <p className="hidden text-[26px] font-semibold leading-none text-white lg:block">
              RealConnect
            </p>
          )}
        </div>
      </Link>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={toggleSidebar}
        style={{
          width: "28px",
          height: "28px",
          top: "50%",
          right: "0",
          borderRadius: "100px",
          transform: "translate(50%, -50%)",
        }}
        aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
        className="absolute z-10 hidden transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882] focus-visible:ring-offset-2 lg:block"
      >
        <div
          className="relative h-full w-full"
          style={{
            backgroundColor: "#1C2882",
            borderRadius: "100px",
          }}
        >
          {/* 화살표 아이콘 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              className="transition-transform duration-200"
              style={{
                transform: isCollapsed ? "rotate(-90deg)" : "rotate(90deg)",
              }}
            >
              <path
                d="M1 1L8 8L15 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </button>
      {/* Menu Items */}
      <nav aria-label="CRM 메뉴" className="space-y-3 px-3 py-6">
        {mainMenuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-lg transition-colors",
                isCollapsed && "justify-center",
                isActive
                  ? "bg-[#1C2882] text-white"
                  : "bg-white text-[#989898] hover:bg-gray-50",
              )}
              title={item.label}
            >
              <MenuIcon icon={item.icon} isActive={isActive} />
              {!isCollapsed && (
                <span className="hidden whitespace-nowrap font-pretendard text-[17px] font-medium leading-[1.193] tracking-[-0.025em] lg:block">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-10 left-3 right-3 border-y border-[rgba(177,182,199,0.4)] py-5">
        <button
          type="button"
          onClick={handleLogout}
          aria-label="로그아웃"
          className={cn(
            "flex w-full items-center justify-center gap-4 rounded-lg px-4 py-3 text-[#989898] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C2882] lg:justify-start",
            isCollapsed && "lg:justify-center",
          )}
          title="로그아웃"
        >
          <img
            src={LogoutIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5 brightness-0 saturate-100"
          />
          {!isCollapsed && (
            <span className="hidden whitespace-nowrap font-pretendard text-[17px] font-medium leading-[1.193] tracking-[-0.025em] lg:block">
              로그아웃
            </span>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="absolute bottom-3 left-3 right-3 hidden text-center text-[11px] font-medium tracking-[0.08em] text-[#A0A6B4] lg:block">
          PORTFOLIO MVP
        </div>
      )}
    </aside>
  );
}
