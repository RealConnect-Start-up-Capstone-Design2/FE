import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils";

// 이미지 불러오기
import Logo from "@/assets/Logo.svg";
import Logout from "@/assets/Logout.svg";
import User from "@/assets/icons/user.svg";

interface AdminSidebarProps {
  className?: string;
  onLogout?: () => void;
}

export function AdminSidebar({ className, onLogout }: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // 기본 로그아웃 동작
      navigate("/login");
    }
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen w-[270px] bg-white border-r border-[rgba(177,182,199,0.4)] shadow-[0px_0px_25px_-10px_rgba(177,182,199,1)] z-50",
        className
      )}
    >
      {/* Header */}
      <div className="bg-[#1C2882] h-[102px] flex items-center px-9">
        <div className="flex items-center gap-3">
          <div className="text-white">
            <img
              src={Logo}
              alt="Home"
              className="w-[29px] h-[29px] text-white"
            />
          </div>
          <p className="text-[28px] text-white font-semibold leading-[1.193] tracking-[-0.025em]">
            관리자 시스템
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-8 left-3 right-3 space-y-3">
        {/* 관리자 프로필 버튼 */}
        <button className="w-full flex items-center gap-4 px-[17px] py-3 rounded-lg bg-[#1C2882] text-white transition-colors h-12">
          <img src={User} alt="User" className="w-[20px] h-[20px]" />
          <span className="text-lg font-medium leading-[1.193] tracking-[-0.025em]">
            관리자 프로필
          </span>
        </button>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-[17px] py-3 rounded-lg text-[#989898] hover:bg-gray-50 transition-colors h-12"
        >
          <img src={Logout} alt="Logout" className="w-[20px] h-[20px]" />
          <span className="text-lg font-medium leading-[1.193] tracking-[-0.025em]">
            로그아웃
          </span>
        </button>
      </div>

      {/* Divider above bottom actions */}
      <div className="absolute bottom-[164px] left-0 right-0 h-px border-t border-[rgba(177,182,199,0.4)]" />
    </div>
  );
}
