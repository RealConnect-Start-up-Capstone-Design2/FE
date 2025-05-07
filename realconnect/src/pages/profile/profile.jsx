import React from "react";
import "../../styles/global.css";
import "./profile.css";

import editProperty from "../../components/editProperty/editProperty";

const Profile = () => {
  return (
    <div>
      <div className="page_header">
        <div>
          <p className="page_title">내 프로필</p>
          <p className="page_description">
            부동산 및 내 사업자 정보 등을 프로필로 보여줍니다.
          </p>
          
        </div>
      </div>

    <div className="page_section profile-page-layout">
      {/* 왼쪽: 프로필 요약 */}
      <div className="profile-summary-container">
      <div>
      <div>
        <p className="profile-section-title">프로필 요약</p>
        <p className="profile-section-sub">개인 및 사무실 정보</p>
      </div>

      <div className="profile-photo" />

      <p className="profile-name">최정현</p>
      <p className="profile-company">리얼커넥트 부동산</p>

      <div className="profile-divider" />
      <div className="profile-info-table">
        <div className="profile-row">
          <span className="profile-label">연락처</span>
          <span className="profile-value">010-1234-2334</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">이메일</span>
          <span className="profile-value">kim@example.com</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">사무실 이름</span>
          <span className="profile-value">리얼커넥트 부동산</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">사무실 주소</span>
          <span className="profile-value">서울특별시 강남구 테헤란로 1234</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">사업자 등록번호</span>
          <span className="profile-value">123-45-67890</span>
        </div>
      </div>
    </div>
      </div>

      {/* 오른쪽: 자기소개 + 사무실 정보 */}
      <div className="profile-right-section">
        <div className="profile-intro-box">
          <p className="profile-section-title">자기 소개</p>
          <p className="profile-section-sub">고객에게 보여질 자기 소개를 작성하세요</p>
          <p className="profile-intro-description">
            10년 이상의 경력을 보유한 부동산 전문가입니다.
          </p>
        </div>

        <div className="profile-office-box">
          <p className="profile-section-title">사무실 정보</p>

          <div className="profile-info-row">
            <span className="profile-label">사무실 주소</span>
            <span className="profile-value">서울특별시 강남구 테헤란로 1234</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">사무실 전화번호</span>
            <span className="profile-value">031-123-1234</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">사무실 사진</span>
            <div className="profile-office-photos">
              <div className="profile-photo-placeholder" />
              <div className="profile-photo-placeholder" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};




export default Profile;
