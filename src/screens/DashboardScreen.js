import React from 'react';
import { FaUserPlus, FaChartBar, FaMoneyBillWave, FaUniversity, FaHandHoldingUsd, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import '../App.css';

const DashboardScreen = () => (
  <div className="dashboard">
    {/* Date Range Selector */}
    <div className="date-selector">
      <div className="date-group">
        <label>From Static Report</label>
        <div className="date-input">
          <input type="date" value="2024-11-23" />
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>
      <div className="date-group">
        <label>To Static Report</label>
        <div className="date-input">
          <input type="date" value="2024-11-23" />
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>
      <button className="show-report-btn">Show Report</button>
    </div>

    {/* Dashboard Cards */}
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <div className="card-icon">
          <div className="icon-orange"><FaUserPlus /></div>
        </div>
        <div className="card-number">0</div>
        <div className="card-title">Total New Admissions</div>
      </div>
      <div className="dashboard-card">
        <div className="card-icon">
          <div className="icon-orange"><FaChartBar /></div>
        </div>
        <div className="card-number">10</div>
        <div className="card-title">Total Member Attendance</div>
      </div>
      <div className="dashboard-card">
        <div className="card-icon">
          <div className="icon-orange"><FaMoneyBillWave /></div>
        </div>
        <div className="card-stats">
          <div className="stat-row">
            <span>Cash:</span>
            <span>0</span>
          </div>
          <div className="stat-row">
            <span>Online:</span>
            <span>0</span>
          </div>
        </div>
        <div className="card-title">Total New Admission Received Amount</div>
      </div>
      <div className="dashboard-card">
        <div className="card-icon">
          <div className="icon-orange"><FaUniversity /></div>
        </div>
        <div className="card-stats">
          <div className="stat-row">
            <span>Cash:</span>
            <span>0</span>
          </div>
          <div className="stat-row">
            <span>Online:</span>
            <span>0</span>
          </div>
        </div>
        <div className="card-title">Monthly Fee Received Amount</div>
      </div>
      <div className="dashboard-card">
        <div className="card-icon">
          <div className="icon-orange"><FaHandHoldingUsd /></div>
        </div>
        <div className="card-stats">
          <div className="stat-row">
            <span>Cash:</span>
            <span>0</span>
          </div>
          <div className="stat-row">
            <span>Online:</span>
            <span>0</span>
          </div>
        </div>
        <div className="card-title">Total Trainer Commission Amount</div>
      </div>
      <div className="dashboard-card">
        <div className="card-icon">
          <div className="icon-orange"><FaShoppingCart /></div>
        </div>
        <div className="card-stats">
          <div className="stat-row">
            <span>Cash:</span>
            <span>0</span>
          </div>
          <div className="stat-row">
            <span>Online:</span>
            <span>0</span>
          </div>
        </div>
        <div className="card-title">Total Point Of Sale Received Amount</div>
      </div>
      <div className="dashboard-card">
        <div className="card-icon">
          <div className="icon-orange"><FaChartLine /></div>
        </div>
        <div className="card-stats">
          <div className="stat-row">
            <span>Cash:</span>
            <span>0</span>
          </div>
          <div className="stat-row">
            <span>Online:</span>
            <span>0</span>
          </div>
        </div>
        <div className="card-title">Total Expenditure Amount</div>
      </div>
    </div>

    {/* Summary Section */}
    <div className="summary-section">
      <div className="summary-item">
        <span className="summary-label">Total Cash Received:</span>
        <span className="summary-value">0</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total Cash Received for Trainer Commission:</span>
        <span className="summary-value">0</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total Cash Expenses:</span>
        <span className="summary-value">0</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Total Cash in Hand:</span>
        <span className="summary-value">0</span>
      </div>
    </div>
  </div>
);

export default DashboardScreen; 