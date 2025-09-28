import React from "react";
import styles from "./ViewSelector.module.css";

export const ViewSelector = ({ options, active, onChange }) => {
  return (
    <div className={styles.viewSelector}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.viewOption} ${
            active === option.value ? styles.active : ""
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
