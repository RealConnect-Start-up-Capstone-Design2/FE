import React from "react";
import "../../styles/global.css";
import "./profile.css";
import EditPropertyButton from "../../components/domain/editProperty/editProperty";

const Profile = () => {
  return (
    <div>
      <div className="page_header">
        <div>
          <p className="page_title">내 프로필</p>
          <p className="page_description">
            부동산 및 내 사업자 정보 등을 프로필로 보여줍니다.
          </p>
          <div className="edit-property-button">
            <EditPropertyButton />
          </div>
        </div>
      </div>
      <div className="profile-container">
        <div className="profile-summary">
          <ProfileSummary />
        </div>
        <div className="profile-details">
          <ProfileIntroduce />
          <ProfileCompany />
        </div>
      </div>
    </div>
  );
};

const ProfileSummary = () => {
  return (
    <div className="profile-summary-box">
      <div className="profile-summary-title">프로필 요약</div>
      <div className="profile-summary-sub">개인 및 사무실 정보</div>

      <div className="profile-summary-photo" />

      <div className="profile-summary-name">최정현</div>
      <div className="profile-summary-company">리얼커넥트 부동산</div>

      <div className="profile-summary-divider"></div>
      <div className="profile-summary-frame">
        <div className="profile-summary-label">연락처</div>
        <div className="profile-summary-value">010-3086-8805</div>
      </div>

      <div className="profile-summary-frame">
        <div className="profile-summary-label">이메일</div>
        <div className="profile-summary-value">realconnect@gmail.com</div>
      </div>

      <div className="profile-summary-frame">
        <div className="profile-summary-label">사무실 이름</div>
        <div className="profile-summary-value">리얼커넥트 부동산</div>
      </div>

      <div className="profile-summary-frame">
        <div className="profile-summary-label">사무실 주소</div>
        <div className="profile-summary-value">
          서울특별시 강남구 테헤란로 1234
        </div>
      </div>

      <div className="profile-summary-frame">
        <div className="profile-summary-label">사업자 등록 번호</div>
        <div className="profile-summary-value">123-45-67890</div>
      </div>
    </div>
  );
};

const ProfileIntroduce = () => {
  return (
    <div className="profile-introduce-box">
      <div className="profile-introduce-title">자기 소개</div>
      <div className="profile-introduce-sub">
        고객에게 보여질 자기 소개를 작성하세요
      </div>
      <p className="profile-introduce-text">
        10년 이상의 경력을 보유한 부동산 전문가입니다.
      </p>
    </div>
  );
};

const ProfileCompany = () => {
  return (
    <div className="profile-company-box">
      <div className="profile-company-title">사무실 정보</div>
      <div className="profile-company-frame">
        <span className="profile-company-label">사무실 주소</span>
        <span className="profile-company-value">
          서울특별시 강남구 테헤란로 1234
        </span>
      </div>

      <div className="profile-company-frame">
        <div className="profile-company-label">사무실 전화번호</div>
        <div className="profile-company-value">031-123-1234</div>
      </div>

      <div className="profile-company-label">사무실 사진</div>
      <div className="profile-photo-frame">
        <div className="profile-company-img"></div>
        <div className="profile-company-img"></div>
      </div>
    </div>
  );
};
export default Profile;
