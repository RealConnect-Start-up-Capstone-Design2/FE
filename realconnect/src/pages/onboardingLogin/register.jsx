import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css";
// 이미지 불러오기
import loginLogo from "../../assets/icons/loginLogo.svg";
import userIcon from "../../assets/icons/user.svg";
import lockIcon from "../../assets/icons/lock.svg";
import mailIcon from "../../assets/icons/mail.svg";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordVerify: "",
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(form);
    if (form.password !== form.passwordVerify) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.email.includes("@") === false) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    try {
      await axios.post("http://54.180.206.163:8080/api/register", {
        username: form.username,
        password: form.password,
        passwordVerify: form.passwordVerify,
        email: form.email,
        name: form.name,
      });
      localStorage.setItem("isAuthenticated", "true");
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("회원가입 요청 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="register-container">
      <img src={loginLogo} alt="loginLogo" className="register-logo" />
      <h1 className="register-title">RealConnect</h1>
      <p className="register-desc">부동산 관리 시스템에 오신 것을 환영합니다</p>
      <div className="register-card">
        <h2 className="register-card-title">회원가입</h2>
        <p className="register-card-desc">새로운 부동산 계정을 생성하세요</p>
        <form onSubmit={handleRegister}>
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
                placeholder="아이디 입력"
                autoComplete="username"
              />
            </div>
          </div>
          <div className="login-form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="login-input-wrap">
              <img src={lockIcon} alt="비밀번호" className="login-input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호 입력(영문, 숫자, 특수문자 포함 8자리 이상)"
                autoComplete="current-password"
              />
            </div>
          </div>
          <div className="login-form-group">
            <label htmlFor="passwordVerify">비밀번호 확인</label>
            <div className="login-input-wrap">
              <img
                src={lockIcon}
                alt="비밀번호 확인"
                className="login-input-icon"
              />
              <input
                type="password"
                id="passwordVerify"
                name="passwordVerify"
                value={form.passwordVerify}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="login-form-group">
            <label htmlFor="email">이메일</label>
            <div className="login-input-wrap">
              <img src={mailIcon} alt="이메일" className="login-input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일 입력"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="login-form-group">
            <label htmlFor="name">이름</label>
            <div className="login-input-wrap">
              <img src={userIcon} alt="이름" className="login-input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름 입력"
                autoComplete="name"
              />
            </div>
          </div>
          <button type="submit" className="login-btn login-btn-main">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
