import React from "react";
import styles from "./Badge.web.module.css";

/**
 * 웹용 Badge 컴포넌트
 * 상태나 카테고리를 시각적으로 표시하는 라벨 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.label - 표시할 텍스트
 * @param {string} props.variant - 상태/유형 (예: '계약중', '계약완료', '매매', '전세', '월세' 등)
 * @param {string} props.className - 추가 CSS 클래스
 */
const Badge = ({ label, variant, className = "" }) => {
  return (
    <span className={`${styles.badge} ${styles[variant] || ""} ${className}`}>
      {label}
    </span>
  );
};

export { Badge };
