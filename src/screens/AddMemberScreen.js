import React, { useEffect, useState, useRef } from 'react';
import { FaTimes, FaUpload, FaCamera, FaEdit, FaTrash } from 'react-icons/fa';
import '../App.css';

const AddMemberScreen = () => {
  const [form, setForm] = useState({
    id: null,
    accountOpenDate: '2024-11-23',
    fullName: '',
    height: '',
    weight: '',
    relativeType: 'S/O',
    relativeName: '',
    gender: 'Select',
    contact: '',
    address: '',
    status: 'Active',
    dayTiming: 'Select',
    time: 'None',
    photo: '',
  });

  const [members, setMembers] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [packages, setPackages] = useState([]);

  const refreshMembers = async () => {
    try {
      const members = await window.electronAPI?.getMembers();
      setMembers(members || []);
      console.log('Members fetched:', members);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Failed to fetch members');
    }
  };

  useEffect(() => {
    refreshMembers();
  }, []);

  const refreshPackages = async () => {
    try {
      const packages = await window.electronAPI?.getPackages();
      setPackages(packages || []);
      console.log('Package fetched:', packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
      alert('Failed to fetch packages');
    }
  };

  useEffect(() => {
    refreshPackages();
  }, []);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Camera started');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera. Ensure permissions are granted.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas not available');
      return;
    }
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 200, 200);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    setForm({ ...form, photo: dataUrl.split(',')[1] });
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      console.log('Photo captured');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, photo: reader.result.split(',')[1] });
        console.log('Image uploaded');
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a JPEG or PNG image.');
    }
  };

  const addMember = async () => {
    if (!form.fullName.trim()) return alert('Name required');
    try {
      if (form.id) {
        await window.electronAPI.updateMember(form);
      } else {
        await window.electronAPI.addMember(form);
      }
      resetForm();
      refreshMembers();
      console.log('Member saved');
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Failed to save member');
    }
  };

  const editMember = (member) => {
    setForm(member);
    console.log('Editing member:', member);
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await window.electronAPI.deleteMember(id);
      refreshMembers();
      resetForm();
      console.log('Member deleted');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      accountOpenDate: '2024-11-23',
      fullName: '',
      height: '',
      weight: '',
      relativeType: 'S/O',
      relativeName: '',
      gender: 'Select',
      contact: '',
      address: '',
      status: 'Active',
      dayTiming: 'Select',
      time: 'None',
      photo: '',
    });
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      console.log('Form reset');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    const total = parseInt(form.admissionFee || 0) + parseInt(form.monthlyFee || 0) + parseInt(form.trainerFee || 0);
    setForm((prev) => ({
      ...prev,
      totalAmount: total,
      balance: total, // Adjust balance logic as needed
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTotal();
    // Add member logic here
    console.log(form);
  };

  return (
    <div className="member-registration">
      <div className="registration-header">
        <div className="user-section">
          <span className="user-label">User:</span>
          <input type="text" className="user-input" />
        </div>
        <h2 className="page-title">New Member Registration</h2>
        <button className="search-btn">Search</button>
      </div>

      <div className="registration-content" style={{ display: 'flex', gap: 16 }}>
        <div
          style={{
            width: 280,
            borderRight: '1px solid #ccc',
            paddingRight: 12,
            maxHeight: 'calc(100vh - 160px)',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Members</h3>
          {members.length === 0 && <p style={{ color: '#666' }}>No members yet</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {members.map((m) => (
              <>
                <li
                  key={m.id}
                  style={{
                    padding: 6,
                    borderBottom: '1px solid #eee',
                    fontSize: 13,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {
                  // m.photo && 
                  <span style={{
                    backgroundColor: "orange",
                    width: "50px",
                    borderRadius: "100px"
                  }}>
                    {/* <img src={m.photo} alt={m.name}/> */}
                    <img
                      src={`data:image/jpeg;base64,${m.photo}`}
                      alt="Member"
                      // style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </span>}
                  <div>
                    <strong>{m.fullName}</strong>
                    <br />
                    {m.contact}
                  </div>
                  <div>
                    <button
                      onClick={() => editMember(m)}
                      style={{ marginRight: 8 }}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button onClick={() => deleteMember(m.id)} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </div>

        <div className="left-panel" style={{ flex: 1, display: 'flex', gap: 16 }}>
          <div className="photo-section" style={{ width: 200, flexShrink: 0 }}>
            <div className="photo-container">
              <div className="photo-placeholder">
                {form.photo && (
                  <img
                    src={`data:image/jpeg;base64,${form.photo}`}
                    alt="Member"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {!form.photo && (
                  <video
                    ref={videoRef}
                    style={{ width: '100%', height: '100%', display: form.photo ? 'none' : 'block' }}
                    autoPlay
                  />
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} width="200" height="200" />
              </div>
              <div className="photo-controls">
                <button className="control-btn cancel" onClick={resetForm}>
                  <FaTimes style={{ marginRight: 6 }} /> Cancel
                </button>
                <label className="control-btn upload">
                  <FaUpload style={{ marginRight: 6 }} /> Upload
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  className="control-btn webcam"
                  onClick={() => { startCamera(); setForm({ ...form, photo: '' }); }}
                >
                  <FaCamera style={{ marginRight: 6 }} /> Capture Webcam
                </button>
                {videoRef.current?.srcObject && (
                  <button
                    className="control-btn webcam"
                    onClick={capturePhoto}
                    style={{ marginLeft: 8 }}
                  >
                    Take Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>Account Open Date</label>
              <div className="date-input">
                <input
                  type="date"
                  name="accountOpenDate"
                  value={form.accountOpenDate}
                  onChange={handle}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handle}
                />
              </div>
              <div className="form-group">
                <label>Height</label>
                <input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handle}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Weight</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handle}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Relative</label>
              <div className="relative-row">
                <select
                  name="relativeType"
                  value={form.relativeType}
                  onChange={handle}
                  className="relative-select"
                >
                  <option>S/O</option>
                  <option>D/O</option>
                  <option>W/O</option>
                </select>
                <input
                  type="text"
                  name="relativeName"
                  value={form.relativeName}
                  onChange={handle}
                  className="relative-name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handle}>
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contact #</label>
                <div className="contact-row">
                  <span className="country-code">+92</span>
                  <input
                    type="tel"
                    name="contact"
                    value={form.contact}
                    onChange={handle}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handle}
              />
            </div>

            <div className="form-group">
              <label>Member Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Day Timing</label>
                <select
                  name="dayTiming"
                  value={form.dayTiming}
                  onChange={handle}
                >
                  <option>Select</option>
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>All Day</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time</label>
                <select name="time" value={form.time} onChange={handle}>
                  <option>None</option>
                  <option>6:00 AM - 10:00 AM</option>
                  <option>5:00 PM - 9:00 PM</option>
                </select>
                <button className="add-time-btn">+</button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="nav-btn" onClick={addMember}>
                {form.id ? 'Update' : 'Add'}
              </button>
              {form.id && (
                <button
                  className="nav-btn"
                  onClick={resetForm}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* <div style={{ flex: 1 }}>
          <div className="form-group">
              <div className="relative-row">
              <label>Packages</label>
                <select
                  name="relativeType"
                  value={form.relativeType}
                  onChange={handle}
                  className="relative-select"
                >
                  <option>DEFAULT PACKAGE</option>
                  <option>PACKAGE Premium</option>
                  <option>PACKAGE Normal</option>
                  <option>PACKAGE Cheap</option>
                </select>
              </div>
              <div className="relative-row" style={{
                width: "100%"
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "100%"
                }}>
                <label>Trainer/Helper</label>
                <select
                    name="relativeType"
                    value={form.relativeType}
                    onChange={handle}
                    className="relative-select"
                  >
                    <option>DEFAULT PACKAGE</option>
                    <option>PACKAGE Premium</option>
                    <option>PACKAGE Normal</option>
                    <option>PACKAGE Cheap</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Packages Expiry Date</label>
              <div className="date-input">
                <input
                  type="date"
                  name="accountOpenDate"
                  value={form.accountOpenDate}
                  onChange={handle}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handle}
                />
              </div>
              <div className="form-group">
                <label>Height</label>
                <input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handle}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Weight</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handle}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Relative</label>
              <div className="relative-row">
                <select
                  name="relativeType"
                  value={form.relativeType}
                  onChange={handle}
                  className="relative-select"
                >
                  <option>S/O</option>
                  <option>D/O</option>
                  <option>W/O</option>
                </select>
                <input
                  type="text"
                  name="relativeName"
                  value={form.relativeName}
                  onChange={handle}
                  className="relative-name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handle}>
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contact #</label>
                <div className="contact-row">
                  <span className="country-code">+92</span>
                  <input
                    type="tel"
                    name="contact"
                    value={form.contact}
                    onChange={handle}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handle}
              />
            </div>

            <div className="form-group">
              <label>Member Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Day Timing</label>
                <select
                  name="dayTiming"
                  value={form.dayTiming}
                  onChange={handle}
                >
                  <option>Select</option>
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>All Day</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time</label>
                <select name="time" value={form.time} onChange={handle}>
                  <option>None</option>
                  <option>6:00 AM - 10:00 AM</option>
                  <option>5:00 PM - 9:00 PM</option>
                </select>
                <button className="add-time-btn">+</button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="nav-btn" onClick={addMember}>
                {form.id ? 'Update' : 'Add'}
              </button>
              {form.id && (
                <button
                  className="nav-btn"
                  onClick={resetForm}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div> */}
    <div style={{ flex: 1 }}>

    <div className="form-group">
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <label>Packages</label>
          <span style={{ display: 'flex', marginRight: '10px' }}>
            <input type="radio" name="genderFilter" value="All" style={{ marginLeft: '10px', marginRight: '10px' }} defaultChecked /> <p>All</p>
            <input type="radio" name="genderFilter" value="Male" style={{ marginLeft: '10px', marginRight: '10px' }} /> <p>Male</p>
            <input type="radio" name="genderFilter" value="Female" style={{ marginLeft: '10px' , marginRight: '10px'}} /> <p>Female</p>
          </span>
      </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            name="relativeType"
            value={form.relativeType}
            onChange={handleChange}
            className="relative-select"
            style={{ flex: 1 }}
          >
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.name}>
                {/* {pkg.name} */}
                {pkg.packageName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
          <label>Packages Expiry Date</label>
          <input
            type="date"
            name="accountOpenDate"
            value={form.accountOpenDate}
            onChange={handleChange}
          />
        </div>

      {/* Other form fields remain similar, add as needed */}

      <div className="form-row">
        <div className="form-group">
          <label>Admission Fee</label>
          <input
            type="number"
            name="admissionFee"
            value={form.admissionFee}
            onChange={handleChange}
            style={{ backgroundColor: '#fff9c4' }}
          />
        </div>
        <div className="form-group">
          <label>Monthly Fee</label>
          <input
            type="number"
            name="monthlyFee"
            value={form.monthlyFee}
            onChange={handleChange}
            style={{ backgroundColor: '#fff9c4' }}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Trainer Fee</label>
          <input
            type="number"
            name="trainerFee"
            value={form.trainerFee}
            onChange={handleChange}
            style={{ backgroundColor: '#fff9c4' }}
          />
        </div>
        <div className="form-group">
          <label>Trainer Commission</label>
          <input
            type="number"
            name="trainerCommission"
            value={form.trainerCommission}
            onChange={handleChange}
            style={{ backgroundColor: '#fff9c4' }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Gym Commission</label>
        <input
          type="number"
          name="gymCommission"
          value={form.gymCommission}
          onChange={handleChange}
          style={{ backgroundColor: '#fff9c4' }}
        />
      </div>

      <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>
        Total Amount: {form.totalAmount}
      </div>

      <div className="form-group">
        <label>Select Account</label>
        <select
          name="selectAccount"
          value={form.selectAccount}
          onChange={handleChange}
          style={{ backgroundColor: '#e6ffe6' }}
        >
          <option value="">Select</option>
          {/* Fetch accounts from DB if needed */}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Cheque No</label>
          <input
            type="text"
            name="chequeNo"
            value={form.chequeNo}
            onChange={handleChange}
            style={{ backgroundColor: '#fff9c4' }}
          />
        </div>
        <div className="form-group">
          <label>Payment</label>
          <input
            type="text"
            name="payment"
            value={form.payment}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Balance: {form.balance}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button className="nav-btn" onClick={handleSubmit}>
          Add
        </button>
      </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default AddMemberScreen;