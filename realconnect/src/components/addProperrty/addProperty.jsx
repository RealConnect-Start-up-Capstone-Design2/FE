import React from "react";
import "./addProperty.css";
import plus from "../../assets/icons/plus.svg";

const AddProperty = () => {
  return (
    <div className="add-property">
      <img src={plus} alt="plus" className="add-property-img" />
      <span className="add-property-text">매물 추가</span>
    </div>
  );
};

export default AddProperty;
