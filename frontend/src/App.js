import './App.css';
import React from 'react';
import Main from './components/Main/Main'; // MainPage 컴포넌트를 import
import Detail from './components/Detail/Detail'; // 자세한 페이지 컴포넌트 import
import Teammate from './components/Teammate/Teammate';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
//
import Login from './Pages/Page0_Login/Login';
import Foundation from "./Pages/Rest_Foundation/Foundation";
import SubmitAssign from "./Pages/Page4_TaskSubmission/SubmitAssign";
import SetAssign from "./Pages/Page3_TaskCreation/SetAssign";
import SetTeam from "./Pages/Page5_TeamAssignment/SetTeam"
import CodeReview from "./Pages/Page7_CodeReview/CodeReview"
import StudentTable from "./Pages/Page5_TeamAssignment/StudentTable/StudentTable";
//

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path={"/Main"} element={<Main/>}> </Route>
          <Route path={"/detail"} element={<Detail/>}> </Route>
          <Route path={"/studentqlist"} element={<Teammate/>}> </Route>

          <Route path = '/' element = {<Login />}></Route>
          <Route path = '/Foundation' element = {<Foundation />} ></Route>
          <Route path = '/SubmitAssign' element = {<SubmitAssign />} ></Route>
          <Route path = '/SetAssign' element = {<SetAssign />} ></Route>
          <Route path = '/SetTeam' element = {<SetTeam />} ></Route>
          <Route path = '/Teammate' element = {<Teammate />} ></Route>
          <Route path = '/CodeReview' element = {<CodeReview />} ></Route>
          <Route path = '/StudentTable' element = {<StudentTable />} ></Route>
          //
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
