import React, { useState } from 'react';
import './BankLedgerScreen.css';

const sampleAccounts = [
  'CASH BOOK',
  'BANK ALHABIB',
];

function BankLedgerScreen() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [fromDate, setFromDate] = useState('2024-11-23');
  const [toDate, setToDate] = useState('2024-11-23');

  return (
    <div className="bank-ledger-container">
      <div className="bank-ledger-header-row">
        <label>Select Bank Account
          <select className="bank-ledger-select" value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
            <option value="">Select</option>
            {sampleAccounts.map(acc => (
              <option key={acc} value={acc}>{acc}</option>
            ))}
          </select>
        </label>
        <label>From Date
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="bank-ledger-date-input" />
        </label>
        <label>To Date
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="bank-ledger-date-input" />
        </label>
        <button className="bank-ledger-search-btn">Search</button>
      </div>
      <div className="bank-ledger-table-section">
        <div className="bank-ledger-table-title">Bank Transaction</div>
        <div className="bank-ledger-table-wrapper">
          <table className="bank-ledger-table">
            <thead>
              <tr>
                <th>SNO</th>
                <th>Date</th>
                <th>Payment Invoice</th>
                <th>Cheque No</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan="8" style={{textAlign: 'center'}}></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="bank-ledger-footer-row">
        <span className="bank-ledger-prev-label">Previous Balance: <input className="bank-ledger-prev-input" value="0" readOnly /></span>
        <span className="bank-ledger-debit-label">Total Debit: <input className="bank-ledger-debit-input" value="0" readOnly /></span>
        <span className="bank-ledger-credit-label">Total Credit: <input className="bank-ledger-credit-input" value="0" readOnly /></span>
        <span className="bank-ledger-balance-label">Balance: <input className="bank-ledger-balance-input" value="0" readOnly /></span>
        <button className="bank-ledger-print-btn">Print</button>
      </div>
    </div>
  );
}

export default BankLedgerScreen; 