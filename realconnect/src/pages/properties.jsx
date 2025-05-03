import React, { useState } from "react";

const Properties = () => {
  const [activeView, setActiveView] = useState("전체");

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="properties_page">
      {/* 페이지 헤더 영역 (수평 레이아웃) */}
      <div className="properties_header">
        <div className="header_left">
          <p className="page_title">매물 관리</p>
          <p className="page_description">현재 등록된 매물 목록입니다.</p>
        </div>
        <div className="properties_view_selector">
          <button
            className={`properties_view_option ${activeView === "전체" ? "properties_view_option--active" : ""}`}
            onClick={() => handleViewChange("전체")}
          >
            전체
          </button>
          <button
            className={`properties_view_option ${activeView === "내 물건" ? "properties_view_option--active" : ""}`}
            onClick={() => handleViewChange("내 물건")}
          >
            내 물건
          </button>
        </div>
      </div>

      {/* 매물 컨텐츠 */}
      <div className="properties_content">
        {activeView === "전체" ? (
          <div>
            전체 매물 목록이 표시됩니다.전체 매물 목록이 표시됩니다.전체 매물
            목록이 표시됩니다.전체 매물 목록이 표시됩니다.전체 매물 목록이
            표시됩니다.전체 매물 목록이 표시됩니다.전체 매물 목록이
            표시됩니다.전체 매물 목록이 표시됩니다.전체 매물 목록이
            표시됩니다.전체 매물 목록이 표시됩니다.전체 매물 목록이
            표시됩니다.전체 매물 목록이 표시됩니다.전체 매물 목록이
            표시됩니다.전체 매물 목록이 표시됩니다.전체 매물 목록이
            표시됩니다.전체 매물 목록이 표시됩니다.전체 매물 목록이
            표시됩니다.전체 매물 목록이 표시됩니다.전체 매물 목록이
            표시됩니다.전체 매물 목록이 표시됩니다.
          </div>
        ) : (
          <div>내 물건 목록이 표시됩니다.</div>
        )}
      </div>
    </div>
  );
};

export default Properties;
