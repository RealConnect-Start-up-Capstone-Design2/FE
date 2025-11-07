import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores";
import { logout } from "@/features/auth/services/authService";

// 이미지 불러오기
import Logo from "@/assets/Logo.svg";
import ClipboardIcon from "@/assets/Clipboard.svg";
import EditIcon from "@/assets/Edit.svg";
import FileTextIcon from "@/assets/FileText.svg";
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

const menuItems: MenuItem[] = [
  {
    id: "property-manage",
    label: "매물장",
    path: "/property-manage",
    icon: ClipboardIcon,
    disabled: false,
  },
  {
    id: "inquiry-manage",
    label: "문의 관리",
    path: "/inquiry-manage",
    icon: EditIcon,
    disabled: true,
  },
  {
    id: "contract-manage",
    label: "계약 관리",
    path: "/contract-manage",
    icon: FileTextIcon,
    disabled: true,
  },
  {
    id: "inquiry-share",
    label: "문의 공유",
    path: "/inquiry-share",
    icon: ShareIcon,
    disabled: true,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { accessToken, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();

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
        className
      )}
    >
      {/* Header */}
      <div className="bg-[#1C2882] flex items-center px-9 py-9">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Home" className="w-[29px] h-[29px] text-white" />
          <p className="text-[28px] text-[#FFFFFF] font-semibold">
            RealConnect
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-3 py-6 space-y-3">
        {menuItems.map((item) => {
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
                isActive
                  ? "bg-[#1C2882] text-white"
                  : "bg-white text-[#989898] hover:bg-gray-50"
              )}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={cn(
                  "w-5 h-5",
                  isActive ? "brightness-0 invert" : "brightness-0 saturate-100"
                )}
              />
              <span className="text-lg font-medium leading-[1.193] tracking-[-0.025em] font-pretendard">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-8 left-3 right-3 space-y-3">
        <Link
          to="/my-page"
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#989898] hover:bg-gray-50 transition-colors"
        >
          <img
            src={SettingsIcon}
            alt="Settings"
            className="w-5 h-5 brightness-0 saturate-100"
          />
          <span className="text-lg font-medium leading-[1.193] tracking-[-0.025em] font-pretendard">
            마이페이지
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[#989898] hover:bg-gray-50 transition-colors"
        >
          <img
            src={LogoutIcon}
            alt="Logout"
            className="w-5 h-5 brightness-0 saturate-100"
          />
          <span className="text-lg font-medium leading-[1.193] tracking-[-0.025em] font-pretendard">
            로그아웃
          </span>
        </button>
      </div>
    </div>
  );
}
