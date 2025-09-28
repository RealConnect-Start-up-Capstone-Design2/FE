import React from "react";
import styles from "./Input.module.css";

export const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = "",
  ...props
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles["input-group"]} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles["input-label"]}>
          {label}
        </label>
      )}
      <div
        className={`${styles["input-wrapper"]} ${
          icon ? styles["input-wrapper--with-icon"] : ""
        }`}
      >
        {icon && <span className={styles["input-icon"]}>{icon}</span>}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${styles.input} ${error ? styles["input--error"] : ""}`}
          {...props}
        />
      </div>
      {error && <span className={styles["input-error"]}>{error}</span>}
    </div>
  );
};
