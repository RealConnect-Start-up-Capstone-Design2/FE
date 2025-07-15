import React from "react";
import "./deleteInquiry.css";
import deleteIcon from "../../../assets/icons/trash.svg";

const DeleteInquiry = () => {
  return (
    <div className="delete-inquiry">
      <img src={deleteIcon} alt="delete" className="delete-inquiry-img" />
      <span className="delete-inquiry-text">문의 삭제</span>
    </div>
  );
};

export default DeleteInquiry;
