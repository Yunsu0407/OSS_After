import './MainPage2.css';
import React from 'react';
import { FaRegClock } from "react-icons/fa";
import { AiFillCalendar } from "react-icons/ai";
import './ClassComponent.js';
import { Link } from 'react-router-dom'; // React Router의 Link 컴포넌트 import

function TaskInfo(props) {
    return (
        <div>
          <div className="main-box" style={{marginLeft: '0.2vw'}}>
            <div className="main-header" style={{ backgroundColor: "#FFE4E1", height: '12vh' }}>
              <span style={{ marginLeft: '2vw', fontSize: '2.2vh', color: 'red', marginTop: '3vh'}}>{props.daysRemaining}</span>
              <p style={{ marginLeft: '2vw', fontSize: '2.2vh', color: "black", marginTop: '1vh' }}>가장 임박한 과제 안내</p>
            </div>
            <div className="main-content" style={{flexDirection: 'row', borderRadius: '0'}}>
              <div className="main-task-name">
                <span style={{ color: "#F12222", fontWeight: "bold", marginTop: '0.4vh' }}>{props.lecture_name}</span>
              </div>
              <div className="main-schedule">
                <AiFillCalendar className="icon-margin" tyle={{marginTop: '0.5vw'}}/>
                <span>{props.deadline}</span>
              </div>
            </div>

            <div className="main-content">
              <Link to="/detail" className="to-detailpage-button" 
              style={{ textDecoration: 'none', backgroundColor: "black", marginTop: '1vh', 
              borderRadius: '7px' }}>과제 보러가기</Link>
            </div>
            
              {/* <button className="detail-button">자세히 보기</button> */}
            </div>
          </div>
    )
}

export default TaskInfo;