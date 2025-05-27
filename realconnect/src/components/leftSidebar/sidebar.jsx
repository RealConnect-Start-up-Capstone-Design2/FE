import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";
//이미지 파일 임포트
import logo from "../../assets/icons/logo.svg";
import clipboard from "../../assets/icons/clipboard.svg";
import edit from "../../assets/icons/edit.svg";
import fileText from "../../assets/icons/file-text.svg";
import share from "../../assets/icons/share.svg";
import settings from "../../assets/icons/settings.svg";
import logout from "../../assets/icons/logout.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 각 메뉴별 경로 정의
  const menuRoutes = {
    logo: "/",
    "매물 관리": "/properties",
    "문의 관리": "/inquiries",
    "계약 관리": "/contracts",
    "문의 공유": "/shared-inquiries",
    설정: "/settings",
    로그아웃: "/logout",
  };

  // 현재 경로에 따라 초기 활성 메뉴 결정
  const getInitialActiveMenu = () => {
    const path = location.pathname;

    // 루트 경로(대시보드)에서는 아무 메뉴도 활성화하지 않음
    if (path === "/") return "";

    for (const [menu, route] of Object.entries(menuRoutes)) {
      if (path === route) return menu;
    }

    return ""; // 기본값은 아무것도 선택 안 함
  };

  // 선택된 메뉴 항목을 추적하는 상태 변수
  const [activeMenu, setActiveMenu] = useState(getInitialActiveMenu);

  // 경로 변경 시 활성 메뉴 업데이트
  useEffect(() => {
    setActiveMenu(getInitialActiveMenu());
  }, [location.pathname]);

  // 메뉴 항목 클릭 핸들러
  const handleMenuClick = (menuName, e) => {
    // 혹시 진행 중인 다른 이벤트가 있다면 중단
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 현재 활성화된 메뉴를 변경
    setActiveMenu(menuName);

    // 비동기로 실행하여 상태 업데이트가 완료된 후 라우팅
    setTimeout(() => {
      navigate(menuRoutes[menuName]);
    }, 10);
  };

  // 로고 클릭 핸들러
  const handleLogoClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setActiveMenu(""); // 로고 클릭 시 아무 메뉴도 선택되지 않음

    setTimeout(() => {
      navigate("/");
    }, 10);
  };

  return (
    <div className="sidebar-container">
      {/* 로고 섹션 */}
      <div className="logo-container" onClick={(e) => handleLogoClick(e)}>
        <img className="logo-image" src={logo} alt="logo" />
        <span className="logo-text">RealConnect</span>
      </div>

      {/* 메뉴 섹션 */}
      <div className="menu-container">
        {/* 매물 관리 */}
        <div
          className={`menu-item ${activeMenu === "매물 관리" ? "active" : ""}`}
          onClick={(e) => handleMenuClick("매물 관리", e)}
        >
          <div className="menu-icon">
            <img src={clipboard} alt="매물 관리" />
          </div>
          <span className="menu-text">매물 관리</span>
        </div>

        {/* 문의 관리 */}
        <div
          className={`menu-item ${activeMenu === "문의 관리" ? "active" : ""}`}
          onClick={(e) => handleMenuClick("문의 관리", e)}
        >
          <div className="menu-icon">
            <img src={edit} alt="문의 관리" />
          </div>
          <span className="menu-text">문의 관리</span>
        </div>

        {/* 계약 관리 */}
        <div
          className={`menu-item ${activeMenu === "계약 관리" ? "active" : ""}`}
          onClick={(e) => handleMenuClick("계약 관리", e)}
        >
          <div className="menu-icon">
            <img src={fileText} alt="계약 관리" />
          </div>
          <span className="menu-text">계약 관리</span>
        </div>

        {/* 문의 공유 */}
        <div
          className={`menu-item ${activeMenu === "문의 공유" ? "active" : ""}`}
          onClick={(e) => handleMenuClick("문의 공유", e)}
        >
          <div className="menu-icon">
            <img src={share} alt="문의 공유" />
          </div>
          <span className="menu-text">문의 공유</span>
        </div>
      </div>

      {/* 하단 섹션 */}
      <div className="sidebar-footer">
        <div
          className={`footer-item ${activeMenu === "설정" ? "active" : ""}`}
          onClick={(e) => handleMenuClick("설정", e)}
        >
          <div className="menu-icon">
            <img src={settings} alt="설정" />
          </div>
          <span className="menu-text">설정</span>
        </div>

        <div
          className={`footer-item ${activeMenu === "로그아웃" ? "active" : ""}`}
          onClick={(e) => handleMenuClick("로그아웃", e)}
        >
          <div className="menu-icon">
            <img src={logout} alt="로그아웃" />
          </div>
          <span className="menu-text">로그아웃</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
