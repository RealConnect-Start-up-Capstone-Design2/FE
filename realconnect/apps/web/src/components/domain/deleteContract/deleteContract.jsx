import React from "react";
import "./deleteContract.css";
import deleteIcon from "../../../assets/icons/trash.svg";

const DeleteContract = () => {
  return (
    <div className="delete-contract">
      <img src={deleteIcon} alt="delete" className="delete-contract-img" />
      <span className="delete-contract-text">계약 삭제</span>
    </div>
  );
};

export default DeleteContract;
