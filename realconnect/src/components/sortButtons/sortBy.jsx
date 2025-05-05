import React, { useState, useRef, useEffect } from "react";
import checkIcon from "../../assets/icons/check.svg";
import "./sortBy.css";

const SortBy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    동호수: true,
    만기일: false,
    등록일: false,
  });

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
    // Close dropdown after option is selected
    setIsOpen(false);
  };

  // Get the selected option name with 기준 suffix
  const getSelectedOption = () => {
    for (const [option, isSelected] of Object.entries(selectedOptions)) {
      if (isSelected) return `${option} 기준`;
    }
    return "정렬";
  };

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      {/* Main button */}
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
        <span className="sort-button-text">{getSelectedOption()}</span>
      </button>

      {/* Dropdown menu */}
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
                  {option} 기준
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortBy;
