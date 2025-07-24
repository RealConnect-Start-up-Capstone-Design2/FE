import React from "react";
import styles from "./info.module.css";

const InfoRow = ({ children, className = "", ...props }) => (
  <div className={`${styles.infoRow} ${className}`} {...props}>
    {children}
  </div>
);

export default InfoRow; 