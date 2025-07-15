import React from 'react';
import styles from './Button.web.module.css';

/**
 * @param {import('../Button.types').ButtonProps} props
 */
export const Button = ({ label, onClick, disabled, variant = 'primary', fullWidth = false }) => {
  const classNames = [
    styles.btn,
    styles[variant],
    fullWidth ? styles.fullWidth : ''
  ].join(' ').trim();

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}; 