import React, { useState, useRef, useEffect } from "react";
import styles from "./SortButton.web.module.css";
import checkIcon from "../../../assets/icons/check.svg";

/**
 * @param {{
 *   options: { value: string; label: string; }[];
 *   value: string;
 *   onChange: (value: string) => void;
 *   placeholder?: string;
 * }} props
 */
export const SortButton = ({
  options,
  value,
  onChange,
  placeholder = "선택",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.button}>
        <span className={styles.buttonText}>{selectedLabel}</span>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
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
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.list}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={styles.option}
              >
                <div className={styles.checkContainer}>
                  {value === option.value ? (
                    <img src={checkIcon} alt="check" className={styles.icon} />
                  ) : (
                    <div className={styles.iconPlaceholder}></div>
                  )}
                </div>
                <span
                  className={`${styles.optionText} ${value === option.value ? styles.selected : ""}`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
