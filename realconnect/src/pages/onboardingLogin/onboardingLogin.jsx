import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../onboardingLogin/onboardingLogin.css";

const OnboardingLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 이메일과 비밀번호 입력 확인
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // 이제 API를 통해 로그인 요청을 실제로 해야 함
    // 데모 버전에선 그냥 로컬 스토리지에 토큰 저장만 한 상태임.
    localStorage.setItem("isAuthenticated", "true");

    // 로그인 성공 후 대시보드로 리다이렉트
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>RealConnect</h1>
        <h2>Sign in to your account</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingLogin;
