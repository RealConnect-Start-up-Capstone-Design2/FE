import React, { useState } from "react";
import './SelectButton.css';

const InquirySelectButton = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["매매", "전세", "월세"];

  return (
    <div className="custom-select-wrapper">
      <button
        type="button"
        className="custom-select-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || "문의 유형 선택"} <span className="arrow">▾</span>
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

export default InquirySelectButton;
