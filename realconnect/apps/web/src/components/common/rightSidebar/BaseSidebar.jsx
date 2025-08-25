import React from "react";
import "./BaseSidebar.css";

/**
 * 공통 우측 사이드바 컴포넌트
 * 모든 사이드바에서 공통으로 사용되는 레이아웃과 애니메이션 제공
 */
const BaseSidebar = ({
  title,
  onClose,
  isClosing = false,
  children,
  footerContent,
  className = "",
  width = "33rem",
}) => {
  return (
    <>
      {/* 오버레이 */}
      <div
        className={`sidebar-overlay ${isClosing ? "closing" : ""}`}
        onClick={onClose}
      />

      {/* 사이드바 */}
      <div
        className={`base-sidebar ${isClosing ? "closing" : ""} ${className}`}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 - 고정 */}
        <div className="sidebar-header">
          <h3 className="sidebar-title">{title}</h3>
          <button className="close-button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        {/* 컨텐츠 - 스크롤 가능 */}
        <div className="sidebar-content">{children}</div>

        {/* 푸터 - 고정 (선택적) */}
        {footerContent && <div className="sidebar-footer">{footerContent}</div>}
      </div>
    </>
  );
};

export default BaseSidebar;
