import './App.css';
import React from 'react';
import MainPage2 from './components/MainPage/MainPage2'; // MainPage 컴포넌트를 import
import DetailPage from './components/DetailPage/DetailPage'; // 자세한 페이지 컴포넌트 import
import StudentQListPage from './components/StudentQListPage/StudentQListPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
//
import Login from './Pages/Login/Login';
import Foundation from "./Pages/Foundation/Foundation";
import SubmitAssign from "./Pages/SubmitAssign/SubmitAssign";
import SetAssign from "./Pages/SetAssign/SetAssign";
import SetTeam from "./Pages/SetTeam/SetTeam"
import CodeReview from "./Pages/CodeReview/CodeReview"
import StudentTable from "./Pages/SetTeam/StudentTable/StudentTable";
//

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path={"/Main"} element={<MainPage2/>}> </Route>
          <Route path={"/detail"} element={<DetailPage/>}> </Route>
          <Route path={"/studentqlist"} element={<StudentQListPage/>}> </Route>

          <Route path = '/' element = {<Login />}></Route>
          <Route path = '/Foundation' element = {<Foundation />} ></Route>
          <Route path = '/SubmitAssign' element = {<SubmitAssign />} ></Route>
          <Route path = '/SetAssign' element = {<SetAssign />} ></Route>
          <Route path = '/SetTeam' element = {<SetTeam />} ></Route>
          <Route path = '/StudentQListPage' element = {<StudentQListPage />} ></Route>
          <Route path = '/CodeReview' element = {<CodeReview />} ></Route>
          <Route path = '/StudentTable' element = {<StudentTable />} ></Route>
          //
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
