import axios from 'axios';
import '../Foundation/Foundation.css';
import './SetAssign.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LuLogOut } from "react-icons/lu";
const API_BASE_URL = process.env.REACT_APP_LOCAL_API_BASE_URL;

function SetAssign() {
  const location = useLocation();  // location 객체를 가져옴
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
  const course = localStorage.getItem('course');
  //course 값 받아옴

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

  useEffect(() => {
    setUserData();
    setClassData();
    console.log('course: ', course); //course 값 콘솔 출력
  }, [location.state]);

  let [q_name, change_q_name] = useState('');  // 문제명
  let [q_deadline, change_q_deadline] = useState(new Date());
  let [q_problem, change_q_problem] = useState(''); // 문제 내용
  let [q_test1, change_q_test1] = useState(''); // 입력 예제1
  let [q_test2, change_q_test2] = useState(''); // 입력 예제2
  let [q_test3, change_q_test3] = useState(''); // 입력 예제3
  let [q_test4, change_q_test4] = useState(''); // 입력 예제4
  let [q_test5, change_q_test5] = useState(''); // 입력 예제5
  let [q_test_answer1, change_q_test_answer1] = useState(''); // 출력 예제1
  let [q_test_answer2, change_q_test_answer2] = useState(''); // 출력 예제2
  let [q_test_answer3, change_q_test_answer3] = useState(''); // 출력 예제3
  let [q_test_answer4, change_q_test_answer4] = useState(''); // 출력 예제4
  let [q_test_answer5, change_q_test_answer5] = useState(''); // 출력 예제5

  const assignmentRequestDTO = {
    course: course,
    title: q_name,
    description: q_problem,
    deadline: q_deadline,
    hwTest1: q_test1,
    hwTestAnswer1: q_test_answer1,
    hwTest2: q_test2,
    hwTestAnswer2: q_test_answer2,
    hwTest3: q_test3,
    hwTestAnswer3: q_test_answer3,
    hwTest4: q_test4,
    hwTestAnswer4: q_test_answer4,
    hwTest5: q_test5,
    hwTestAnswer5: q_test_answer5
  }

  const handleChange_q_name = (event) => {
    change_q_name(event.target.value);
  }
  const handleChange_q_problem = (event) => {
    change_q_problem(event.target.value);
  }
  const handleChange_q_test1 = (event) => {
    change_q_test1(event.target.value);
  };
  const handleChange_q_test2 = (event) => {
    change_q_test2(event.target.value);
  };
  const handleChange_q_test3 = (event) => {
    change_q_test3(event.target.value);
  };
  const handleChange_q_test4 = (event) => {
    change_q_test4(event.target.value);
  };
  const handleChange_q_test5 = (event) => {
    change_q_test5(event.target.value);
  };
  const handleChange_q_test_answer1 = (event) => {
    change_q_test_answer1(event.target.value);
  };
  const handleChange_q_test_answer2 = (event) => {
    change_q_test_answer2(event.target.value);
  };
  const handleChange_q_test_answer3 = (event) => {
    change_q_test_answer3(event.target.value);
  };
  const handleChange_q_test_answer4 = (event) => {
    change_q_test_answer4(event.target.value);
  };
  const handleChange_q_test_answer5 = (event) => {
    change_q_test_answer5(event.target.value);
  };
  const handleChange_q_deadline = (date) => {
    change_q_deadline(date);
  }

  const navigate = useNavigate();

  const handleSubmit = (event) => { // 문제 정보 전달
    axios.post(`${API_BASE_URL}/${userToken}/${classToken}/createAssignment`,
      assignmentRequestDTO // assignmentRequestDTO 객체 자체를 직접 전달
    )
      .then((response) => {
        // 요청 성공 시 실행되는 코드
        navigate('/detail');
        console.log("제출 성공", response);
      })
      .catch(error => {
        // 요청 실패 시 실행되는 코드
        console.log("제출 실패", error);
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
          <div className='lecture' style = {{fontWeight: 'bold'}}>
            📖 {className}
          </div>
          <div className='mainContent'>
            <div className='tabCover'>
            </div>
            <div className='assignInfoSetAssign'>
              <div className='problemName'>
                <div className='problemNameSpace'>
                  문제 제목:
                </div>
                <div className='problemNameInputSpace'>
                  <textarea name="content1" value={q_name} onChange={handleChange_q_name} className='problemNameTextArea' placeholder='제목을 입력하세요.' ></textarea>
                </div>
              </div>
              <div className='problemExplanation'>
                <div className='problemExplanaitonCover'>
                  문제내용
                </div>
                <div className='problemExplanationContent'>
                  <textarea name="content2"
                    value={q_problem}
                    onChange={handleChange_q_problem} className='problemExplanationTextArea' placeholder='문제 내용을 입력하세요.'></textarea>
                </div>
              </div>
              <div className='problemInputs'>
                <div className='getInputData'>
                  <div className='inputIndicate'>
                    입력 데이터 1:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content3"
                      value={q_test1}
                      onChange={handleChange_q_test1} className='inputBox'
                      placeholder='ex1) 2 3 4 5'>
                    </textarea>
                  </div>
                  <div className='inputIndicate'>
                    입력 데이터 2:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content3"
                      value={q_test2}
                      onChange={handleChange_q_test2} className='inputBox'
                      placeholder='ex2) 10 8 7 13'>
                    </textarea>
                  </div>
                  <div className='inputIndicate'>
                    입력 데이터 3:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content3"
                      value={q_test3}
                      onChange={handleChange_q_test3} className='inputBox'
                      placeholder='ex3) 20 10 15 12'>
                    </textarea>
                  </div>
                  <div className='inputIndicate'>
                    입력 데이터 4:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content3"
                      value={q_test4}
                      onChange={handleChange_q_test4} className='inputBox'
                      placeholder='ex4) 8 7 10 19'>
                    </textarea>
                  </div>
                  <div className='inputIndicate'>
                    입력 데이터 5:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content3"
                      value={q_test5}
                      onChange={handleChange_q_test5} className='inputBox'
                      placeholder='ex5) 4 5 3 7'>
                    </textarea>
                  </div>
                </div>
                <div className='getExpectedAnswer'>
                  <div className='inputIndicate'>
                    예상 답안 1:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content4"
                      value={q_test_answer1}
                      onChange={handleChange_q_test_answer1} className='inputBox'
                      placeholder='ex) 1'>
                    </textarea>
                  </div>
                  <div className='inputIndicate'>
                    예상 답안 2:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content4"
                      value={q_test_answer2}
                      onChange={handleChange_q_test_answer2} className='inputBox'
                      placeholder='ex) 2'>
                    </textarea>
                  </div>
                  <div className='inputIndicate'>
                    예상 답안 3:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content4"
                      value={q_test_answer3}
                      onChange={handleChange_q_test_answer3} className='inputBox'
                      placeholder='ex) 2'>
                    </textarea>
                  </div>
                  <div className='inputIndicate'>
                    예상 답안 4:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content4"
                      value={q_test_answer4}
                      onChange={handleChange_q_test_answer4} className='inputBox'
                      placeholder='ex) 2'>
                    </textarea>
                  </div>
                  <div className='inputIndicate'>
                    예상 답안 5:
                  </div>
                  <div className='inputDataBox'>
                    <textarea name="content4"
                      value={q_test_answer5}
                      onChange={handleChange_q_test_answer5} className='inputBox'
                      placeholder='ex) 2'>
                    </textarea>
                  </div>
                </div>
                <div className='getDeadline'>
                  <div className='inputIndicate'>
                    제출 기한:
                  </div>
                  <div className='inputDataBox'>
                    <DatePicker
                      selected={q_deadline}
                      onChange={handleChange_q_deadline}
                      dateFormat="     yyyy / MM / dd"
                      className='inputBox'
                    />
                  </div>
                </div>
              </div>
              <div className='problemClosing'>
                <div className='buttons'>
                  <button className='setProblemsubmitButton' onClick={handleSubmit}>제출</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='rightBlank'></div>
      </div>
    </div>
  );
}

export default SetAssign;
