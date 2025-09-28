import React from "react";
import styles from "./Button.module.css";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  icon,
  className = "",
  ...props
}) => {
  const classes = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    disabled && styles["btn--disabled"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={styles.btn__icon}>{icon}</span>}
      {children}
    </button>
  );
};
