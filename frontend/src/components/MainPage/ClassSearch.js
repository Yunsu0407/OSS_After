import { FaSearch } from "react-icons/fa";
import Modal from 'react-modal';
import React, { useState, useEffect, useCallback } from 'react';
import ClassCreate from './ClassCreate.js';
import axios from 'axios';

function ClassSearch({ onClassAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lectureName, setLectureName] = useState("");
  const [lectures, setLectures] = useState([]); 
  const [userName, setUserName] = useState(""); // 사용자 이름을 저장할 상태 변수
  const API_BASE_URL = process.env.REACT_APP_LOCAL_API_BASE_URL;
  const token = localStorage.getItem('userToken_main');

  const fetchClassData = useCallback(() => {
    if (lectureName) {
      axios.post(`${API_BASE_URL}/${token}/participate`, new URLSearchParams({
        lectureName
      }))
      .then((response) => {
        // 서버 응답에서 모든 lectures를 받아 상태에 저장
        setLectures(response.data.lectures);
        setUserName(response.data.name); // 서버로부터 받은 사용자 이름을 상태에 저장

        console.log("Data fetched and state updated");
        //onClassAdded(); // 강의 데이터를 성공적으로 가져온 후 콜백 실행
        const matchingLecture = response.data.lectures.find(lecture => lecture.name === lectureName);
        if (matchingLecture) {
          console.log(matchingLecture); // 일치하는 강의 정보만 콘솔에 출력
          console.log('강의 제작자:', matchingLecture.madeby_name); // 사용자 이름 로그
          onClassAdded(matchingLecture); // Pass the matching lecture data to the callback
        } else {
          console.log("No matching lectures found"); // 일치하는 강의가 없을 경우
          onClassAdded(null); // 일치하는 강의가 없으면 null을 전달
        }
      })

      .catch(error => {
        console.error('Failed to fetch class data:', error);
        onClassAdded(null); // Call with null if no lecture matches
      });
    }
  }, [API_BASE_URL, token, lectureName, onClassAdded]);
  
  const sendClassName = async (event) => { //클래스 검색하기 누르면 서버로 클래스 이름과 사용자 ID 전송
      const storedUserToken = localStorage.getItem('userToken_main'); // 유저 토큰 가져오기, {token}이랑 동일함
      console.log("유저 토큰: ",storedUserToken); 
      axios.post(`${API_BASE_URL}/${token}/participate`, 
      new URLSearchParams({
        lectureName: lectureName
      }))
      .then((response) => {
        //console.log(response);
        console.log("post 성공");
        fetchClassData();
      })
      .catch(error => {
        console.log("post sendclassname 실패");
        console.error('Error details:', error.response ? error.response.data : error.message);
      });
  };
  
  /*useEffect(() => {

    const API_BASE_URL = process.env.REACT_APP_LOCAL_API_BASE_URL;
    if (!API_BASE_URL) {
      console.error('API base URL is not set!');
      return;
    }

    const fetchClassData = () => {
      // 강의명을 서버로 보내기 위해 URLSearchParams를 사용
      axios.post(`${API_BASE_URL}/${token}/participate`, new URLSearchParams({
        lectureName: lectureName  // 현재 선택된 lectureName을 파라미터로 전송
      }))
      .then((response) => {
        // 응답으로 받은 데이터에서 lectures 배열을 추출하여 상태 업데이트
        setLectures(response.data.lectures);  // 서버로부터 받은 lectures 데이터를 상태에 저장
        console.log(response.data); // 로그로 전체 응답 데이터 확인
      })
      .catch(error => {
        console.error('강의 데이터 받아오기 실패:', error);
      });
    };
  
    if (lectureName) {  // lectureName이 있을 때만 데이터 요청
      fetchClassData();
    }
  }, [token, lectureName]); // token 또는 lectureName이 변경될 때마다 요청
  */

  const openModal = () => {
    setIsOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsOpen(false); // 모달을 닫기 위해 모달 상태를 false로 변경합니다.
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    content: {
      width: "25vw",
      height: "40vh",
      margin: "auto",
      borderRadius: "4px",
      boxShadow: " 0 2px 4px rgba(0, 0, 0, 0.2)",
      padding: "20px",
    },
  };

  return (
    <div>
      <button onClick={openModal} style={{ border: 'none', backgroundColor: 'white' }}>
        <FaSearch style={{ width: '5vw', height: '5vh', color: '#3D70F5' }} />
      </button>

      <Modal ariaHideApp={false}
      isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
        <div style={{ height: '5vh', borderBottom: '1.5px solid black' }}>
          <h2>클래스 검색</h2>
        </div>

        <div>
          <h4>강의명 입력</h4>
        </div>

        <div>
          <input name="lectureName"
            value={lectureName}
            placeholder="Type here"
            onChange={(e) => {
              setLectureName(e.target.value);
            }}
            style={{ height: '4vh' }} />
        </div>
        <button onClick={sendClassName} style={{
          width: '24vw', height: '6vh', backgroundColor: 'black',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5vh'
        }}>
          <h4 style={{ color: 'white', fontWeight: 'bold' }}>클래스 검색하기</h4>
        </button>
      </Modal>
    </div>
  );
}

export default ClassSearch;