import React, { useState, useRef, useEffect } from "react";
import checkIcon from "../../assets/icons/check.svg";
import "./sortBy.css";

const ContractStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    전체: true,
    계약완료: false,
    계약파기: false,
    계약중: false,
    계약만료: false,
  });
  const [hasUserSelected, setHasUserSelected] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOptions({
      ...Object.fromEntries(
        Object.entries(selectedOptions).map(([key]) => [key, false])
      ),
      [option]: true,
    });
    setHasUserSelected(true);
    setIsOpen(false);
  };

  // Get the display text for the dropdown button
  const getButtonText = () => {
    if (!hasUserSelected) {
      return "계약 상태";
    }

    for (const [option, isSelected] of Object.entries(selectedOptions)) {
      if (isSelected) return `${option} 기준`;
    }
    return "계약 상태";
  };

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="sort-button">
        <svg
          className={`sort-button-arrow ${isOpen ? "open" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
        <span className="sort-button-text">{getButtonText()}</span>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="sort-dropdown-menu">
          <div className="sort-dropdown-list">
            {Object.keys(selectedOptions).map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="sort-option"
              >
                <div className="sort-option-check-container">
                  {selectedOptions[option] ? (
                    <img
                      src={checkIcon}
                      alt="check"
                      className="sort-option-icon"
                    />
                  ) : (
                    <div className="sort-option-icon-placeholder"></div>
                  )}
                </div>
                <span
                  className={`sort-option-text ${selectedOptions[option] ? "selected" : ""}`}
                >
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractStatus;
