import React, { useState, useRef, useEffect } from "react";
import checkIcon from "../../assets/icons/check.svg";
import "./transactionType.css";

const TransactionType = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    전체: true,
    매매: false,
    전세: false,
    월세: false,
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
    // Close dropdown after option is selected
    setIsOpen(false);
  };

  // Get the display text for the dropdown button
  const getButtonText = () => {
    if (!hasUserSelected) {
      return "거래 유형";
    }

    for (const [option, isSelected] of Object.entries(selectedOptions)) {
      if (isSelected) return option;
    }
    return "거래 유형";
  };

  return (
    <div className="transaction-dropdown" ref={dropdownRef}>
      {/* Main button */}
      <button onClick={toggleDropdown} className="transaction-button">
        <svg
          className={`transaction-button-arrow ${isOpen ? "open" : ""}`}
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
        <span className="transaction-button-text">{getButtonText()}</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="transaction-dropdown-menu">
          <div className="transaction-dropdown-list">
            {Object.keys(selectedOptions).map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="transaction-option"
              >
                <div className="transaction-option-check-container">
                  {selectedOptions[option] ? (
                    <img
                      src={checkIcon}
                      alt="check"
                      className="transaction-option-icon"
                    />
                  ) : (
                    <div className="transaction-option-icon-placeholder"></div>
                  )}
                </div>
                <span
                  className={`transaction-option-text ${selectedOptions[option] ? "selected" : ""}`}
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

export default TransactionType;
