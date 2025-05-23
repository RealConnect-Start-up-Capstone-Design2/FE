import React, { useState } from "react";
import './SelectButton.css';


const StatusSelectButton = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["진행중", "완료", "취소"];

  return (
    <div className="custom-select-wrapper">
      <button
        type="button"
        className="custom-select-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || "진행 상태 선택"} <span className="arrow">▾</span>
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
              {value === option && <span className="check">✔</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatusSelectButton;
