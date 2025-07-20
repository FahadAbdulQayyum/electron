import React, { useState } from 'react';
import './PosMainScreen.css';

function PosMainScreen() {
  return (
    <div className="pos-main-container">
      <div className="pos-main-left">
        <div className="pos-main-title">New Sale</div>
        <div className="pos-main-row">
          <input className="pos-main-input" placeholder="Customer Name" />
          <input className="pos-main-input" placeholder="Customer Contact#" />
          <input className="pos-main-input" placeholder="Remarks" />
        </div>
        <div className="pos-main-row">
          <label className="pos-main-label">Product Name:</label>
          <select className="pos-main-select"><option>Select</option></select>
          <span className="pos-main-stock">Stock</span>
          <input className="pos-main-input small" placeholder="Quantity" />
          <input className="pos-main-input small" placeholder="Price" />
          <input className="pos-main-input small gray" placeholder="Amount" readOnly />
          <button className="pos-main-add-btn">Add</button>
        </div>
        <div className="pos-main-table-wrapper">
          <table className="pos-main-table">
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan="5" style={{textAlign: 'center'}}></td></tr>
            </tbody>
          </table>
        </div>
        <div className="pos-main-footer-row">
          <span>Total Qty: <input className="pos-main-total-input" value="0" readOnly /></span>
          <span>Total Billing: <input className="pos-main-total-input" value="0" readOnly /></span>
        </div>
        <div className="pos-main-btn-row">
          <button className="pos-main-clear-btn">Clear</button>
          <button className="pos-main-pay-btn">Pay Now</button>
        </div>
      </div>
      <div className="pos-main-right">
        <div className="pos-main-print-title">Print Preview</div>
        <div className="pos-main-print-box">
          <div className="pos-main-print-header">FITNESS</div>
          <div className="pos-main-print-sub">Ph#: 0344-2652651</div>
          <div className="pos-main-print-sub">1st Floor, H# A-904 Near Ronaq-e-Sheereen,</div>
          <div className="pos-main-print-row"><b>Customer Name:</b> <span className="gray-box" /></div>
          <div className="pos-main-print-row"><b>Contact #</b> <span className="gray-box" /></div>
          <div className="pos-main-print-row">Inv#: 23112024043930</div>
          <div className="pos-main-print-row">23-Nov-2024 04:39:30 T</div>
          <table className="pos-main-print-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan="4">Qty: &nbsp;&nbsp; Bill:</td></tr>
            </tbody>
          </table>
          <div className="pos-main-print-footer">Develop by Softwebpk.com</div>
        </div>
      </div>
    </div>
  );
}

export default PosMainScreen; 