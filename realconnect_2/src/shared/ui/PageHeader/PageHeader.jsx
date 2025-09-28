import React from "react";
import { ViewSelector } from "@shared/ui";

/**
 * PageHeader - 공용 페이지 헤더 컴포넌트
 * @param {object} props
 * @param {string} props.title - 페이지 제목
 * @param {string} props.description - 페이지 설명
 * @param {Array} [props.viewOptions] - ViewSelector 옵션들
 * @param {string} [props.activeView] - 현재 활성화된 뷰
 * @param {Function} [props.onViewChange] - 뷰 변경 핸들러
 */
export const PageHeader = ({
  title,
  description,
  viewOptions,
  activeView,
  onViewChange,
}) => {
  return (
    <div className="page_header">
      <div className="header_left">
        <p className="page_title">{title}</p>
        <p className="page_description">{description}</p>
      </div>
      {viewOptions && (
        <ViewSelector
          options={viewOptions}
          active={activeView}
          onChange={onViewChange}
        />
      )}
    </div>
  );
};
