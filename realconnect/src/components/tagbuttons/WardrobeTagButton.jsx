import React, { useState, useRef, useEffect } from "react";
import './TagButton.css';

const WardrobeTagButton = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(null);

  const options = ["붙박이장", "해당 없음"];

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
        className="tag-select-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "붙박이장"} <span className="tag-arrow">▼</span>
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

export default WardrobeTagButton;
