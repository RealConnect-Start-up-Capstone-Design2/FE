import React, { useState, useEffect } from "react";
import "./SelectButton.css";
import checkIcon from "/src/assets/icons/check.svg";
import arrowIcon from "/src/assets/icons/downArrow.svg";

const InquirySelectButton = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["매매", "전세", "월세"];

  // 값이 변경될 때마다 로그 출력 (디버깅용)
  useEffect(() => {
    console.log("InquirySelectButton 현재 값:", value);
  }, [value]);

  return (
    <div className="custom-select-wrapper">
      <button
        type="button"
        className="custom-select-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || "문의 유형 선택"}

        <span>
          <img
            src={arrowIcon}
            alt="화살표"
            className={`arrow-icon ${isOpen ? "rotate-up" : ""}`}
          />
        </span>
      </button>
      {isOpen && (
        <ul className="custom-select-list">
          {options.map((option) => (
            <li
              key={option}
              className={`custom-select-item ${value === option ? "selected" : ""}`}
              onClick={() => {
                console.log("선택된 문의 유형:", option); // 선택 시 로그 출력
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

export default InquirySelectButton;
