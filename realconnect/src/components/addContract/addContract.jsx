import React from "react";
import "./addContract.css";
import plus from "../../assets/icons/plus.svg";

const AddContract = () => {
  return (
    <div className="add-contract">
      <img src={plus} alt="plus" className="add-contract-img" />
      <span className="add-contract-text">계약 작성</span>
    </div>
  );
};

export default AddContract;
