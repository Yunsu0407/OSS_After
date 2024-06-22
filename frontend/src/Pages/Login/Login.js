import React, { useState, useEffect } from 'react';
import './Login.css';
import kakaologo from './Images/kakao_logo.png';

function Login() {
  const KAKAO_LOGIN_URL = "https://accounts.kakao.com/login/?continue=https%3A%2F%2Fkauth.kakao.com%2Foauth%2Fauthorize%3Fresponse_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A8080%252Flogin%26through_account%3Dtrue%26client_id%3D2b457724a50592a78abf3dcfc87166fd&talk_login=#login";

  const handleLogin = () => {
    window.location.href = KAKAO_LOGIN_URL
  }

  return (
    <div id="container">
      <div id="project">
        Check your Code!
      </div>
      <div id="benefits">
        Quick Result
        <br />
        Convenience features
        <br />
        Integrated management
      </div>
      <div id="induction_comment">
        Experience it right here,
        <br />
        right now!
      </div>
      <div id="kakao_login">
        <button onClick={handleLogin}>
          <img src={kakaologo} />
          카카오 로그인
        </button>

      </div>
      <div id="developers">
        OSS project
        <br />
        Developed by Checkoders
        <br />
        MS Kim, JS Choi, JW Kim, JS Park, YS Han
      </div>
    </div>
  );
}

export default Login;
