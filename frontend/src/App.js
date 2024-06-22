import './App.css';
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import P0_Login from './Pages/Page0_Login/Login';
import P1_Main from './Pages/Page1_Main/Main';
import P2_Detail from './Pages/Page2_Detail/Detail';
import P3_TaskCreation from './Pages/Page3_TaskCreation/TaskCreation';
import P4_TaskSubmission from './Pages/Page4_TaskSubmission/TaskSubmission';
import P5_TeamAssignment from './Pages/Page5_TeamAssignment/TeamAssignment';
import P6_Teammate from './Pages/Page6_Teammate/Teammate';
import P7_CodeReview from './Pages/Page7_CodeReview/CodeReview'
import Rest_Foundation from './Pages/Rest_Foundation/Foundation'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path={"/"} element={<P0_Login/>}></Route>;
          <Route path={"/main"} element={<P1_Main/>}></Route>;
          <Route path={"/detail"} element={<P2_Detail/>}></Route>;
          <Route path={"/taskcreation"} element={<P3_TaskCreation/>}></Route>;
          <Route path={"/tasksubmission"} element={<P4_TaskSubmission/>}></Route>;
          <Route path={"/teamassignment"} element={<P5_TeamAssignment/>}></Route>;
          <Route path={"/teammate"} element={<P6_Teammate/>}></Route>;
          <Route path={"/codereview"} element={<P7_CodeReview/>}></Route>;
          <Route path={"/foundation"} element={<Rest_Foundation/>}></Route>;
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
