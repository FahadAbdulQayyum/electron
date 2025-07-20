import React, { useState } from 'react';
import './DailySalesReportScreen.css';

const sampleData = [
  { sno: 1, date: '22-Nov-2024', account: '1-CASH BOOK[00000]', remarks: 'Expenses', commission: 'Trainer: [Commission: 0]', amount: 1000 },
  { sno: 2, date: '22-Nov-2024', account: '4-BANK ALHABIB', remarks: '277-m zahid New Member Registration', commission: 'Trainer: [Commission: 0]', amount: 3750 },
  { sno: 3, date: '22-Nov-2024', account: '1-CASH BOOK[00000]', remarks: '282-m arslan shafi New Member Registration', commission: 'Trainer: [Commission: 0]', amount: 2000 },
  { sno: 4, date: '22-Nov-2024', account: '1-CASH BOOK[00000]', remarks: '284-Ayesha Shahbaz New Member Registration', commission: 'Trainer: [Commission: 0]', amount: 3000 },
  { sno: 5, date: '22-Nov-2024', account: '1-CASH BOOK[00000]', remarks: '285-Kashish Fatima New Member Registration', commission: 'Trainer: [Commission: 0]', amount: 2500 },
  { sno: 6, date: '22-Nov-2024', account: '1-CASH BOOK[00000]', remarks: '287-Rani New Member Registration', commission: 'Trainer: [Commission: 0]', amount: 3000 },
  { sno: 7, date: '22-Nov-2024', account: '1-CASH BOOK[00000]', remarks: '289-asif saeem New Member Registration', commission: 'Trainer: [Commission: 0]', amount: 2000 },
  { sno: 8, date: '22-Nov-2024', account: '1-CASH BOOK[00000]', remarks: '290-shahzad New Member Registration', commission: 'Trainer: [Commission: 0]', amount: 4000 },
];

function DailySalesReportScreen() {
  const [fromDate, setFromDate] = useState('2024-11-22');
  const [toDate, setToDate] = useState('2024-11-23');

  return (
    <div className="daily-sales-container">
      <div className="daily-sales-header-row">
        <div></div>
        <a href="#" className="daily-sales-link">Daily Sales Report</a>
      </div>
      <div className="daily-sales-filters-row">
        <label>From Date
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="daily-sales-date-input" />
        </label>
        <label>To Date
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="daily-sales-date-input" />
        </label>
        <button className="daily-sales-report-btn">Report</button>
      </div>
      <div className="daily-sales-table-section">
        <div className="daily-sales-table-title">Daily Sales Report</div>
        <div className="daily-sales-table-wrapper">
          <table className="daily-sales-table">
            <thead>
              <tr>
                <th>Sno</th>
                <th>Date</th>
                <th>Account Number</th>
                <th>Payment Remarks</th>
                <th>Trainer Commission</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, idx) => (
                <tr key={row.sno} className={idx === 0 ? 'highlight-row' : ''}>
                  <td>{row.sno}</td>
                  <td>{row.date}</td>
                  <td>{row.account}</td>
                  <td>{row.remarks}</td>
                  <td>{row.commission}</td>
                  <td>{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="daily-sales-footer-row">
        <span className="footer-label green">Total Cash Received: <input className="footer-input green" value="16500" readOnly /></span>
        <span className="footer-label red">Expense From By Cash: <input className="footer-input red" value="1000" readOnly /></span>
        <span className="footer-label green">Cash in Hand: <input className="footer-input green" value="15500" readOnly /></span>
        <span className="footer-label blue">Total Received In Bank: <input className="footer-input blue" value="3750" readOnly /></span>
        <span className="footer-label red">Expense From By Bank: <input className="footer-input red" value="0" readOnly /></span>
        <span className="footer-label orange">Trainer Commision From Cash: <input className="footer-input orange" value="0" readOnly /></span>
        <span className="footer-label orange">Trainer Commision From Online: <input className="footer-input orange" value="0" readOnly /></span>
        <button className="daily-sales-print-btn">Print</button>
      </div>
    </div>
  );
}

export default DailySalesReportScreen; 