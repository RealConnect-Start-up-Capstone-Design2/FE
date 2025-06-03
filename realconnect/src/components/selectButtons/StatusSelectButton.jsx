import React, { useState } from "react";
import "./SelectButton.css";
import checkIcon from "/src/assets/icons/check.svg";
import arrowIcon from "/src/assets/icons/downArrow.svg";

const StatusSelectButton = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["진행 중", "완료"];

  return (
    <div className="custom-select-wrapper">
      <button
        type="button"
        className="custom-select-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="custom-select-button-text">
          {value || "진행 상태 선택"}
        </div>
        <img
          src={arrowIcon}
          alt="화살표"
          className={`arrow-icon ${isOpen ? "rotate-up" : ""}`}
        />
      </button>
      {isOpen && (
        <ul className="custom-select-list">
          {options.map((option) => (
            <li
              key={option}
              className={`custom-select-item ${value === option ? "selected" : ""}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
              {value === option && (
                <img src={checkIcon} alt="선택됨" className="check-icon" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatusSelectButton;
