import React from "react";
import { LoginForm } from "@features/auth/ui/LoginForm";
import styles from "./LoginWidget.module.css";

import loginLogo from "@shared/assets/icons/loginLogo.svg";

export const LoginWidget = () => {
  return (
    <div className={styles["login-widget"]}>
      {/* 로고 섹션 */}
      <div className={styles["login-widget__header"]}>
        <div className={styles["login-widget__logo"]}>
          <img
            src={loginLogo}
            alt="로고"
            className={styles["login-widget__logo-img"]}
          />
        </div>
        <h1 className={styles["login-widget__title"]}>RealConnect</h1>
        <p className={styles["login-widget__desc"]}>
          부동산 관리 시스템에 오신 것을 환영합니다
        </p>
      </div>

      {/* 로그인 폼 */}
      <div className={styles["login-widget__card"]}>
        <h2 className={styles["login-widget__card-title"]}>로그인</h2>
        <p className={styles["login-widget__card-desc"]}>
          계정 정보를 입력하여 로그인하세요
        </p>
        <LoginForm />
      </div>
    </div>
  );
};
