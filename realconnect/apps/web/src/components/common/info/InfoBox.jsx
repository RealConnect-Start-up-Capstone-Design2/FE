import React from "react";
import styles from "./info.module.css";

const InfoBox = ({ title, value, children, className = "", ...props }) => (
  <div className={`${styles.infoBox} ${className}`} {...props}>
    {title && <h4>{title}</h4>}
    {value !== undefined ? <p>{value}</p> : children}
  </div>
);

export default InfoBox; 