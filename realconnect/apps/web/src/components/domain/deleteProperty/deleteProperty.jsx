import React from "react";
import "./deleteProperty.css";
import deleteIcon from "../../../assets/icons/trash.svg";

const DeleteProperty = () => {
  return (
    <div className="delete-property">
      <img src={deleteIcon} alt="delete" className="delete-property-img" />
      <span className="delete-property-text">매물 삭제</span>
    </div>
  );
};

export default DeleteProperty;
