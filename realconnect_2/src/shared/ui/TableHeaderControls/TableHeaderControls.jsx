import React from "react";
import styles from "./TableHeaderControls.module.css";

/**
 * TableHeaderControls - 상단 검색/정렬/버튼 영역 공통 레이아웃
 * @param {object} props
 * @param {React.ReactNode} props.search - 좌측 검색창
 * @param {React.ReactNode} props.rightChildren - 우측 정렬/버튼 영역
 * @param {string} [props.className] - 추가 클래스명
 */
export const TableHeaderControls = ({ search, rightChildren, className }) => (
  <div className={`${styles.tableHeaderControls} ${className || ""}`}>
    <div className={styles.leftSection}>{search}</div>
    <div className={styles.rightSection}>{rightChildren}</div>
  </div>
);
