import React from 'react';
import { FaRegClock } from "react-icons/fa";
import { AiFillCalendar } from "react-icons/ai";
import { Link } from 'react-router-dom';

function LectureList({ lectureList }) {
  return (
    <div className="class-box">
      <div className="class-header">
        <span>{lectureList.lecture_name}</span>
        <p className="professor-name">{lectureList.professorName}</p>
      </div>
      <div className="class-content">

        <div className="schedule">
          <AiFillCalendar className="calendar-icon" />
          <span>{lectureList.day1}</span>
          <FaRegClock className="clock-icon" />
          <span>{lectureList.time1}</span>
        </div>
        <div className="second-schedule">
          <span>{lectureList.day2}</span>
          <FaRegClock className="clock-icon" />
          <span>{lectureList.time2}</span>
        </div>

        <div className="percent-wrapper">
          <p className="attendance-rate">출석률</p>
          <p className="percent">{lectureList.rate}</p>
        </div>
        <div className="percent-wrapper">
          <p className="assignment-submission">과제 제출</p>
          <p className="percent">{lectureList.rate}</p>
        </div>
        <Link to="/detail" className="detail-button">자세히 보기</Link>
        {/* <button className="detail-button">자세히 보기</button> */}
      </div>
    </div>
  )
}

export default LectureList;