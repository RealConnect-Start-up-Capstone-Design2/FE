import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

import logo from "@shared/assets/icons/logo.svg";
import clipboard from "@shared/assets/icons/clipboard.svg";
import edit from "@shared/assets/icons/edit.svg";
import fileText from "@shared/assets/icons/file-text.svg";
import share from "@shared/assets/icons/share.svg";
import settings from "@shared/assets/icons/settings.svg";
import logout from "@shared/assets/icons/logout.svg";

const menuItems = [
  { name: "매물 관리", path: "/properties", icon: clipboard, disabled: false },
  { name: "문의 관리", path: "/inquiries", icon: edit, disabled: true },
  { name: "계약 관리", path: "/contracts", icon: fileText, disabled: true },
  { name: "문의 공유", path: "/shared-inquiries", icon: share, disabled: true },
];

const footerItems = [
  { name: "설정", path: "/settings", icon: settings },
  { name: "로그아웃", path: "/logout", icon: logout },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className={styles.sidebarContainer}>
      {/* 로고 섹션 */}
      <Link to="/" className={styles.logoContainer}>
        <img className={styles.logoImage} src={logo} alt="logo" />
        <span className={styles.logoText}>RealConnect</span>
      </Link>

      {/* 메뉴 섹션 */}
      <div className={styles.menuContainer}>
        {menuItems.map((item) => {
          const className = `${styles.menuItem} ${
            location.pathname === item.path ? styles.active : ""
          } ${item.disabled ? styles.disabled : ""}`;

          const content = (
            <>
              <div className={styles.menuIcon}>
                <img src={item.icon} alt={item.name} />
              </div>
              <span className={styles.menuText}>{item.name}</span>
            </>
          );

          return item.disabled ? (
            <div key={item.name} className={className}>
              {content}
            </div>
          ) : (
            <Link key={item.name} to={item.path} className={className}>
              {content}
            </Link>
          );
        })}
      </div>

      {/* 하단 섹션 */}
      <div className={styles.sidebarFooter}>
        {footerItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`${styles.footerItem} ${
              location.pathname === item.path ? styles.active : ""
            }`}
          >
            <div className={styles.menuIcon}>
              <img src={item.icon} alt={item.name} />
            </div>
            <span className={styles.menuText}>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
