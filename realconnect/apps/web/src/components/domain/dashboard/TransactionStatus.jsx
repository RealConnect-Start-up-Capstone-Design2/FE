import React from "react";
import "./TransactionStatus.css";
import "./DashboardShared.css";

const TransactionStatus = () => {
  // 거래 데이터
  const transactionData = {
    contractStatus: {
      before: 5,
      ongoing: 3,
      completed: 1,
    },
    transactionTypes: {
      trade: 3, // 매매
      jeonse: 5, // 전세
      monthly: 12, // 월세
    },
    totalAmount: "8억 5000만원",
    increasePercentage: 18,
  };

  // 전체 거래 수 계산
  const totalTransactions =
    transactionData.transactionTypes.trade +
    transactionData.transactionTypes.jeonse +
    transactionData.transactionTypes.monthly;

  // 각 거래 유형의 비율 계산
  const calculatePercentage = (value) => {
    return ((value / totalTransactions) * 100).toFixed(0) + "%";
  };

  return (
    <div className="section_box_shadow">
      <p className="section_title">이번달 거래 현황</p>
      <p className="page_description">2025년 5월 거래 현황</p>
      <div className="transaction_status_container">
        <p className="status_subtitle">거래 상태</p>
        <div className="transaction_status_row">
          {/* 계약 전 컨테이너 */}
          <div className="before_contract_container">
            <p>계약 전</p>
            <p className="contract_number">
              {transactionData.contractStatus.before}
            </p>
          </div>
          {/* 계약 중 컨테이너 */}
          <div className="ongoing_contract_container">
            <p>계약 중</p>
            <p className="contract_number">
              {transactionData.contractStatus.ongoing}
            </p>
          </div>
          {/* 계약 완료 컨테이너 */}
          <div className="completed_contract_container">
            <p>계약 완료</p>
            <p className="contract_number">
              {transactionData.contractStatus.completed}
            </p>
          </div>
        </div>

        <p className="status_subtitle">거래 유형</p>
        <div className="transaction_types_container">
          <div className="transaction_type_row">
            <span className="transaction_type_label">매매</span>
            <div className="transaction_bar_container">
              <div
                className="transaction_bar trade"
                style={{
                  width: calculatePercentage(
                    transactionData.transactionTypes.trade
                  ),
                }}
              ></div>
            </div>
            <span className="transaction_type_count">
              {transactionData.transactionTypes.trade}건
            </span>
          </div>
          <div className="transaction_type_row">
            <span className="transaction_type_label">전세</span>
            <div className="transaction_bar_container">
              <div
                className="transaction_bar jeonse"
                style={{
                  width: calculatePercentage(
                    transactionData.transactionTypes.jeonse
                  ),
                }}
              ></div>
            </div>
            <span className="transaction_type_count">
              {transactionData.transactionTypes.jeonse}건
            </span>
          </div>
          <div className="transaction_type_row">
            <span className="transaction_type_label">월세</span>
            <div className="transaction_bar_container">
              <div
                className="transaction_bar monthly"
                style={{
                  width: calculatePercentage(
                    transactionData.transactionTypes.monthly
                  ),
                }}
              ></div>
            </div>
            <span className="transaction_type_count">
              {transactionData.transactionTypes.monthly}건
            </span>
          </div>
          <div className="transaction_total">전체 {totalTransactions}건</div>
        </div>

        <div className="transaction_amount_container">
          <div className="transaction_amount_content">
            <p className="transaction_amount_label">$ 총 거래 금액</p>
            <div className="transaction_amount_row">
              <p className="transaction_amount_value">
                {transactionData.totalAmount}
              </p>
              <p className="transaction_amount_change">
                <span className="increase_arrow">↑</span> 전월 대비{" "}
                {transactionData.increasePercentage}% 증가
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
