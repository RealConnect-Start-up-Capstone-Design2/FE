import React, { useState, useRef, useEffect } from "react";
import './TagButton.css';
import checkIcon from '/src/assets/icons/check.svg';
import arrowIcon from '/src/assets/icons/intoArrow.svg'; 

const ExpansionTagButton = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(null);

  const options = ["확장", "해당 없음"];

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
        {value || "확장"} 
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

export default ExpansionTagButton;
