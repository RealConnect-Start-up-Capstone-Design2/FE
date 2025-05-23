import React, { useState, useRef, useEffect } from "react";
import './TagButton.css';

const ContractTagButton = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(null);

  const options = ["계약 전", "계약 중", "계약 완료"];

  useEffect(() => {
    if (buttonRef.current) {
      setMenuWidth(buttonRef.current.offsetWidth);
    }
  }, [isOpen, value]);

  return (
    <div className={`tag-custom-select-wrapper ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className="tag-contract-select-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "계약 상태 선택"} <span className="tag-arrow">▼</span>
      </button>
      {isOpen && (
        <ul
          className="tag-custom-select-list"
          style={{ width: menuWidth ? `${menuWidth}px` : "auto" }}
        >
          {options.map((option) => (
            <li
              key={option}
              className={`tag-custom-select-item ${value === option ? "selected" : ""}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
              {value === option && <span className="tag-check">✔</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContractTagButton;
