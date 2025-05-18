import React from "react";
import "./addInquiry.css";
import plus from "../../assets/icons/plus.svg";

const AddInquiry = () => {
  return (
    <div className="add-inquiry">
      <img src={plus} alt="plus" className="add-inquiry-img" />
      <span className="add-inquiry-text">문의 추가</span>
    </div>
  );
};

export default AddInquiry;
