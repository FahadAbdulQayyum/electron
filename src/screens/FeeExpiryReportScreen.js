import React, { useState } from 'react';
import './FeeExpiryReportScreen.css';

// Sample data based on the screenshot
const sampleData = [
  { sno: 1, regDate: '01-Nov-2024', name: '5-Abdul Samad', contact: '**********', admission: 0, monthly: 4000, trainer: 0, expiry: '01-Dec-2024' },
  { sno: 2, regDate: '01-Nov-2024', name: '6-Najeed', contact: '**********', admission: 0, monthly: 2000, trainer: 0, expiry: '01-Dec-2024' },
  { sno: 3, regDate: '01-Nov-2024', name: '9-Abdul Haddi', contact: '**********', admission: 0, monthly: 2000, trainer: 0, expiry: '01-Dec-2024' },
  { sno: 4, regDate: '01-Nov-2024', name: '10-Shafeean 571', contact: '**********', admission: 0, monthly: 2500, trainer: 0, expiry: '01-Dec-2024' },
  { sno: 5, regDate: '01-Nov-2024', name: '11-M Faizan 572', contact: '**********', admission: 0, monthly: 2500, trainer: 0, expiry: '01-Dec-2024' },
  { sno: 6, regDate: '01-Nov-2024', name: '12-Rumail Shah 573', contact: '**********', admission: 0, monthly: 2500, trainer: 0, expiry: '01-Dec-2024' },
  { sno: 7, regDate: '01-Nov-2024', name: '13-M Shahrukh 574', contact: '**********', admission: 2000, monthly: 2500, trainer: 0, expiry: '01-Dec-2024' },
  { sno: 8, regDate: '02-Nov-2024', name: '14-M Zain 576', contact: '**********', admission: 0, monthly: 2500, trainer: 0, expiry: '02-Dec-2024' },
  { sno: 9, regDate: '02-Nov-2024', name: '15-Sohaib 578', contact: '**********', admission: 0, monthly: 2000, trainer: 0, expiry: '02-Dec-2024' },
  { sno: 10, regDate: '02-Nov-2024', name: '18-Rafay Iqbal 592', contact: '**********', admission: 0, monthly: 9000, trainer: 0, expiry: '03-Dec-2024' },
  { sno: 11, regDate: '04-Nov-2024', name: '19-Abdullah Khan 591', contact: '**********', admission: 0, monthly: 2500, trainer: 0, expiry: '03-Dec-2024' },
  { sno: 12, regDate: '04-Nov-2024', name: '20-Faraz ptail', contact: '**********', admission: 0, monthly: 2500, trainer: 0, expiry: '03-Dec-2024' },
  { sno: 13, regDate: '04-Nov-2024', name: '25-Junaid Jaweed 556', contact: '**********', admission: 0, monthly: 2500, trainer: 0, expiry: '03-Dec-2024' },
  { sno: 14, regDate: '04-Nov-2024', name: '30-Shahmir Khan', contact: '**********', admission: 0, monthly: 2500, trainer: 0, expiry: '03-Dec-2024' },
  { sno: 15, regDate: '04-Nov-2024', name: '83-Syed Rafay Ahmed', contact: '**********', admission: 0, monthly: 2000, trainer: 0, expiry: '03-Dec-2024' },
  { sno: 16, regDate: '04-Nov-2024', name: '84-Rumail Shah', contact: '**********', admission: 0, monthly: 2000, trainer: 0, expiry: '03-Dec-2024' },
  { sno: 17, regDate: '04-Nov-2024', name: '100-Osama', contact: '**********', admission: 0, monthly: 2000, trainer: 0, expiry: '03-Dec-2024' },
];

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

function FeeExpiryReportScreen() {
  const [days, setDays] = useState(10);
  const [date, setDate] = useState('2024-11-23');
  const [filteredData, setFilteredData] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);

  // Filter logic for left Report button
  const handleLeftReport = () => {
    const today = new Date();
    const filtered = sampleData.filter(row => {
      const diff = daysBetween(today.toISOString().slice(0,10), row.expiry.split('-').reverse().join('-'));
      return diff >= 0 && diff <= Number(days);
    });
    setFilteredData(filtered);
    setShowFiltered(true);
  };

  // Show all data by default, or filtered if report pressed
  const dataToShow = showFiltered ? filteredData : [];

  return (
    <div className="fee-expiry-container">
      <div className="fee-expiry-header-row">
        <div className="fee-expiry-title">Fee Expiry Members Report</div>
        <a href="#" className="fee-expiry-link">Fee Expiry Report</a>
      </div>
      <div className="fee-expiry-row">
        <div className="fee-expiry-section">
          <label className="fee-expiry-label">Upcoming Expiration Fee (enter number of days)</label>
          <div className="fee-expiry-input-row">
            <input type="number" value={days} onChange={e => setDays(e.target.value)} className="fee-expiry-input" />
            <button className="fee-expiry-btn" onClick={handleLeftReport}>Report</button>
          </div>
        </div>
        <div className="fee-expiry-section">
          <label className="fee-expiry-label">Today Expiry Report (only active members)</label>
          <div className="fee-expiry-input-row">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="fee-expiry-input" />
            <button className="fee-expiry-btn">Report</button>
          </div>
        </div>
      </div>
      <div className="fee-expiry-table-section">
        <div className="fee-expiry-table-title">Fee Expiry Members Report</div>
        <div className="fee-expiry-table-wrapper">
          <table className="fee-expiry-table">
            <thead>
              <tr>
                <th>Sno</th>
                <th>Registration Date</th>
                <th>Member Name</th>
                <th>Contact #</th>
                <th>Admission Fee</th>
                <th>Monthly Fee</th>
                <th>Trainer Fee</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {dataToShow.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center'}}>No data available</td></tr>
              ) : (
                dataToShow.map((row, idx) => (
                  <tr key={row.sno} className={idx === 0 ? 'highlight-row' : ''}>
                    <td>{row.sno}</td>
                    <td>{row.regDate}</td>
                    <td>{row.name}</td>
                    <td>{row.contact}</td>
                    <td>{row.admission}</td>
                    <td>{row.monthly}</td>
                    <td>{row.trainer}</td>
                    <td>{row.expiry}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FeeExpiryReportScreen; 