import React from "react";

/**
 * TableHeaderControls - 상단 검색/정렬/버튼 영역 공통 레이아웃
 * @param {object} props
 * @param {React.ReactNode} props.search - 좌측 검색창
 * @param {React.ReactNode} props.rightChildren - 우측 정렬/버튼 영역
 * @param {React.CSSProperties} [props.style] - 추가 스타일
 */
const TableHeaderControls = ({ search, rightChildren, style }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: "1.6rem",
      ...style,
    }}
  >
    <div style={{ width: "400px" }}>{search}</div>
    <div style={{ display: "flex", gap: "0.8rem" }}>{rightChildren}</div>
  </div>
);

export default TableHeaderControls; 