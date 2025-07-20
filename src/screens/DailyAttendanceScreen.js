import React from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import '../App.css';

const DailyAttendanceScreen = () => (
  <div className="daily-attendance-section">
    <div className="attendance-header-row">
      <div style={{flex: 1}}></div>
      <div className="attendance-date-bar">
        <label style={{marginRight: 10, fontWeight: 'bold'}}>Date</label>
        <span className="attendance-date-picker">
          <FaRegCalendarAlt style={{marginRight: 8, fontSize: 18, color: '#888'}} />
          <input type="text" value="23-Nov-2024" readOnly style={{width: 120, border: 'none', background: 'transparent', fontWeight: 'bold'}} />
          <span className="dropdown-arrow">▼</span>
        </span>
        <button className="attendance-check-btn">Check</button>
      </div>
    </div>
    <div className="attendance-table-wrapper">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Sno</th>
            <th>Date</th>
            <th>Member</th>
            <th>Day</th>
            <th>Attendance Time</th>
            <th>Fee Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {/* No data rows for now */}
        </tbody>
      </table>
    </div>
  </div>
);

export default DailyAttendanceScreen; 