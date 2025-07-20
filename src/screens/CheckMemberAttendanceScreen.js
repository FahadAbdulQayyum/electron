import React, { useState, useCallback } from 'react';
import '../App.css';

const CheckMemberAttendanceScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [month, setMonth] = useState('Jan');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [attendance, setAttendance] = useState([]);

  const monthMap = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };

  const searchMembers = useCallback(async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a Member ID or Name');
      return;
    }
    try {
      const result = await window?.electronAPI?.searchMembersForAttendance(searchQuery);
      console.log('Search results:', result);
      if (result.length === 0) {
        alert('No active members found');
        setSelectedMember(null);
        setAttendance([]);
      } else if (result.length === 1) {
        setSelectedMember(result[0]);
        fetchAttendance(result[0].id);
      } else {
        alert('Multiple members found. Please enter a more specific ID or name.');
      }
    } catch (error) {
      console.error('Error searching members:', error);
      alert('Failed to search members');
    }
  }, [searchQuery]);

  const fetchAttendance = useCallback(async (memberId) => {
    if (!memberId || !month || !year) return;
    try {
      const result = await window.electronAPI.getAttendance({
        memberId,
        month: monthMap[month],
        year,
      });
      console.log('Received attendance:', result);
      setAttendance(result || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert('Failed to fetch attendance');
    }
  }, [month, year]);

  const handleCheck = () => {
    if (!selectedMember) {
      alert('Please select a member first');
      return;
    }
    if (!year || isNaN(year) || year.length !== 4) {
      alert('Please enter a valid year');
      return;
    }
    fetchAttendance(selectedMember.id);
  };

  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { weekday: 'long' });
  };

  console.log('Rendering attendance:', attendance);

  return (
    <div className="check-member-attendance-section">
      <div className="attendance-header-row" style={{ justifyContent: 'space-between' }}>
        <div className="attendance-member-bar">
          <input
            type="text"
            placeholder="M-ID or Member Name"
            className="member-id-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ margin: '0 10px', fontWeight: 'bold' }}>
            {selectedMember ? selectedMember.fullName : 'No member selected'}
          </span>
          <button className="attendance-check-btn" onClick={searchMembers}>
            Select Member
          </button>
        </div>
        <div className="attendance-date-bar">
          <label style={{ marginRight: 10, fontWeight: 'bold' }}>To Month</label>
          <select
            className="month-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option>Jan</option>
            <option>Feb</option>
            <option>Mar</option>
            <option>Apr</option>
            <option>May</option>
            <option>Jun</option>
            <option>Jul</option>
            <option>Aug</option>
            <option>Sep</option>
            <option>Oct</option>
            <option>Nov</option>
            <option>Dec</option>
          </select>
          <label style={{ margin: '0 10px 0 20px', fontWeight: 'bold' }}>To Year</label>
          <input
            type="text"
            className="year-input"
            placeholder="2024"
            style={{ width: 70 }}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button className="attendance-check-btn" onClick={handleCheck}>
            Check
          </button>
        </div>
      </div>
      <div className="attendance-table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Sno</th>
              <th>Date</th>
              <th>Day</th>
              <th>Attendance Time</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>
                  No attendance records to display.
                </td>
              </tr>
            ) : (
              attendance.map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{record.attendanceDate}</td>
                  <td>{getDayOfWeek(record.attendanceDate)}</td>
                  <td>{record.attendanceTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckMemberAttendanceScreen;






// import React from 'react';
// import '../App.css';

// const CheckMemberAttendanceScreen = () => (
//   <div className="check-member-attendance-section">
//     <div className="attendance-header-row" style={{justifyContent: 'space-between'}}>
//       <div className="attendance-member-bar">
//         <input type="text" placeholder="M-ID" className="member-id-input" />
//         <input type="text" placeholder="Member Name" className="member-name-input" />
//         <button className="attendance-check-btn">Select Member</button>
//       </div>
//       <div className="attendance-date-bar">
//         <label style={{marginRight: 10, fontWeight: 'bold'}}>To Month</label>
//         <select className="month-select">
//           <option>Jan</option>
//           <option>Feb</option>
//           <option>Mar</option>
//           <option>Apr</option>
//           <option>May</option>
//           <option>Jun</option>
//           <option>Jul</option>
//           <option>Aug</option>
//           <option>Sep</option>
//           <option>Oct</option>
//           <option>Nov</option>
//           <option>Dec</option>
//         </select>
//         <label style={{margin: '0 10px 0 20px', fontWeight: 'bold'}}>To Year</label>
//         <input type="text" className="year-input" placeholder="2024" style={{width: 70}} />
//         <button className="attendance-check-btn">Check</button>
//       </div>
//     </div>
//     <div className="attendance-table-wrapper">
//       <table className="attendance-table">
//         <thead>
//           <tr>
//             <th>Sno</th>
//             <th>Date</th>
//             <th>Day</th>
//             <th>Attendance Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* No data rows for now */}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// export default CheckMemberAttendanceScreen; 