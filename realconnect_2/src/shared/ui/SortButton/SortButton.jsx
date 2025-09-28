import React, { useState } from "react";
import styles from "./SortButton.module.css";
import downArrowIcon from "@shared/assets/icons/downArrow.svg";

export const SortButton = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = options.find((opt) => opt.value === value);

  return (
    <div className={styles.sortButton}>
      <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
        <span>{currentOption?.label || placeholder}</span>
        <img
          src={downArrowIcon}
          alt="드롭다운"
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`${styles.option} ${
                option.value === value ? styles.active : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
