import React from "react";
import "./AddButton.css";
import plus from "../../../assets/icons/plus.svg";
import { AddButtonProps } from "./AddButton.types";

/**
 * @param {AddButtonProps} props
 */
const AddButton = ({ text, onClick, disabled = false }) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`add-button ${disabled ? "disabled" : ""}`}
      onClick={handleClick}
    >
      <img src={plus} alt="plus" className="add-button-img" />
      <span className="add-button-text">{text}</span>
    </div>
  );
};

export default AddButton;
