import React, { useState, useEffect } from "react";
import "./SelectButton.css";
import checkIcon from "/src/assets/icons/check.svg";
import arrowIcon from "/src/assets/icons/downArrow.svg";

const InquirySelectButton = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "BUY", label: "매매" },
    { value: "JEONSE", label: "전세" },
    { value: "MONTH_RENT", label: "월세" },
  ];

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
        data-inquiry-type={value}
      >
        <span className="inquiry-type-display" data-inquiry-type={value}>
          {value || "문의 유형 선택"}
        </span>

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
              key={option.value}
              className={`custom-select-item ${value === option.value ? "selected" : ""}`}
              onClick={() => {
                console.log("선택된 문의 유형:", option.value); // 선택 시 로그 출력
                onChange(option.label); // 한글 값을 onChange로 전달 (기존 로직 유지)
                setIsOpen(false);
              }}
            >
              {option.label}
              {value === option.value && (
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
