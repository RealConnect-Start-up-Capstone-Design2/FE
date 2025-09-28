import React from "react";
import { LoginWidget } from "@widgets/auth/LoginWidget";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  return (
    <div className={styles["login-page"]}>
      <LoginWidget />
    </div>
  );
};
