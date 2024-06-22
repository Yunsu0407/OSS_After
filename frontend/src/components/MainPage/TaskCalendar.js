import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // css import
import './MainPage2.css';
import './CalendarStyle.css'; // 커스텀 스타일

function TaskCalendar({ deadlines }) { // deadlines prop 추가
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const isDeadline = (date) => {
    return deadlines.some(deadline => {
      const deadlineDate = new Date(deadline);
      return deadlineDate.getFullYear() === date.getFullYear() &&
        deadlineDate.getMonth() === date.getMonth() &&
        deadlineDate.getDate() === date.getDate();
    });
  };

  return (
    <div className="main-task-calendar">
      <div className="main-calendar-header">
        과제 캘린더
      </div>
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={({ date, view }) => view === 'month' && isDeadline(date) ? 'deadline' : null}
      />
    </div>
  );
}

export default TaskCalendar;
