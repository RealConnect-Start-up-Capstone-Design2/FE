import React from 'react';
import styles from './Button.web.module.css';

/**
 * @param {import('../Button.types').ButtonProps} props
 */
export const Button = ({ label, onClick, disabled, variant = 'primary', fullWidth = false, icon, iconPosition = 'left' }) => {
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
      <span className={styles.content}>
        {icon && iconPosition === 'left' && (
          <span className={styles.icon}>{icon}</span>
        )}
        {label && <span className={styles.label}>{label}</span>}
        {icon && iconPosition === 'right' && (
          <span className={`${styles.icon} ${styles.right}`}>{icon}</span>
        )}
      </span>
    </button>
  );
}; 