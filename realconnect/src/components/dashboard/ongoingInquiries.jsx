import React from "react";
import "./ongoingInquiries.css";
import "./DashboardShared.css";

const OngoingInquiries = () => {
  // 문의 데이터
  const inquiryData = {
    total: 8,
    completed: 24,
    types: {
      매매: 1,
      전세: 4,
      월세: 3,
    },
  };

  // 진행바 너비 계산 (총 문의 중 현재 진행 중인 문의의 비율)
  const progressPercentage = Math.ceil(
    (inquiryData.total / inquiryData.completed) * 100
  );

  return (
    <div className="section_box_shadow ongoing_inquiries_container">
      <div className="ongoing_inquiries_header">
        <p className="section_title">진행중인 문의</p>
        <div className="inquiry_type_counts">
          <span className="inquiry_type_count">
            매매 {inquiryData.types.매매}
          </span>
          <span className="inquiry_type_count">
            전세 {inquiryData.types.전세}
          </span>
          <span className="inquiry_type_count">
            월세 {inquiryData.types.월세}
          </span>
        </div>
      </div>

      <div className="inquiry_count_section">
        <div className="main_count">{inquiryData.total}건</div>
        <div className="total_count">총 문의: {inquiryData.completed}건</div>
      </div>

      <div className="inquiry_progress_bar">
        <div
          className="progress_fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OngoingInquiries;
