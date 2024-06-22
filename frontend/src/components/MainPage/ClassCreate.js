import React, { useState } from 'react';
import Modal from 'react-modal';
import { AiFillPlusCircle } from "react-icons/ai";
import axios from 'axios';

function ClassCreate() {
  const [isOpen, setIsOpen] = useState(false);
  const [lecture_name, setLecture_name] = useState("");
  const [optionType, setOptionType] = useState(0); // 0은 lecture, 1은 study
  const API_BASE_URL = process.env.REACT_APP_LOCAL_API_BASE_URL;
  const token = localStorage.getItem('userToken_main'); // 로컬 스토리지에 저장된 값 갱신했음

  const sendLectureData = async (event) => {
    event.preventDefault(); // 폼이 제출될 때 페이지가 새로 고침되는 기본 동작을 막음
    const course = optionType === 0 ? '0' : '1';
    const lectureName = lecture_name;

    try {
      const response = await axios.post(`${API_BASE_URL}/${token}/createlecture`, 
        new URLSearchParams({
          lectureName: lectureName,
          course: course
        })
      );
      console.log("post 성공", lectureName, course);
    } catch (error) {
      console.log("post 실패", error);
    }
  };

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
        <AiFillPlusCircle style={{ width: '6vw', height: '6vh', color: '#FFAE35' }} />
      </button>

      <Modal ariaHideApp={false}
        isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
        <div style={{ height: '5vh', borderBottom: '1.5px solid black' }}>
          <h2>클래스 등록</h2>
        </div>

        <div>
          <h4 style={{ marginBottom: '1vh' }}>강의명 입력</h4>
        </div>

        <div>
          <input name="lecture_name"
            value={lecture_name}
            placeholder="Type here"
            onChange={(e) => {
              setLecture_name(e.target.value);
            }}
            style={{ height: '4vh' }} />
        </div>

        <div>
          <div style={{ marginTop: '3vh' }}>
            <label>
              <input type="radio" value="lecture" checked={optionType === 0}
                onChange={() => setOptionType(0)} /> lecture
            </label>
            <label style={{ marginLeft: '2vw' }}>
              <input type="radio" value="study" checked={optionType === 1}
                onChange={() => setOptionType(1)} /> study
            </label>
          </div>
        </div>

        <button onClick={sendLectureData} style={{
          width: '24vw', height: '5vh', backgroundColor: '#FFB23F',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '3vh', 
          marginBottom: '1vh', border: 'none', borderRadius: '4px'
        }}>
          <h4 style={{ color: 'white', fontWeight: 'bold' }}>클래스 등록</h4>
        </button>

      </Modal>
    </div>
  );
}

export default ClassCreate;
