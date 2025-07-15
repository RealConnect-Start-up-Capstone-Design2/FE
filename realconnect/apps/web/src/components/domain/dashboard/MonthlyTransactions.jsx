import React from "react";
import "./MonthlyTransactions.css";
import "./DashboardShared.css";

const MonthlyTransactions = () => {
  return (
    <div className="section_box_shadow">
      <p className="section_title">이번 달 거래 완료</p>
      <div className="completed_count_container">
        <p className="count">20건</p>
        <p className="count_trend">+ 8건</p>
      </div>
      <div>
        <p className="count_sub">전월 : 12건</p>
      </div>
      <div className="count_bar">
        {/* 그래프 영역 */}
        그래프 그려야함 지금 이번달 거래 현황, 문의 공유 알림 높이가 제각각인
        부분이 있음. 이것도 고쳐야 됨.
      </div>
    </div>
  );
};

export default MonthlyTransactions;
