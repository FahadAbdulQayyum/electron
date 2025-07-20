import React, { useState } from 'react';
import './ExpenditureScreen.css';

const sampleHeads = [
  '1-CHAI',
  '2-ELECTRIC BILL',
  '3-WATER BILL',
  '4-MINIRAL WATER',
  '5-GROCERY',
  '6-GROCERY GYM',
  '7-PETROL',
  '8-OTHER EXPENCE',
];

function ExpenditureScreen() {
  const [selectedHead, setSelectedHead] = useState('');
  const [fromDate, setFromDate] = useState('2024-11-23');
  const [toDate, setToDate] = useState('2024-11-23');
  const [groupWise, setGroupWise] = useState(false);

  return (
    <div className="expenditure-container">
      <div className="expenditure-left">
        <div className="expenditure-add-title">Add Expenditure</div>
        <div className="expenditure-row">
          <label>Expenditure Head</label>
          <select className="expenditure-select" value={selectedHead} onChange={e => setSelectedHead(e.target.value)}>
            <option value="">Select Head</option>
            {sampleHeads.map(head => (
              <option key={head} value={head}>{head}</option>
            ))}
          </select>
          <button className="expenditure-btn new">New Head</button>
          <button className="expenditure-btn edit">Edit</button>
        </div>
        <button className="expenditure-save-btn">Save Expense</button>
      </div>
      <div className="expenditure-right">
        <div className="expenditure-header-row">
          <label>Expenditure Head
            <select className="expenditure-select small">
              <option>ALL</option>
              {sampleHeads.map(head => (
                <option key={head}>{head}</option>
              ))}
            </select>
          </label>
          <label className="expenditure-groupwise">
            <input type="checkbox" checked={groupWise} onChange={e => setGroupWise(e.target.checked)} /> GroupWise
          </label>
          <label>From Date
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="expenditure-date-input" />
          </label>
          <label>To Date
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="expenditure-date-input" />
          </label>
          <button className="expenditure-search-btn">Search</button>
        </div>
        <div className="expenditure-table-section">
          <div className="expenditure-table-title">Expenditure Details</div>
          <div className="expenditure-table-wrapper">
            <table className="expenditure-table">
              <thead>
                <tr>
                  <th>SNO</th>
                  <th>Head Name</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan="5" style={{textAlign: 'center'}}></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="expenditure-footer-row">
          <span>Total Expenses: <span className="expenditure-total">0</span></span>
          <button className="expenditure-print-btn">Print</button>
        </div>
      </div>
    </div>
  );
}

export default ExpenditureScreen; 