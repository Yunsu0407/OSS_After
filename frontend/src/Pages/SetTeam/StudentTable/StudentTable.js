import React, { useState, useEffect } from 'react';
import './StudentTable.css';

function StudentTable({ data, tableName }) {
  const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
    if (data) {
      setStudentsData(data);
    }
  }, [data]);

  function groupStudentsByTeam(students) {
    const teams = {};
    students.forEach(student => {
      const teamNumber = student.team_id;
      if (!teams[teamNumber]) {
        teams[teamNumber] = [];
      }
      teams[teamNumber].push(student.userDTOList[0]);
    });
    return teams;
  }

  const teams = groupStudentsByTeam(studentsData);

  return (
    data && data.length > 0 ? (
      <div className="student-table-container">
        <h2>{tableName}</h2>
        <div className="student-table-row">
          {Object.keys(teams).map((teamNumber, index) => (
            <div key={index} className="student-table-column">
              <h3>팀 {teamNumber}</h3>
              <table>
                <thead>
                  <tr>
                    <th>팀 번호</th>
                    <th>토큰</th>
                    <th>이름</th>
                  </tr>
                </thead>
                <tbody>
                  {teams[teamNumber].map((student, studentIndex) => (
                    <tr key={studentIndex}>
                      <td>{teamNumber}</td>
                      <td>{student.token}</td>
                      <td>{student.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="no-team-message">
        팀을 생성해 그룹 활동을 시작하세요.
      </div>
    )
  );
}


export default StudentTable;
