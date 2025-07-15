import React, { useState, useRef, useEffect } from "react";
import './TagButton.css';
import arrowIcon from '/src/assets/icons/intoArrow.svg'; 

const DirectionTagButton = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(null);

  const options = [
    "남향", "북향", "동향", "서향",
    "남서향", "북서향", "남동향", "북동향"
  ];

  useEffect(() => {
    if (buttonRef.current) {
      setMenuWidth(buttonRef.current.offsetWidth);
    }
  }, [isOpen, value]); // 드롭다운 열릴 때 또는 값 바뀔 때 너비 재측정

  return (
    <div className={`tag-custom-select-wrapper ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className="tag-select-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || "남향"}
        <span>
          <img
          src={arrowIcon}
          alt="화살표"
          className={`tag-arrow-icon ${isOpen ? 'tag-rotate-up' : ''}`}
          />
        </span>
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
            
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DirectionTagButton;
