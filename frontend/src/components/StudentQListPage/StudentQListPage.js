import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../MainPage/Foundation.css';
import './StudentQListPage.css';
import { FaUserCircle } from "react-icons/fa";
import '../DetailPage/DetailPage.js';
import QListComponent from './QListComponent.js';
import DummyQList from './DummyQList.json';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { LuLogOut } from "react-icons/lu";

const API_BASE_URL = process.env.REACT_APP_LOCAL_API_BASE_URL;

function StudentQListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const team_member = location.state?.team_member || '팀원 이름 없음';
  const lecture_name = location.state?.lecture_name || '강의명 없음';

  const [qList, setQList] = useState([]);

  const userToken = localStorage.getItem('userToken_main')
  const lectureToken = localStorage.getItem('classToken');
  const memberToken = localStorage.getItem('memberTokenCR');  // detail-moveToSQL

  const fetchData = () => {
    console.log("유저 토큰: ", userToken);
    console.log("강의 토큰: ", lectureToken);
    console.log("팀원 토큰: ", memberToken);

    axios.get(`${API_BASE_URL}/page7/${userToken}/${memberToken}/${lectureToken}`)
      .then((response) => {
        console.log("PAGE7요청에 대한 응답:", response);

        const formattedData = response.data.list.map(item => ({
          q_name: item.title,
          q_problem: item.description,
          q_token: item.assignmentId
        }));
        setQList(formattedData);
      })

      .catch(error => {
        console.error("문제list 가져오기 실패", error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSiteName = () => {  // 메인페이지 이동을 위한 함수
    navigate('/Main');
  }

  const kakaoLogout = () => { // 카카오 로그아웃을 위한 함수, post 요청을 통해 accessToken을 보내 토큰을 만료시켜 로그아웃함
    const accessToken_main = localStorage.getItem('accessToken_main');
    axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v1/user/logout',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${accessToken_main}`
      },
    })
      .then((response) => { // 로그아웃 성공 시 메인페이지로 이동되야함
        console.log("logout 성공");
        console.log(response);
        console.log(response.data.id);
        localStorage.clear();
        navigate('/');
      })
      .catch(error => {
        console.log("logout 실패");
      });
  }

  return (
    <div className="Foundation">
      <div className='topCover'>
        <div className='siteName'>
          <button className='siteName_button' onClick={handleSiteName}>
            ✔ Checkoders
            {/* 온클릭하면 메인페이지 */}
          </button>
        </div>
        <div className='midBlank'>

        </div>
        <div className='logOut'>
          <button className='logOut_button' onClick={kakaoLogout}>
            Logout<LuLogOut />
            {/* 온클릭하면 로그아웃 후 로그인 페이지 */}
          </button>
        </div>
      </div>
      <div className='bottomBox'>
        <div>

          <div className="stud-info">
            <FaUserCircle style={{ width: '3vw' }} />
            <div className="stud-name">
              <span>{team_member}</span>
            </div>
          </div>

          <div className="qlist-bottom-box">
            <div className="q-container">
              <div className="q-container-title">
                해결한 문제
              </div>

              <div className="q-container-box">
                {/* {qList.map(q => (
                  <QListComponent key={q.q_name} q_name={q.q_name} q_problem={q.q_problem} />
                ))} */}
                {qList.map(q => (
                  <QListComponent key={q.q_name} q_name={q.q_name} q_problem={q.q_problem} q_token={q.q_token} />
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default StudentQListPage;