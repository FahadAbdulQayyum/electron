import React, { useState } from 'react';
import '../App.css';
import SelectMemberScreen from './SelectMemberScreen';
import { myGithub, myPhone } from '../utils/constants';

const AddPaymentFeeScreen = () => {
  const [showSelectMember, setShowSelectMember] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Placeholder data for summary
  const summary = {
    gymName: 'FITNESS',
    location: 'Karachi',
    phone: '0344-3443441',
    member: '277-m zahid',
    paymentDate: '23-Nov-2024',
    expiryDate: '22-Dec-2024',
    prevBalance: 0,
    monthlyFee: 3750,
    trainerFee: 0,
    totalAmount: 3750,
    waived: 0,
    payFee: 0,
    payMode: '',
    balance: 3750,
  };

  return (
    <div className="add-payment-fee-section">
      <div className="payment-fee-header-row">
        <input type="text" placeholder="Member ID" className="fee-input" />
        <input type="text" placeholder="Member Name" className="fee-input" />
        <input type="text" placeholder="Fee Expiry" className="fee-input" />
        <input type="text" placeholder="Trainer Name" className="fee-input yellow-bg" />
        <input type="text" placeholder="Monthly Fee" className="fee-input yellow-bg" />
        <input type="text" placeholder="Trainer Comision" className="fee-input yellow-bg" />
        <input type="text" placeholder="Trainer Fee" className="fee-input yellow-bg" />
        <button className="attendance-check-btn" onClick={() => setShowSelectMember(true)}>Select Member</button>
        <button className="pay-fee-btn" onClick={() => setShowPaymentModal(true)}>Pay Fee</button>
      </div>
      <div className="fee-ledger-label">Fee Ledger</div>
      <div className="attendance-table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>Expiry Date</th>
              <th>Monthly Fee</th>
              <th>Trainer Commision</th>
              <th>Trainer Fee</th>
              <th>Gym Commission</th>
              <th>Paid Amount</th>
              <th>Pay Date</th>
              <th>Waived</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {/* No data rows for now */}
          </tbody>
        </table>
      </div>
      <div className="fee-summary-row">
        <div>Total Monthly Fee: <span className="fee-green">0</span></div>
        <div>Total Trainer Commision: <span className="fee-green">0</span></div>
        <div>Total Trainer Fee: <span className="fee-green">0</span></div>
        <div>Total Gym Commision: <span className="fee-green">0</span></div>
        <div>Total Collect Fee: <span className="fee-green">0</span></div>
        <div>Total Waived Fee: <span className="fee-green">0</span></div>
        <div style={{marginLeft: 'auto', fontWeight: 'bold'}}>Total Balance Amount: <span className="fee-orange">0</span></div>
      </div>
      {/* Select Member Modal */}
      {showSelectMember && (
        <div className="modal-overlay" onClick={() => setShowSelectMember(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowSelectMember(false)}>×</button>
            <SelectMemberScreen />
          </div>
        </div>
      )}
      {/* Payment Modal with detailed form and summary */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-fee-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            <div className="payment-fee-main-flex">
              {/* Left: Payment Form (detailed) */}
              <div className="payment-fee-form-panel">
                <div className="payment-fee-row">
                  <div className="date-group">
                    <label className="fee-label">Payment Date</label>
                    <input type="date" className="fee-input" value="2024-11-23" />
                  </div>
                  <div className="date-group">
                    <label className="fee-label" style={{ color: '#c8102e' }}>Next Expiry</label>
                    <input type="date" className="fee-input" value="2024-12-22" />
                  </div>
                </div>
                <div className="payment-fee-row fee-amount-row">
                  <div className="fee-col">
                    <label className="fee-label">Monthly Fee</label>
                    <input type="number" className="fee-input yellow-bg" value="3750" />
                  </div>
                  <div className="fee-col">
                    <label className="fee-label">Trainer fee</label>
                    <input type="number" className="fee-input yellow-bg" value="0" />
                  </div>
                  <div className="fee-col">
                    <label className="fee-label">Trainer Comision</label>
                    <input type="number" className="fee-input yellow-bg" value="0" />
                  </div>
                  <div className="fee-col">
                    <label className="fee-label">Waived</label>
                    <input type="number" className="fee-input red-bg" value="0" />
                  </div>
                  <div className="fee-col">
                    <label className="fee-label">Amount</label>
                    <input type="number" className="fee-input red-bg" value="0" />
                  </div>
                </div>
                <div className="payment-fee-row fee-commission-row">
                  <span className="fee-label">Gym Commission: <b>0</b></span>
                  <span className="fee-label total-fee-label">Total Fee: <b className="fee-red">3750</b></span>
                </div>
                <div className="payment-fee-row">
                  <label className="fee-label" style={{ color: '#c8102e' }}>Select Account</label>
                  <select className="fee-select green-bg">
                    <option>Select</option>
                  </select>
                </div>
                <div className="payment-fee-row">
                  <div className="fee-col">
                    <label className="fee-label">Cheque No</label>
                    <input type="text" className="fee-input yellow-bg" />
                  </div>
                  <div className="fee-col">
                    <label className="fee-label">Payment</label>
                    <input type="number" className="fee-input yellow-bg" value="0" />
                  </div>
                </div>
                <div className="payment-fee-row">
                  <label className="fee-label" style={{ color: '#c8102e' }}>Payment Received By:</label>
                  <input type="text" className="fee-input yellow-bg" style={{ width: '100%' }} />
                </div>
                <div className="payment-fee-row balances-row">
                  <span className="fee-label">Previous Balance: <b style={{ color: '#c8102e' }}>0</b></span>
                  <span className="fee-label">Current Balance: <b style={{ color: '#c8102e' }}>3750</b></span>
                  <button className="payment-green-btn">Payment</button>
                </div>
                <div className="payment-fee-row total-balance-row">
                  <span className="fee-label">Total Balance: <b className="fee-red">3750</b></span>
                </div>
              </div>
              {/* Right: Summary Panel */}
              <div className="payment-summary-panel payment-summary-static">
                <div className="summary-header">Fee Payment</div>
                <div className="summary-box">
                  <div className="summary-gym-title"><b>{summary.gymName}</b></div>
                  <div className="summary-location">{summary.location}</div>
                  <div className="summary-phone">{summary.phone}</div>
                  <hr className="summary-hr" />
                  <div className="summary-row"><b>Member:</b> <span>{summary.member}</span></div>
                  <div className="summary-row"><b>Payment Date:</b> <span>{summary.paymentDate}</span></div>
                  <div className="summary-row"><b>Fee Expiry Date:</b> <span>{summary.expiryDate}</span></div>
                  <div className="summary-row"><b>Previous Balance:</b> <span>{summary.prevBalance}</span></div>
                  <div className="summary-row"><b>Monthly Fee:</b> <span>{summary.monthlyFee}</span></div>
                  <div className="summary-row"><b>Trainer Fee:</b> <span>{summary.trainerFee}</span></div>
                  <div className="summary-row"><b>Total Amount:</b> <span>{summary.totalAmount}</span></div>
                  <div className="summary-row"><b>Waived Amount:</b> <span>{summary.waived}</span></div>
                  <div className="summary-row"><b>Pay Fee:</b> <span>{summary.payFee}</span></div>
                  <div className="summary-row"><b>Pay Mode:</b> <span>{summary.payMode}</span></div>
                  <div className="summary-row"><b>Balance:</b> <span>{summary.balance}</span></div>
                  <hr className="summary-hr" />
                  <div className="summary-footer">Developed by {myGithub}: {myPhone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPaymentFeeScreen; 