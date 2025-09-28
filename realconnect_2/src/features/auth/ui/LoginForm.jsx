import React, { useState } from "react";
import { Button, Input } from "@shared/ui";
import { useLogin } from "../model/useAuth";
import styles from "./LoginForm.module.css";

import userIcon from "@shared/assets/icons/user.svg";
import lockIcon from "@shared/assets/icons/lock.svg";
import kakaoIcon from "@shared/assets/icons/kakao.svg";
import naverIcon from "@shared/assets/icons/naver.svg";
import orIcon from "@shared/assets/icons/or.svg";

export const LoginForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    keepLogin: false,
  });
  const [error, setError] = useState("");

  const loginMutation = useLogin();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    setError("");

    // 로그인 API 호출
    loginMutation.mutate({
      username: form.username,
      password: form.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles["login-form"]}>
      {error && <div className={styles["login-form__error"]}>{error}</div>}

      {/* 아이디 입력 */}
      <div className={styles["login-form__group"]}>
        <label htmlFor="username">아이디</label>
        <div className={styles["login-form__input-wrap"]}>
          <img
            src={userIcon}
            alt="아이디"
            className={styles["login-form__input-icon"]}
          />
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="아이디를 입력해주세요"
            autoComplete="username"
          />
        </div>
      </div>

      {/* 비밀번호 입력 */}
      <div className={styles["login-form__group"]}>
        <label htmlFor="password">비밀번호</label>
        <div className={styles["login-form__input-wrap"]}>
          <img
            src={lockIcon}
            alt="비밀번호"
            className={styles["login-form__input-icon"]}
          />
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력해주세요"
            autoComplete="current-password"
          />
        </div>
      </div>

      {/* 로그인 옵션 */}
      <div className={styles["login-form__options"]}>
        <label className={styles["login-form__keep"]}>
          <input
            type="checkbox"
            name="keepLogin"
            checked={form.keepLogin}
            onChange={handleChange}
          />
          로그인 상태 유지
        </label>
        <div className={styles["login-form__links"]}>
          <a href="#" className={styles["login-form__link"]}>
            아이디 찾기
          </a>
          <span className={styles["login-form__link-divider"]}>|</span>
          <a href="#" className={styles["login-form__link"]}>
            비밀번호 찾기
          </a>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        className={`${styles["login-form__btn"]} ${styles["login-form__btn--main"]}`}
      >
        로그인
      </button>

      {/* 구분선 */}
      <div className={styles["login-form__or-wrap"]}>
        <img src={orIcon} alt="또는" className={styles["login-form__or-img"]} />
      </div>

      {/* 소셜 로그인 */}
      <div className={styles["login-form__socials"]}>
        <button
          type="button"
          className={`${styles["login-form__social"]} ${styles["login-form__social--kakao"]}`}
        >
          <img
            src={kakaoIcon}
            alt="카카오"
            style={{ height: 20, marginRight: 8 }}
          />
          카카오로 로그인
        </button>
        <button
          type="button"
          className={`${styles["login-form__social"]} ${styles["login-form__social--naver"]}`}
        >
          <img
            src={naverIcon}
            alt="네이버"
            style={{ height: 20, marginRight: 8 }}
          />
          네이버로 로그인
        </button>
      </div>

      {/* 회원가입 링크 */}
      <div className={styles["login-form__signup"]}>
        계정이 없으신가요?{" "}
        <a href="/register" className={styles["login-form__signup-link"]}>
          회원가입
        </a>
      </div>
    </form>
  );
};
