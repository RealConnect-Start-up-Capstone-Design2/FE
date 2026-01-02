import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores";
import { logout } from "@/features/auth/services/authService";
import { useSidebarStore } from "@/stores/sidebarStore";

// 이미지 불러오기
import Logo from "@/assets/Logo.svg";
import ClipboardIcon from "@/assets/Clipboard.svg";
import EditIcon from "@/assets/Edit.svg";
// 계약 관리 페이지에 대한 이미지 에셋
// import FileTextIcon from "@/assets/FileText.svg";
import ShareIcon from "@/assets/Share.svg";
import SettingsIcon from "@/assets/Settings.svg";
import LogoutIcon from "@/assets/Logout.svg";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  disabled?: boolean;
}

const mainMenuItems: MenuItem[] = [
  {
    id: "property-manage",
    label: "매물장",
    path: "/property-manage",
    icon: ClipboardIcon,
    disabled: false,
  },
  {
    id: "inquiry-manage",
    label: "문의장",
    path: "/inquiry-manage",
    icon: EditIcon,
    disabled: true,
  },
  // 26.1.1
  // 계약 페이지 빠져서 주석처리함.
  // {
  //   id: "contract-manage",
  //   label: "계약 관리",
  //   path: "/contract-manage",
  //   icon: FileTextIcon,
  //   disabled: true,
  // },
  {
    id: "inquiry-share",
    label: "공동 중개",
    path: "/inquiry-share",
    icon: ShareIcon,
    disabled: true,
  },
];

const bottomMenuItems: MenuItem[] = [
  {
    id: "my-page",
    label: "마이페이지",
    path: "/my-page",
    icon: SettingsIcon,
    disabled: false,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { accessToken, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { isSidebarCollapsed: isCollapsed, toggleSidebar } = useSidebarStore();

  const handleLogout = async () => {
    try {
      await logout(accessToken ?? "");
    } catch (error) {
      console.error("Failed to call logout API:", error);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-[rgba(177,182,199,0.4)] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)] z-50",
        isCollapsed ? "w-20" : "w-67",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "bg-[#1C2882] flex items-center justify-center py-9",
          isCollapsed ? "px-2" : "px-9"
        )}
      >
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Home" className="w-[29px] h-[29px] text-white" />
          {!isCollapsed && (
            <p className="text-[28px] text-[#FFFFFF] font-semibold leading-none">
              APT note
            </p>
          )}
        </div>
      </div>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="absolute z-10 transition-all duration-300 ease-in-out"
        style={{
          width: "28px",
          height: "28px",
          top: "50%",
          right: "0",
          borderRadius: "100px",
          transform: "translate(100%, -50%)",
        }}
        aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
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
      <div className="px-3 py-6 space-y-3">
        {mainMenuItems.map((item) => {
          const isActive = location.pathname === item.path;

          const handleClick = (e: React.MouseEvent) => {
            if (item.disabled) {
              e.preventDefault();
              alert("추후 추가 예정입니다.");
            }
          };

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleClick}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-lg transition-colors",
                isCollapsed && "justify-center",
                isActive
                  ? "bg-[#1C2882] text-white"
                  : "bg-white text-[#989898] hover:bg-gray-50"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={cn(
                  "w-5 h-5",
                  isActive ? "brightness-0 invert" : "brightness-0 saturate-100"
                )}
              />
              {!isCollapsed && (
                <span className="text-lg font-medium leading-[1.193] tracking-[-0.025em] font-pretendard whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-8 left-3 right-3 space-y-3 border-t border-b py-6 border-[rgba(177,182,199,0.4)]">
        {bottomMenuItems.map((item) => {
          const isActive = location.pathname === item.path;

          const handleClick = (e: React.MouseEvent) => {
            if (item.disabled) {
              e.preventDefault();
              alert("추후 추가 예정입니다.");
            }
          };

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleClick}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                isCollapsed && "justify-center",
                isActive
                  ? "bg-[#1C2882] text-white"
                  : "text-[#989898] hover:bg-gray-50"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={cn(
                  "w-5 h-5",
                  isActive ? "brightness-0 invert" : "brightness-0 saturate-100"
                )}
              />
              {!isCollapsed && (
                <span className="text-lg font-medium leading-[1.193] tracking-[-0.025em] font-pretendard whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[#989898] hover:bg-gray-50 transition-colors"
          title={isCollapsed ? "로그아웃" : undefined}
        >
          <img
            src={LogoutIcon}
            alt="Logout"
            className="w-5 h-5 brightness-0 saturate-100"
          />
          {!isCollapsed && (
            <span className="text-lg font-medium leading-[1.193] tracking-[-0.025em] font-pretendard">
              로그아웃
            </span>
          )}
        </button>
      </div>

      {/* Footer Links */}
      {!isCollapsed && (
        <div className="absolute bottom-2 left-3 right-3 px-4">
          <div className="flex items-center justify-center gap-2 text-xs text-[#989898]">
            <Link
              to="/terms/privacy"
              className="hover:text-[#1C2882] transition-colors"
            >
              개인정보 처리방침
            </Link>
            <span className="text-[#D1D5DB]">|</span>
            <Link
              to="/terms/service"
              className="hover:text-[#1C2882] transition-colors"
            >
              서비스 이용약관
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
