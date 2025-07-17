import React from "react";
import styles from "./badge.module.css";

/**
 * @param {Object} props
 * @param {string} props.label - 표시할 텍스트
 * @param {string} props.variant - 상태/유형(예: '계약중', '계약완료', '매매', '전세', '월세' 등)
 */
const Badge = ({ label, variant }) => {
  return (
    <span className={`${styles.badge} ${styles[variant] || ""}`}>{label}</span>
  );
};

export default Badge; 