import React from "react";
import "./editProperty.css";
import pencil from "../../../assets/icons/pencil.svg";

const editProperty = () => {
  return (
    <div className="edit-property">
      <img src={pencil} alt="pencil" className="edit-property-img" />
      <span className="edit-property-text">프로필 수정</span>
    </div>
  );
};

export default editProperty;
