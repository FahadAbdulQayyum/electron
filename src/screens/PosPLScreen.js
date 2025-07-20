import React, { useState } from 'react';
import './PosPLScreen.css';

function PosPLScreen() {
  const [fromDate, setFromDate] = useState('2024-11-23');
  const [toDate, setToDate] = useState('2024-11-23');

  return (
    <div className="pos-pl-container">
      <div className="pos-pl-header-row">
        <div></div>
        <a href="#" className="pos-pl-link">POS Profit and Loss</a>
      </div>
      <div className="pos-pl-filters-row">
        <label>From Date
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="pos-pl-date-input" />
        </label>
        <label>To Date
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="pos-pl-date-input" />
        </label>
        <button className="pos-pl-report-btn">Report</button>
      </div>
      <div className="pos-pl-table-section">
        <div className="pos-pl-table-title">P/L</div>
        <div className="pos-pl-table-wrapper">
          <table className="pos-pl-table">
            <thead>
              <tr>
                <th>Sno</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan="8" style={{textAlign: 'center'}}></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="pos-pl-footer">
        <span className="pos-pl-total-label sales">Total Sales:</span>
        <input className="pos-pl-total-input sales" value="0" readOnly />
        <span className="pos-pl-total-label profit">Total Profit:</span>
        <input className="pos-pl-total-input profit" value="0" readOnly />
      </div>
    </div>
  );
}

export default PosPLScreen; 