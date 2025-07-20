import React, { useState } from 'react';
import './DueFeeReportScreen.css';

function DueFeeReportScreen() {
  const [expiredOnly, setExpiredOnly] = useState(false);
  const [zeroBalance, setZeroBalance] = useState(false);
  const [adFilter, setAdFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');

  return (
    <div className="due-fee-container">
      <div className="due-fee-header-row">
        <div></div>
        <a href="#" className="due-fee-link">Member Duos Fee Report</a>
      </div>
      <div className="due-fee-filters-row">
        <div className="due-fee-checkboxes">
          <label><input type="checkbox" checked={expiredOnly} onChange={e => setExpiredOnly(e.target.checked)} /> Show only members whose fees have expired.</label>
          <label><input type="checkbox" checked={zeroBalance} onChange={e => setZeroBalance(e.target.checked)} /> Do not show records of members with a zero balance.</label>
        </div>
        <div className="due-fee-dropdowns">
          <label>Filter By A/D
            <select value={adFilter} onChange={e => setAdFilter(e.target.value)}>
              <option>All</option>
              <option>A</option>
              <option>D</option>
            </select>
          </label>
          <label>Filter By Gender
            <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>
          <button className="due-fee-show-btn">Show</button>
        </div>
      </div>
      <div className="due-fee-table-section">
        <div className="due-fee-table-title">Members Due Fee</div>
        <div className="due-fee-table-wrapper">
          <table className="due-fee-table">
            <thead>
              <tr>
                <th>Sno</th>
                <th>Admission Date</th>
                <th>Gender</th>
                <th>Member</th>
                <th>Admission Fee</th>
                <th>Trainer Fee</th>
                <th>Monthly Fee</th>
                <th>Expiry Date</th>
                <th>Balance Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan="9" style={{textAlign: 'center'}}> </td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="due-fee-footer">
        <span className="due-fee-total-label">Total Balance:</span>
        <span className="due-fee-total-value">0</span>
      </div>
    </div>
  );
}

export default DueFeeReportScreen; 