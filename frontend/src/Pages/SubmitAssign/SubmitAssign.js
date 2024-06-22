import '../Foundation/Foundation.css'
import './SubmitAssign.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuLogOut } from "react-icons/lu";

const API_BASE_URL = process.env.REACT_APP_LOCAL_API_BASE_URL;

function SubmitAssign() {
  // 유저 정보 변수 시작
  const [userName, setUserName] = useState();
  const [userToken, setUserToken] = useState();
  // 유저 정보 변수 끝
  // 페이지 이동 시 사용할 과목 변수 시작
  const [className, setClassName] = useState();
  const [classToken, setClassToken] = useState();
  const [classMaker, setClassMaker] = useState();
  const [classMakerToken, setClassMakerToken] = useState();
  // 페이지 이동 시 사용할 과목 변수 끝
  // 과제 번호 변수 시작 
  const [assignmentToken, setAssignmentToken] = useState(1);
  // 과제 번호 변수 끝

  const setUserData = () => {
    setUserName(localStorage.getItem('name_main'));
    setUserToken(localStorage.getItem('userToken_main'));
    console.log("유저 데이터 확인(유저이름): ", localStorage.getItem('name_main'));
    console.log("유저 데이터 확인(유저토큰): ", localStorage.getItem('userToken_main'));
  }

  const setClassData = () => {
    setClassName(localStorage.getItem('className'));
    setClassToken(localStorage.getItem('classToken'));
    setClassMaker(localStorage.getItem('classMaker'));
    setClassMakerToken(localStorage.getItem('classMakerToken'));
    console.log("클레스 데이터 확인(과목명): ", localStorage.getItem('className'));
    console.log("클레스 데이터 확인(과목토큰): ", localStorage.getItem('classToken'));
    console.log("클레스 데이터 확인(과목생성자): ", localStorage.getItem('classMaker'));
    console.log("클레스 데이터 확인(과목생성자토큰): ", localStorage.getItem('classMakerToken'));
  }

  const setAssignmentData = () => {
    setAssignmentToken(localStorage.getItem('assignmentToken'))
    console.log("과제 번호 확인(과제번호): ", localStorage.getItem('assignmentToken'));
  }

  let [hw_name, change_hw_name] = useState('실습 과제2');
  let [hw_problem, change_hw_problem] = useState('밑변과 높이 필드를 가지는 삼각형 클래스를 작성하고, 두 삼각형의 밑변과 높이를 입력 받아 넓이를 비교하시오.')
  let [hw_test1, change_hw_test1] = useState('');
  let [hw_test_answer1, change_hw_test_answer1] = useState('');
  let [submit_source, change_submit_source] = useState('');

  let [popupMessage, change_PopupMessage] = useState('');
  let [isPopupVisible, change_IsPopupVisible] = useState(false);

  const closePopup = () => {
    change_IsPopupVisible(false);
    navigate('/detail'); // '/detail' 페이지로 이동
  }

  const fetchData = () => {
    // GET 요청 보내기
    axios.get(`${API_BASE_URL}/${userToken}/${classToken}/${assignmentToken}/assignmentpage`)
      .then((response) => {
        // 요청 성공 시 실행되는 코드
        console.log(response);  // 아래는 예상되는 반환값
        change_hw_name(response.data.title);
        change_hw_problem(response.data.description);
        change_hw_test1(response.data.hwTest1);
        change_hw_test_answer1(response.data.hwTestAnswer1);
        console.log('데이터 받아오기 성공123');
      })
      .catch(error => {
        // 요청 실패 시 실행되는 코드
        console.log('데이터 받아오기 실패123');
      });
  }

  // 초기화 관련
  const clearTextArea = () => {
    // textarea 내용을 초기화하기 위해 상태 변수 업데이트
    change_submit_source('');
  };

  // 제출 관련
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!submit_source) {
      change_PopupMessage('소스 코드를 입력해주세요.'); // 팝업창 관련 메시지
      change_IsPopupVisible(true);  // 팝업창 관련
      console.log("소스 코드가 비어있음");
      return; // 소스 코드가 없으면 요청을 보내지 않음
    }
    if (!assignmentToken) {
      change_PopupMessage('과제 번호가 설정되지 않았습니다.');
      change_IsPopupVisible(true);
      return;
    }

    console.log("제출 소스 코드: ", submit_source); // 콘솔 로그 추가
    axios({
      method: 'POST',
      url: `${API_BASE_URL}/${userToken}/${assignmentToken}/submit`,
      data: {
        answer_text: submit_source
      }
    })
      .then((response) => {
        console.log('제출에 대한 응답: ', response);
        if (response.data === "성공") {
          change_PopupMessage('제출 성공: 정답');
        }
        else {
          change_PopupMessage('제출 실패: 오답'); // 팝업창 관련
        }

        change_IsPopupVisible(true);  // 팝업창 관련
        console.log("제출 성공1");
        console.log(response);
      })
      .catch(error => {
        console.log('submit 에러: ', error);

        change_PopupMessage('통신 실패: 에러'); // 팝업창 관련
        change_IsPopupVisible(true);  // 팝업창 관련
        console.log("제출 실패1");
      });
  };

  const handleSiteName = () => {
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

  useEffect(() => {
    // 페이지가 로딩될 때 데이터를 받아오는 함수 호출
    setUserData();
    setClassData();
    setAssignmentData();
  }, []);

  useEffect(() => {
    if (userToken && classToken && assignmentToken) {
      fetchData();
    }
  }, [userToken, classToken, assignmentToken]);
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
        <div className='leftBlank'></div>
        <div className='midCore'>
          <div className='lecture' style={{ fontWeight: 'bold' }}>
            📖 {className}
          </div>
          <div className='mainContent'>
            <div className='tabCover'>

            </div>
            <div className='assignInfoSubAssign'>
              <div className='assignContent'>
                <div className='problem'>
                  문제 내용
                </div>
                <div className='problemInfo'>
                  <p>{hw_name}</p>
                  <p>{hw_problem}</p>
                  <div className='IOExample'>
                    <div className='InputExample' style={{ whiteSpace: 'pre-line' }}>
                      <p>입력 예제</p>
                      <p>{hw_test1}</p>
                    </div>
                    <div className='OutputExample' style={{ whiteSpace: 'pre-line' }}>
                      <p>출력 예제</p>
                      <p>{hw_test_answer1}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='submitContent'>
                <div className='solving'>
                  문제 풀이
                </div>
                <div className='solvingInfo'>
                  <textarea className='solvingBox' value={submit_source} onChange={(e) => change_submit_source(e.target.value)} placeholder="풀이를 입력하세요."></textarea>
                </div>
              </div>
              <div className='additionalContent'>
                <div className='buttonAction'>
                  <div className='initializer'>
                    <button className='initButton' onClick={clearTextArea}>
                      {/* 온클릭하면 박스 내용 초기화해야함 */}
                      소스코드 초기화
                    </button>
                  </div>
                  <div className='actions'>
                    <button className='submitButton' onClick={handleSubmit}>
                      {/* 온클릭하면 제출해야됨 */}
                      제출
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
        <div className='rightBlank'></div>
      </div>

      {isPopupVisible && (
        <>
          <div className='modal-backdrop'></div> {/* New backdrop */}
          <div className='popup'>
            <div className='popup-inner'>
              <p>{popupMessage}</p>
              <button onClick={closePopup}>닫기</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default SubmitAssign;
