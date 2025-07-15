import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSummary.css";
import "./DashboardShared.css";

// 이미지 불러오기
import DefaultProfile from "@/assets/icons/defaultProfile.svg";
import Phone from "@/assets/icons/phone.svg";
import Email from "@/assets/icons/mail.svg";
import Location from "@/assets/icons/location.svg";
import IntoArrow from "@/assets/icons/intoArrow.svg";

const ProfileSummary = () => {
  const navigate = useNavigate();

  const handleProfileManagement = () => {
    navigate("/profile");
  };

  return (
    <div className="section_box_shadow">
      <p className="section_title">프로필 요약</p>
      <div className="profile_summary">
        <div className="profile_summary_item">
          <img src={DefaultProfile} alt="defaultProfile" />
        </div>
        <div>
          <div className="profile_name">최정현</div>
          <div className="profile_job">부동산 중개사</div>
          <div className="profile_location">리얼커넥트 부동산</div>
        </div>
      </div>
      <div className="profile_contact">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <img src={Phone} alt="phone" />
          <p>010-1234-5678</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <img src={Email} alt="email" />
          <p>example@gmail.com</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <img src={Location} alt="location" />
          <p>서울특별시 강남구 테헤란로 1234</p>
        </div>
        <div className="edit_button_container">
          <button className="edit_button" onClick={handleProfileManagement}>
            프로필 관리
            <img src={IntoArrow} alt="intoArrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
