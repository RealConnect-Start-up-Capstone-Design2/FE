import React from "react";
import { PageHeader } from "@shared/ui";
import styles from "./DashboardWidget.module.css";

export const DashboardWidget = () => {
  return (
    <div className="page_section">
      <PageHeader
        title="대시보드"
        description="부동산 관리 현황을 한눈에 확인하세요."
      />

      <div className={styles.dashboardWidget}>
        <div className={styles.dashboardLayout}>
          {/* 왼쪽 컬럼 */}
          <div className={styles.dashboardColumn}>
            <div className={styles.card}>
              <h3>프로필 요약</h3>
              <p>사용자 정보 및 기본 통계</p>
            </div>
            <div className={styles.card}>
              <h3>만기일 알림</h3>
              <p>임박한 계약 만료일</p>
            </div>
          </div>

          {/* 중간 컬럼 */}
          <div className={styles.dashboardColumn}>
            <div className={styles.card}>
              <h3>이번달 거래</h3>
              <p>월별 거래 현황</p>
            </div>
            <div className={styles.card}>
              <h3>거래 상태</h3>
              <p>진행 중인 거래 현황</p>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className={styles.dashboardColumn}>
            <div className={styles.card}>
              <h3>진행 중인 문의</h3>
              <p>현재 처리 중인 문의</p>
            </div>
            <div className={styles.card}>
              <h3>문의 공유 알림</h3>
              <p>공유된 문의 현황</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
