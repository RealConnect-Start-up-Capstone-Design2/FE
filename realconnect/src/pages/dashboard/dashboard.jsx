import React from "react";
import "../../styles/global.css";
import "../../components/dashboard/DashboardShared.css";

// 컴포넌트 불러오기
import ProfileSummary from "../../components/dashboard/ProfileSummary";
import DueDateNotification from "../../components/dashboard/DueDateNotification";
import MonthlyTransactions from "../../components/dashboard/MonthlyTransactions";
import TransactionStatus from "../../components/dashboard/TransactionStatus";
import OngoingInquiries from "../../components/dashboard/ongoingInquiries";
import InquiryNotifications from "../../components/dashboard/InquiryNotifications";

const Dashboard = () => {
  return (
    <div className="page_section">
      <div className="page_header">
        <div className="header_left">
          <p className="page_title">대시보드</p>
          <p className="page_description">
            내 부동산의 대략적인 정보를 보여줍니다.
          </p>
        </div>
      </div>

      <div className="dashboard_layout">
        {/* 왼쪽 컬럼: 프로필 요약 */}
        <div className="dashboard_column">
          <ProfileSummary />
          <DueDateNotification />
        </div>

        {/* 중간 컬럼: 이번달 거래 알림 */}
        <div className="dashboard_column">
          <MonthlyTransactions />
          <TransactionStatus />
        </div>

        {/* 오른쪽 컬럼: 진행 중인 문의 + 문의 공유 알림 */}
        <div className="dashboard_column">
          <OngoingInquiries />
          <InquiryNotifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
