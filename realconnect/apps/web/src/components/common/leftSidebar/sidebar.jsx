import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
//이미지 파일 임포트
import logo from "../../../assets/icons/logo.svg";
import clipboard from "../../../assets/icons/clipboard.svg";
import edit from "../../../assets/icons/edit.svg";
import fileText from "../../../assets/icons/file-text.svg";
import share from "../../../assets/icons/share.svg";
import settings from "../../../assets/icons/settings.svg";
import logout from "../../../assets/icons/logout.svg";

const menuItems = [
  { name: "매물 관리", path: "/properties", icon: clipboard },
  { name: "문의 관리", path: "/inquiries", icon: edit },
  { name: "계약 관리", path: "/contracts", icon: fileText },
  { name: "문의 공유", path: "/shared-inquiries", icon: share },
];

const footerItems = [
  { name: "설정", path: "/settings", icon: settings },
  { name: "로그아웃", path: "/logout", icon: logout },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar-container">
      {/* 로고 섹션 */}
      <Link to="/" className="logo-container">
        <img className="logo-image" src={logo} alt="logo" />
        <span className="logo-text">RealConnect</span>
      </Link>

      {/* 메뉴 섹션 */}
      <div className="menu-container">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <div className="menu-icon">
              <img src={item.icon} alt={item.name} />
            </div>
            <span className="menu-text">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* 하단 섹션 */}
      <div className="sidebar-footer">
        {footerItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`footer-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <div className="menu-icon">
              <img src={item.icon} alt={item.name} />
            </div>
            <span className="menu-text">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
