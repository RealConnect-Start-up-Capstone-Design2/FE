import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../../store/authStore";

import "../onboardingLogin/onboardingLogin.css";
import loginLogo from "../../assets/icons/loginLogo.svg";
import userIcon from "../../assets/icons/user.svg";
import lockIcon from "../../assets/icons/lock.svg";
import kakaoIcon from "../../assets/icons/kakao.svg";
import naverIcon from "../../assets/icons/naver.svg";
import orIcon from "../../assets/icons/or.svg";

const OnboardingLogin = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    keepLogin: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 로그인 버튼 클릭
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    setError("");
    try {
      const response = await axios.post(
        "http://54.180.206.163:8080/login",
        {
          username: form.username,
          password: form.password,
        },
        { withCredentials: true } // 쿠키(리프레시 토큰) 받기
      );
      // 액세스 토큰은 Authorization 헤더에서 추출
      const accessToken = response.headers["authorization"]?.replace(
        "Bearer ",
        ""
      );
      // username 등은 response.data에서 추출
      const { username } = response.data;
      if (!accessToken) {
        setError("액세스 토큰이 없습니다.");
        return;
      }
      setAuth({ accessToken, username });
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("로그인에 실패했습니다.");
      }
    }
  };

  return (
    <div className="login-bg">
      <div className="login-frame">
        <div className="login-logo">
          <span className="login-logo-icon">
            <img src={loginLogo} alt="로고" className="login-logo-icon-img" />
          </span>
        </div>
        <h1 className="login-title">RealConnect</h1>
        <p className="login-desc">부동산 관리 시스템에 오신 것을 환영합니다</p>
        <div className="login-card">
          <h2 className="login-card-title">로그인</h2>
          <p className="login-card-desc">계정 정보를 입력하여 로그인하세요</p>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label htmlFor="username">아이디</label>
              <div className="login-input-wrap">
                <img src={userIcon} alt="아이디" className="login-input-icon" />
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
            <div className="login-form-group">
              <label htmlFor="password">비밀번호</label>
              <div className="login-input-wrap">
                <img
                  src={lockIcon}
                  alt="비밀번호"
                  className="login-input-icon"
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
            <div className="login-options">
              <label className="login-keep">
                <input
                  type="checkbox"
                  name="keepLogin"
                  checked={form.keepLogin}
                  onChange={handleChange}
                />
                로그인 상태 유지
              </label>
              <div className="login-links">
                <a href="#" className="login-link">
                  아이디 찾기
                </a>
                <span className="login-link-divider">|</span>
                <a href="#" className="login-link">
                  비밀번호 찾기
                </a>
              </div>
            </div>
            <button type="submit" className="login-btn login-btn-main">
              로그인
            </button>
          </form>
          <div className="login-or-wrap">
            <img src={orIcon} alt="또는" className="login-or-img" />
          </div>
          <div className="login-socials">
            <button className="login-social kakao">
              <img
                src={kakaoIcon}
                alt="카카오"
                style={{ height: 20, marginRight: 8 }}
              />
              카카오로 로그인
            </button>
            <button className="login-social naver">
              <img
                src={naverIcon}
                alt="네이버"
                style={{ height: 20, marginRight: 8 }}
              />
              네이버로 로그인
            </button>
          </div>
          <div className="login-signup">
            계정이 없으신가요?{" "}
            <a href="/register" className="login-signup-link">
              회원가입
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLogin;
