import React from "react";
import "./addInquiry.css";
import plus from "../../assets/icons/plus.svg";

const AddInquiry = ({ onAddInquiry, adding }) => {
  const handleClick = () => {
    // 새 문의 추가 사이드바를 열도록 부모 컴포넌트에 알림
    if (onAddInquiry) {
      // 빈 문의 객체 생성
      const emptyInquiry = {
        name: "",
        phone: "",
        apartmentName: "",
        area: "",
        salePrice: "",
        jeonsePrice: "",
        deposit: "",
        monthPrice: "",
        memo: "",
        inquiryType: "",
        status: "",
      };

      onAddInquiry(emptyInquiry);
    }
  };

  return (
    <div
      className="add-inquiry"
      onClick={handleClick}
      style={{ cursor: adding ? "wait" : "pointer" }}
    >
      <img src={plus} alt="plus" className="add-inquiry-img" />
      <span className="add-inquiry-text">문의 추가</span>
    </div>
  );
};

export default AddInquiry;
