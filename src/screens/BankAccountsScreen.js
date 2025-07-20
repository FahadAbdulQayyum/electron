import React, { useState } from 'react';
import './BankAccountsScreen.css';

const sampleAccounts = [
  { sno: 1, bank: 'CASH BOOK', title: 'CASH BOOK', number: '00000', balance: 0 },
  { sno: 2, bank: 'BANK ALHABIB', title: 'SHAHZAIB', number: '1084', balance: 0 },
];

function BankAccountsScreen() {
  return (
    <div className="bank-accounts-container">
      <div className="bank-accounts-left">
        <div className="bank-accounts-title">Add New Bank Account</div>
        <input className="bank-accounts-input" placeholder="Bank Name" />
        <input className="bank-accounts-input" placeholder="Account Title" />
        <input className="bank-accounts-input" placeholder="Account Number" />
        <input className="bank-accounts-input yellow" placeholder="Opening Balance" type="number" />
        <button className="bank-accounts-create-btn">Create New Bank Account</button>
        <div className="bank-accounts-btn-row">
          <button className="bank-accounts-save-btn">Save</button>
          <button className="bank-accounts-update-btn">Update</button>
        </div>
        <button className="bank-accounts-refresh-btn">Refresh</button>
      </div>
      <div className="bank-accounts-right">
        <div className="bank-accounts-table-title">Bank Accounts Detail</div>
        <div className="bank-accounts-table-wrapper">
          <table className="bank-accounts-table">
            <thead>
              <tr>
                <th>SNO</th>
                <th>Bank Name</th>
                <th>Account Title</th>
                <th>Account #</th>
                <th>Opening Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sampleAccounts.map(acc => (
                <tr key={acc.sno}>
                  <td>{acc.sno}</td>
                  <td>{acc.bank}</td>
                  <td>{acc.title}</td>
                  <td>{acc.number}</td>
                  <td>{acc.balance}</td>
                  <td><button className="bank-accounts-edit-btn">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BankAccountsScreen; 