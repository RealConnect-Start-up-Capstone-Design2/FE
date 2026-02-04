import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: 추후 실제 로그아웃 로직 구현
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#FDFEFE]">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 ml-[270px] overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col p-9 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
