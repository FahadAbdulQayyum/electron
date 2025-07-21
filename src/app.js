import React, { useState } from 'react';
import './App.css';
import { FaTachometerAlt, FaUsers, FaCashRegister, FaChartBar } from 'react-icons/fa';
import { BsBank2 } from 'react-icons/bs';
import DashboardScreen from './screens/DashboardScreen';
import AddMemberScreen from './screens/AddMemberScreen';
import AddTrainerScreen from './screens/AddTrainerScreen';
import AddPackageScreen from './screens/AddPackageScreen';
import DailyAttendanceScreen from './screens/DailyAttendanceScreen';
import CheckMemberAttendanceScreen from './screens/CheckMemberAttendanceScreen';
import AddPaymentFeeScreen from './screens/AddPaymentFeeScreen';
import SelectMemberScreen from './screens/SelectMemberScreen';
import FeeExpiryReportScreen from './screens/FeeExpiryReportScreen';
import DueFeeReportScreen from './screens/DueFeeReportScreen';
import PosPLScreen from './screens/PosPLScreen';
import PosMainScreen from './screens/PosMainScreen';
import PosAddProductScreen from './screens/PosAddProductScreen';
import ExpenditureScreen from './screens/ExpenditureScreen';
import BankLedgerScreen from './screens/BankLedgerScreen';
import BankAccountsScreen from './screens/BankAccountsScreen';
import DailySalesReportScreen from './screens/DailySalesReportScreen';
import { myGithub, myPhone } from './utils/constants';
import TodoScreen from './screens/TodoScreen';
import MemberDetailsScreen from './screens/MembersDetail';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="App">
      {/* Header Navigation */}
      <header className="header">
        <div className="logo-section">
          <div className="logo">
            <FaTachometerAlt style={{fontSize: '1.5rem', color: '#fff'}} /><br/>
            GYM LOGO
          </div>
          <div className="gym-title">
            GYM Management System
          </div>
        </div>
        
        <nav className="nav-buttons">
          <div className="dropdown">
            <button 
              className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <FaTachometerAlt style={{marginRight: 6}} /> Dashboard
            </button>
            <div className="dropdown-content">
              <div className="dropdown-item" onClick={() => setCurrentView('dashboard')}>
                Daily Dashboard
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('home')}>
                Software Screen
              </div>
            </div>
          </div>
          <div className="dropdown">
            <button 
              className={`nav-btn ${currentView === 'members' ? 'active' : ''}`}
              onClick={() => setCurrentView('members')}
            >
              <FaUsers style={{marginRight: 6}} /> Members
            </button>
            <div className="dropdown-content">
              <div className="dropdown-item" id='clickButton' onClick={() => setCurrentView('add-member')}>
                Add New Member
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('select-member')}>
                Select Member
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('add-trainer')}>
                Add Trainer/Helper
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('add-packages')}>
                Add Packages
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('check-attendance')}>
                Check Member Attendance
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('daily-attendance')}>
                Daily Attendance Report
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('all-members')}>
                Show all Member Detail
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('daily-sales')}>
                Daily Sales Report
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('add-fee-payment')}>
                Add Fee Payment
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('fee-expiry')}>
                Fee Expiry Member Report
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('due-fee')}>
                Due Fee Report
              </div>
            </div>
          </div>
          <div className="dropdown">
            <button 
              className={`nav-btn ${currentView.startsWith('pos-') ? 'active' : ''}`}
            >
              <FaCashRegister style={{marginRight: 6}} /> POS
            </button>
            <div className="dropdown-content">
              <div className="dropdown-item" onClick={() => setCurrentView('pos-add-products')}>
                Add Products
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('pos-pos')}>
                POS
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('pos-edit-sale-order')}>
                Edit Sale Order
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('pos-add-stock')}>
                Add Stock
              </div>
              <div className="dropdown-item" onClick={() => setCurrentView('pos-pl')}>
                POS P/L
              </div>
            </div>
          </div>
          <button 
            className={`nav-btn ${currentView === 'accounts' ? 'active' : ''}`}
            onClick={() => setCurrentView('accounts')}
          >
            <BsBank2 style={{marginRight: 6}} /> Bank Accounts
          </button>
          <button 
            className={`nav-btn ${currentView === 'expenditure' ? 'active' : ''}`}
            onClick={() => setCurrentView('expenditure')}
          >
            <FaChartBar style={{marginRight: 6}} /> Expenditure
          </button>

          <button
            className="nav-btn"
            onClick={() => setCurrentView('todo')}
          >
            Todo
          </button>
        </nav>

        <div className="window-controls">
          <button className="control-btn">−</button>
          <button className="control-btn">×</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {currentView === 'todo' && <TodoScreen />}
        {currentView === 'dashboard' && <DashboardScreen />}
        {currentView === 'add-member' && <AddMemberScreen />}
        {currentView === 'all-members' && <MemberDetailsScreen />}
        {currentView === 'select-member' && <SelectMemberScreen />}
        {currentView === 'add-trainer' && <AddTrainerScreen />}
        {currentView === 'add-packages' && <AddPackageScreen />}
        {currentView === 'daily-attendance' && <DailyAttendanceScreen />}
        {currentView === 'check-attendance' && <CheckMemberAttendanceScreen />}
        {currentView === 'add-fee-payment' && <AddPaymentFeeScreen />}
        {currentView === 'fee-expiry' && <FeeExpiryReportScreen />}
        {currentView === 'due-fee' && <DueFeeReportScreen />}
        {currentView === 'expenditure' && <ExpenditureScreen />}
        {currentView === 'accounts' && <BankLedgerScreen />}
        {currentView === 'bank-accounts' && <BankAccountsScreen />}
        {currentView === 'home' && (
          <div className="placeholder-view">
            <h2>Software Screen</h2>
            <p>Software screen functionality coming soon...</p>
          </div>
        )}
        {currentView === 'members' && (
          <div className="placeholder-view">
            <h2>Members Management</h2>
            <p>Select an option from the Members dropdown menu above.</p>
          </div>
        )}
        {currentView === 'pos-add-products' && <PosAddProductScreen />}
        {currentView === 'pos-pos' && <PosMainScreen />}
        {currentView === 'pos-edit-sale-order' && (
          <div className="placeholder-view"><h2>Edit Sale Order</h2><p>Edit Sale Order screen coming soon...</p></div>
        )}
        {currentView === 'pos-add-stock' && (
          <div className="placeholder-view"><h2>Add Stock</h2><p>Add Stock screen coming soon...</p></div>
        )}
        {currentView === 'pos-pl' && <PosPLScreen />}
        {currentView === 'daily-sales' && <DailySalesReportScreen />}
        {/* Add other screens here as you refactor them */}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div>
          Copyright, all rights reserved by{' '}
          {myGithub}
        </div>
        <div>
          <span>App Code: FHD-1998</span>
          <span style={{marginLeft: '20px'}}>Help Line 
          {myPhone}
          </span>
        </div>
        <div>Build your software with us!</div>
      </footer>
    </div>
  );
}

export default App;
