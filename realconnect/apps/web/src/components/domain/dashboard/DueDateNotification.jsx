import React from "react";
import "./DueDateNotification.css";
import "./DashboardShared.css";

// 이미지 불러오기
import Clock from "../../../assets/icons/clock.svg";

const DueDateNotification = () => {
  // 타이머 아이콘의 클래스명을 계산하는 함수
  const getTimerIconClass = (daysLeft) => {
    if (daysLeft < 10) {
      return "timer-icon-urgent"; // 10일 미만: 빨간색 (기본)
    } else if (daysLeft < 30) {
      return "timer-icon-warning"; // 10일 이상 30일 미만: 노란색 (#F7C351)
    } else {
      return "timer-icon-safe"; // 30일 이상: 초록색 (#189554)
    }
  };

  // 예시 데이터
  const notifications = [
    {
      id: 1,
      title: "파크리오 아파트 101동 1012호",
      name: "김규식",
      type: "매매",
      dueDate: "2025년 05월 12일",
      daysLeft: 1,
    },
    {
      id: 2,
      title: "파크리오 아파트 101동 1012호",
      name: "김규식",
      type: "매매",
      dueDate: "2025년 05월 12일",
      daysLeft: 15,
    },
    {
      id: 3,
      title: "파크리오 아파트 101동 1012호",
      name: "김규식",
      type: "매매",
      dueDate: "2025년 05월 12일",
      daysLeft: 30,
    },
    {
      id: 4,
      title: "파크리오 아파트 101동 1012호",
      name: "김규식",
      type: "매매",
      dueDate: "2025년 05월 12일",
      daysLeft: 30,
    },
    {
      id: 5,
      title: "파크리오 아파트 101동 1012호",
      name: "김규식",
      type: "매매",
      dueDate: "2025년 05월 12일",
      daysLeft: 30,
    },
  ];

  return (
    <div className="section_box_shadow">
      <p className="section_title">만기일 알림</p>
      <div className="due_date_items_container">
        {notifications.map((notification) => (
          <div key={notification.id} className="due_date_item">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p className="due_date_item_title">{notification.title}</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.3rem",
                }}
              >
                <img
                  src={Clock}
                  alt="clock"
                  className={getTimerIconClass(notification.daysLeft)}
                />
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    lineHeight: "1.2rem",
                  }}
                >
                  {notification.daysLeft} 일 남음
                </p>
              </div>
            </div>
            <div className="due_date_item_date_description_container">
              <p className="due_date_item_date_description">
                {notification.name}
              </p>
              <p className="due_date_item_date_description">·</p>
              <p className="due_date_item_date_description">
                {notification.type}
              </p>
              <p className="due_date_item_date_description">·</p>
              <p className="due_date_item_date_description">만기일</p>
              <p className="due_date_item_date_description">
                {notification.dueDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DueDateNotification;
