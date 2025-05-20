import React, { useState } from "react";

import RegionalFilter from "../components/regionalFilter/regionalFilter";
import TransactionType from "../components/sortButtons/transactionType";
import AddProperty from "../components/addProperrty/addProperty";
import DeleteProperty from "../components/deleteProperty/deleteProperty";

const SharedInquiries = () => {
  const [activeView, setActiveView] = useState("all");

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="page_section">
      <div className="page_header">
        <div className="header_left">
          <div className="page_title">문의 공유</div>
          <div className="page_description">
            타 부동산 업소와 공유하는 고객의 문의 목록입니다
          </div>
        </div>
        <div className="view_selector">
          <button
            className={`view_option ${activeView === "all" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("all")}
          >
            전체
          </button>
          <button
            className={`view_option ${activeView === "my" ? "view_option--active" : ""}`}
            onClick={() => handleViewChange("my")}
          >
            내 문의
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "1.6rem",
        }}
      >
        <div style={{ width: "400px" }}>
          <RegionalFilter />
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <TransactionType />
          <AddProperty />
          <DeleteProperty />
        </div>
        {/* 문의 공유 목록 */}
      </div>
      <div className="page_content"></div>
    </div>
  );
};

export default SharedInquiries;
