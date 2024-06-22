import React from 'react';
import './Foundation.css'; // 헤더 스타일을 정의한 CSS 파일
import { AiOutlineLaptop } from "react-icons/ai"; // AiOutlineLaptop 아이콘 import
import { LuLogOut } from "react-icons/lu";

function Foundation() {
  return (
    // <div className="header">
    //   {/* Checkoders 텍스트와 노트북 아이콘을 포함하는 div 추가 */}
    //   <div className="logo-container">
    //     <AiOutlineLaptop className="notebook-icon" /> {/* 노트북 아이콘 추가 */}
    //     <div className="page-title">Checkoders</div>
    //   </div>
    // </div>

    
  <div className="Foundation">
    <div className='topCover'>
      <div className='siteName'>
        <button className='siteName_button'>
          ✔ Checkoders
          {/* 온클릭하면 메인페이지 */}
        </button>
      </div>
      <div className='midBlank'>

      </div>
      <div className='logOut'>
        <button className='logOut_button'>
          Logout
          <LuLogOut />
          {/* 온클릭하면 로그아웃 후 로그인 페이지 */}
        </button>
      </div>
    </div>
    {/* <div className='bottomBox'>
      
    </div> */}
  </div>
  );
}

export default Foundation;