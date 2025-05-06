import React from "react";
import "./editProperty.css";
import edit from "../../assets/icons/edit.svg";

const editProperty = () => {
  return (
    <div className="edit-property">
      <img src={edit} alt="edit" className="edit-property-img" />
      <span className="edit-property-text">프로필 수정정</span>
    </div>
  );
};

export default editProperty;
