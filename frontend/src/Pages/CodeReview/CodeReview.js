import '../Foundation/Foundation.css'
import './CodeReview.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuLogOut } from "react-icons/lu";
const API_BASE_URL = process.env.REACT_APP_LOCAL_API_BASE_URL;


function CodeReview() {
  // 유저 정보 변수 시작
  const [userName, setUserName] = useState();
  const userToken = localStorage.getItem('userToken_main');
  // 유저 정보 변수 끝

  // 페이지 이동 시 사용할 과목 변수 시작
  const [className, setClassName] = useState();
  const [classToken, setClassToken] = useState();
  const [classMaker, setClassMaker] = useState();
  const [classMakerToken, setClassMakerToken] = useState();
  // 페이지 이동 시 사용할 과목 변수 끝

  // 과제 번호 변수 시작 
  const assignmentToken = localStorage.getItem('assignmentToken');
  const otherAssignmentToken = localStorage.getItem("otherAssignmentToken");
  // const [assignmentToken, setAssignmentToken] = useState();
  // 과제 번호 변수 끝

  // 팀 번호 변수 시작
  // const teamToken = localStorage.getItem('teamToken');
  const [teamToken, setTeamToken] = useState();
  // 팀 번호 변수 끝

  const mySelf = localStorage.getItem("mySelf");

  let [hw_name, change_hw_name] = useState();
  let [hw_problem, change_hw_problem] = useState();
  let [hw_test1, change_hw_test1] = useState(); // 입력 예제1
  let [hw_test_answer1, change_hw_test_answer1] = useState(); // 출력 예제1
  let [source, change_source] = useState();
  let [gpt_feedback, change_gpt_feedback] = useState();
  let [cData, change_cData] = useState([]);
  let [comment, change_comment] = useState();

  const [chatData, setChatData] = useState([]);

  const checkUser = () => {
    if (mySelf === "true") {
      console.log("사용자를 위한 코드리뷰 페이지를 실행합니다.", mySelf);
    }
    else {
      console.log("팀원을 위한 코드리뷰 페이지를 실행합니다.", mySelf);
    }
  }

  const setUserData = () => {
    setUserName(localStorage.getItem('name_main'));
    console.log("유저 데이터 확인(유저이름): ", localStorage.getItem('name_main'));
    console.log("유저 데이터 확인(유저토큰): ", localStorage.getItem('userToken_main'));

    setTeamToken(localStorage.getItem('memberTokenCR'));
    console.log("팀원 확인(팀토큰): ", localStorage.getItem('memberTokenCR'));
  }

  const setClassData = () => {
    setClassName(localStorage.getItem('className'));
    console.log("클레스 데이터 확인(과목명): ", localStorage.getItem('className'));



    setClassToken(localStorage.getItem('classToken'));
    setClassMaker(localStorage.getItem('classMaker'));
    setClassMakerToken(localStorage.getItem('classMakerToken'));
    console.log("클레스 데이터 확인(과목토큰): ", localStorage.getItem('classToken'));
    console.log("클레스 데이터 확인(과목생성자): ", localStorage.getItem('classMaker'));
    console.log("클레스 데이터 확인(과목생성자토큰): ", localStorage.getItem('classMakerToken'));
  }

  useEffect(() => {
    checkUser();
    setUserData();
    setClassData();
    console.log("시각: ", new Date().toISOString());
  }, []);

  useEffect(() => {
    if (teamToken) {
      fetchData();
    }
  }, [teamToken]);

  const fetchData = () => {
    console.log("내 과제토큰: ", assignmentToken);
    console.log("타인의 과제토큰: ", otherAssignmentToken);

    const finalUserToken = mySelf === "true" ? userToken : teamToken;
    const finalAssignToken = mySelf === "true" ? assignmentToken : otherAssignmentToken;

    console.log("내 토큰: ", userToken);
    console.log("팀원 토큰: ", teamToken);
    console.log("최종 토큰: ", finalUserToken);
    console.log("최종 과제 토큰: ", finalAssignToken);

    if (mySelf === "true") {
      change_hw_name(localStorage.getItem("assignmentTitle"));
    }
    else {
      change_hw_name(localStorage.getItem("otherAssignmentName"));
    }

    console.log("과제 제목: ", hw_name);

    axios.get(`${API_BASE_URL}/aaa/${finalUserToken}/${finalAssignToken}`)
      .then((response) => {
        console.log("코드 리뷰 데이터(성공): ", response.data);

        change_hw_problem(response.data.description);
        change_hw_test1(response.data.hw_test1);
        change_hw_test_answer1(response.data.hw_test_answer1);
        change_source(response.data.answer_text);
        change_gpt_feedback(response.data.gpt_feedback);
        console.log(response.data.chats);

        const chatArray = Object.keys(response.data.chats).map((key) => ({
          senderName: key,
          content: response.data.chats[key],
        }));

        setChatData(chatArray);
      })
      .catch(error => {
        // 요청 실패 시 실행되는 코드
        console.log("코드 리뷰 데이터(실패): ", error)
      });
  }

  const navigate = useNavigate();
  const handleSiteName = () => {
    navigate('/Main');
  }

  const handleChange_comment = (event) => {
    change_comment(event.target.value);

  };

  const postComment = () => {
    const currTime = new Date().toISOString();
    console.log("토큰: ", userToken);
    console.log("강의토큰: ", classToken);
    console.log("문제토큰: ", assignmentToken);
    console.log("댓글내용: ", comment);
    console.log("제출시간: ", currTime);
    //
    axios.post(`${API_BASE_URL}/chatting`, {
      // "senderToken": "3474498186",
      // "senderName": "한윤수",
      // "lectureId": 1,
      // "lectureassignmentId": 1,
      // "content": "김민선",
      // "timestamp": "2024-06-18T12:00:00"

      token: userToken,
      // senderName: userName,
      // lectureId: classToken,
      // lectureassignmentId: assignmentToken,
      text: comment,
      // timestamp: currTime
    })
      .then((response) => {
        // 성공적으로 댓글이 등록되었을 때 실행할 코드
        console.log("댓글이 성공적으로 등록되었습니다.");
        console.log("제출 성공: ", response);
        change_cData(response.chat);
        window.location.reload();
      })
      .catch((error) => {
        // 댓글을 등록하는 과정에서 에러가 발생했을 때 실행할 코드
        console.error("댓글을 등록하는 중 에러가 발생했습니다:", error);
      });
  };

  const handleSubmitComment = () => {
    postComment();
    // 댓글 등록 후 입력 창 초기화
    change_comment('');
  };

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
            Logout
            <LuLogOut />
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
            <div className='assignInfoCode'>
              <div className='problemContent'>
                <div className='contentArea'>
                  <div className='contentCover'>
                    문제 내용
                  </div>
                  <div className='contentExplanation'>
                    <p>{hw_name}</p>
                    <p>{hw_problem}</p>
                    <div className='CodeReviewIOExample'>
                      <div className='CodeReviewInputExample' style={{ whiteSpace: 'pre-line' }}>
                        <p>입력 예제</p>
                        <p>{hw_test1}</p>
                      </div>
                      <div className='CodeReviewOutputExample' style={{ whiteSpace: 'pre-line' }}>
                        <p>출력 예제</p>
                        <p>{hw_test_answer1}</p>
                      </div>
                    </div>
                  </div>

                </div>
                <div className='contentCode'>
                  <div className='codeCover'>
                    제출 코드
                  </div>
                  <div className='codeResponse'>
                    {source}
                  </div>
                </div>
              </div>
              <div className='feedback'>
                <div className='gptFeedback'>
                  <div className='gptCover'>
                    GPT Feedback
                  </div>
                  <div className='gptContent'>
                    {gpt_feedback}
                  </div>
                </div>
                <div className='teamFeedback'>
                  <div className='feedCover'>Comment</div>
                  <div className='feedContent'>
                    <div className='comments'>
                      <div className='one_comment'>
                        <ul>
                          {chatData.map((item, index) => (
                            <li key={index}>
                              <p>{item.senderName}</p>
                              <p>{item.content}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className='addComment'>
                      <div className='userName'>
                        {userName}
                      </div>
                      <div className='inputTextBox'>
                        <textarea className='textBox' placeholder='댓글을 남겨보세요' value={comment} onChange={handleChange_comment}></textarea>
                      </div>
                      <div className='buttonArea'>
                        <button className='postButton' onClick={handleSubmitComment}>
                          등록
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='rightBlank'></div>
      </div>
    </div >
  );
}

export default CodeReview;