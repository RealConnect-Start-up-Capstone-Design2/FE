import React, { useMemo } from "react";
import "./InquiryNotifications.css";
import "./DashboardShared.css";
// 간단히 아이콘 경로만 가져오기
import bellIcon from "../../../assets/icons/bell.svg";

const InquiryNotifications = () => {
  // 오늘 날짜를 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  // 날짜 포맷 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}. 오후 02:00`;
  };

  // 알림 데이터
  const notification1Date = new Date(year, month, day - 5); // 5일 전
  const notification2Date = new Date(year, month, day - 15); // 15일 전
  const notification3Date = new Date(year, month, day - 35); // 35일 전

  const notificationData = [
    {
      id: 1,
      userName: "최정현님",
      date: formatDate(notification1Date),
      details: "김규식 · 송파구 · 파크리오 · 32평 · 24억 5000",
      description:
        "고객이 송파구 파크리오 단지 내 32평 이상의 매물을 원합니다. 추천 가능한 매물이 있으신가요?",
      createdAt: notification1Date,
      read: false,
      type: "매매",
    },
    {
      id: 2,
      userName: "최정현님",
      date: formatDate(notification2Date),
      details: "김규식 · 송파구 · 파크리오 · 32평 · 24억 5000",
      description:
        "고객이 송파구 파크리오 단지 내 32평 이상의 매물을 원합니다. 추천 가능한 매물이 있으신가요?",
      createdAt: notification2Date,
      read: false,
      type: "매매",
    },
    {
      id: 3,
      userName: "최정현님",
      date: formatDate(notification3Date),
      details: "김규식 · 송파구 · 파크리오 · 32평 · 24억 5000",
      description:
        "고객이 송파구 파크리오 단지 내 32평 이상의 매물을 원합니다. 추천 가능한 매물이 있으신가요?",
      createdAt: notification3Date,
      read: false, // 읽지 않았지만 30일이 지났으므로 NEW 태그가 없어야 함
      type: "매매",
    },
    {
      id: 4,
      userName: "최정현님",
      date: formatDate(notification3Date),
      details: "김규식 · 송파구 · 파크리오 · 32평 · 24억 5000",
      description:
        "고객이 송파구 파크리오 단지 내 32평 이상의 매물을 원합니다. 추천 가능한 매물이 있으신가요?",
      createdAt: notification3Date,
      read: false, // 읽지 않았지만 30일이 지났으므로 NEW 태그가 없어야 함
      type: "매매",
    },
  ];

  const isNew = (createdAt, read) => {
    if (read) return false;

    const now = new Date();
    const thirtyDaysFromCreation = new Date(createdAt);
    thirtyDaysFromCreation.setDate(thirtyDaysFromCreation.getDate() + 30);

    return now < thirtyDaysFromCreation;
  };

  const sortedNotifications = useMemo(() => {
    return [...notificationData].sort((a, b) => b.createdAt - a.createdAt);
  }, [notificationData]);

  return (
    <div className="section_box_shadow inquiry_notification_container">
      <div className="notification_header">
        <p className="section_title">문의 공유 알림</p>
        <div className="bell_icon">
          <img src={bellIcon} alt="알림" width="24" height="24" />
        </div>
      </div>

      <div className="notification_list">
        {sortedNotifications.map((notification) => (
          <div key={notification.id} className="notification_item">
            <div className="profile_and_content">
              <div className="profile_image"></div>
              <div className="notification_content">
                <div className="notification_top_row">
                  <div className="user_and_date">
                    <span className="user_name">
                      {notification.userName}이 공유함
                    </span>
                    <span className="notification_date">
                      {notification.date}
                    </span>
                  </div>
                  <div className="notification_tags">
                    <span className="tag sale_tag">{notification.type}</span>
                    {isNew(notification.createdAt, notification.read) && (
                      <span className="tag new_tag">NEW</span>
                    )}
                  </div>
                </div>
                <p className="notification_details">{notification.details}</p>
                <p className="notification_description">
                  {notification.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquiryNotifications;
