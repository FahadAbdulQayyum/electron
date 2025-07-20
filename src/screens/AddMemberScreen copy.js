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
        </div>
      </div>
    </div>
  );
};

export default AddMemberScreen;










// import React, { useEffect, useState, useRef } from 'react';
// import { FaTimes, FaUpload, FaCamera } from 'react-icons/fa';
// import '../App.css';

// const AddMemberScreen = () => {
//   const [form, setForm] = useState({
//     accountOpenDate: '23-Nov-2024',
//     fullName: '',
//     height: '',
//     weight: '',
//     relativeType: 'S/O',
//     relativeName: '',
//     gender: 'Select',
//     contact: '',
//     address: '',
//     status: 'Active',
//     dayTiming: 'Select',
//     time: 'None',
//     package: 'DEFAULT PACKAGE',
//     packageExpiryDate: '23-Dec-2024',
//     admissionFee: '0',
//     monthlyFee: '2500',
//     trainerFee: '0',
//     trainerCommission: '0',
//     gymCommission: '0',
//     totalAmount: '2500',
//     account: 'Select',
//     payment: '',
//     balance: '0',
//     photo: '',
//   });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//     }
//   };

//   const capturePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) return;
//     const context = canvasRef.current.getContext('2d');
//     context.drawImage(videoRef.current, 0, 0, 200, 200);
//     const dataUrl = canvasRef.current.toDataURL('image/jpeg');
//     setForm({ ...form, photo: dataUrl.split(',')[1] });
//     videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
//       const reader = new FileReader();
//       reader.onloadend = () => setForm({ ...form, photo: reader.result.split(',')[1] });
//       reader.readAsDataURL(file);
//     }
//   };

//   const saveMember = () => {
//     console.log('Member saved:', form);
//     // Add save logic here
//   };

//   return (
//     <div className="member-registration">
//       <div className="registration-header">
//         <div className="user-section">
//           <span className="user-label">User:</span>
//           <input type="text" className="user-input" />
//         </div>
//         <h2>New Member Registration</h2>
//         <button className="search-btn">Search</button>
//       </div>

//       <div className="registration-content">
//         <div className="photo-section">
//           <div className="photo-container">
//             <div className="photo-placeholder">
//               {form.photo ? (
//                 <img src={`data:image/jpeg;base64,${form.photo}`} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               ) : (
//                 <video ref={videoRef} style={{ width: '100%', height: '100%', display: form.photo ? 'none' : 'block' }} autoPlay />
//               )}
//               <canvas ref={canvasRef} style={{ display: 'none' }} width="200" height="200" />
//             </div>
//             <div className="photo-controls">
//               <button className="control-btn cancel" onClick={() => setForm({ ...form, photo: '' })}>
//                 <FaTimes /> Cancel
//               </button>
//               <label className="control-btn upload">
//                 <FaUpload /> Upload
//                 <input type="file" accept="image/jpeg,image/png" onChange={handleFileUpload} style={{ display: 'none' }} />
//               </label>
//               <button className="control-btn webcam" onClick={startCamera}>
//                 <FaCamera /> Capture Webcam
//               </button>
//               {videoRef.current?.srcObject && (
//                 <button className="control-btn webcam" onClick={capturePhoto}>
//                   Take Photo
//                 </button>
//               )}
//             </div>
//           </div>
//           <img src="https://via.placeholder.com/200x300?text=ZKTeco+Device" alt="Biometric Device" className="biometric-device" />
//           <div className="hand-diagram">
//             <img src="https://via.placeholder.com/100x100?text=Hand+Diagram" alt="Hand Diagram" />
//             {/* Add numbered points manually or via CSS */}
//           </div>
//         </div>

//         <div className="form-section">
//           <div className="form-group">
//             <label>Packages</label>
//             <select name="package" value={form.package} onChange={handleChange}>
//               <option>DEFAULT PACKAGE</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Packages Expiry Date</label>
//             <input type="date" name="packageExpiryDate" value={form.packageExpiryDate} onChange={handleChange} />
//           </div>
//           <div className="form-group">
//             <label>Trainer/Helper</label>
//             <select name="trainer" value="" onChange={handleChange}>
//               <option>Select</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Admission Fee</label>
//             <input type="number" name="admissionFee" value={form.admissionFee} onChange={handleChange} style={{ backgroundColor: '#fff3cd' }} />
//           </div>
//           <div className="form-group">
//             <label>Monthly Fee</label>
//             <input type="number" name="monthlyFee" value={form.monthlyFee} onChange={handleChange} style={{ backgroundColor: '#fff3cd' }} />
//           </div>
//           <div className="form-group">
//             <label>Trainer Fee</label>
//             <input type="number" name="trainerFee" value={form.trainerFee} onChange={handleChange} style={{ backgroundColor: '#fff3cd' }} />
//           </div>
//           <div className="form-group">
//             <label>Trainer Commission</label>
//             <input type="number" name="trainerCommission" value={form.trainerCommission} onChange={handleChange} style={{ backgroundColor: '#fff3cd' }} />
//           </div>
//           <div className="form-group">
//             <label>Gym Commission</label>
//             <input type="number" name="gymCommission" value={form.gymCommission} onChange={handleChange} style={{ backgroundColor: '#fff3cd' }} />
//           </div>
//           <div className="form-group">
//             <label>Total Amount:</label>
//             <input type="number" name="totalAmount" value={form.totalAmount} onChange={handleChange} style={{ backgroundColor: '#fff3cd' }} />
//           </div>
//           <div className="form-group">
//             <label>Select Account</label>
//             <select name="account" value={form.account} onChange={handleChange} style={{ backgroundColor: '#d4edda' }}>
//               <option>Select</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Cheque No</label>
//             <input type="text" name="payment" value={form.payment} onChange={handleChange} style={{ backgroundColor: '#fff3cd' }} />
//           </div>
//           <div className="form-group">
//             <label>Payment</label>
//             <input type="text" name="payment" value={form.payment} onChange={handleChange} />
//           </div>
//           <div className="form-group">
//             <label>Balance:</label>
//             <input type="number" name="balance" value={form.balance} onChange={handleChange} style={{ color: 'red' }} />
//           </div>
//           <button className="save-btn" onClick={saveMember}>Save New Member</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMemberScreen;










// // import React, { useEffect, useState, useRef } from 'react';
// // import { FaTimes, FaUpload, FaCamera, FaEdit, FaTrash } from 'react-icons/fa';
// // import '../App.css';

// // const AddMemberScreen = () => {
// //   const [form, setForm] = useState({
// //     id: null,
// //     accountOpenDate: '2024-11-23',
// //     fullName: '',
// //     height: '',
// //     weight: '',
// //     relativeType: 'S/O',
// //     relativeName: '',
// //     gender: 'Select',
// //     contact: '',
// //     address: '',
// //     status: 'Active',
// //     dayTiming: 'Select',
// //     time: 'None',
// //     photo: '',
// //   });

// //   const [members, setMembers] = useState([]);
// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);

// //   const refreshMembers = async () => {
// //     try {
// //       const members = await window.electronAPI?.getMembers();
// //       setMembers(members || []);
// //       console.log('Members fetched:', members);
// //     } catch (error) {
// //       console.error('Error fetching members:', error);
// //       alert('Failed to fetch members');
// //     }
// //   };

// //   useEffect(() => {
// //     refreshMembers();
// //   }, []);

// //   const handle = (e) =>
// //     setForm({ ...form, [e.target.name]: e.target.value });

// //   const startCamera = async () => {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// //       if (videoRef.current) {
// //         videoRef.current.srcObject = stream;
// //         console.log('Camera started');
// //       }
// //     } catch (error) {
// //       console.error('Error accessing camera:', error);
// //       alert('Failed to access camera. Ensure permissions are granted.');
// //     }
// //   };

// //   const capturePhoto = () => {
// //     if (!videoRef.current || !canvasRef.current) {
// //       console.error('Video or canvas not available');
// //       return;
// //     }
// //     const context = canvasRef.current.getContext('2d');
// //     context.drawImage(videoRef.current, 0, 0, 200, 200);
// //     const dataUrl = canvasRef.current.toDataURL('image/jpeg');
// //     setForm({ ...form, photo: dataUrl.split(',')[1] });
// //     if (videoRef.current.srcObject) {
// //       videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
// //       console.log('Photo captured');
// //     }
// //   };

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setForm({ ...form, photo: reader.result.split(',')[1] });
// //         console.log('Image uploaded');
// //       };
// //       reader.readAsDataURL(file);
// //     } else {
// //       alert('Please upload a JPEG or PNG image.');
// //     }
// //   };

// //   const addMember = async () => {
// //     if (!form.fullName.trim()) return alert('Name required');
// //     try {
// //       if (form.id) {
// //         await window.electronAPI.updateMember(form);
// //       } else {
// //         await window.electronAPI.addMember(form);
// //       }
// //       resetForm();
// //       refreshMembers();
// //       console.log('Member saved');
// //     } catch (error) {
// //       console.error('Error saving member:', error);
// //       alert('Failed to save member');
// //     }
// //   };

// //   const editMember = (member) => {
// //     setForm(member);
// //     console.log('Editing member:', member);
// //   };

// //   const deleteMember = async (id) => {
// //     if (!window.confirm('Are you sure you want to delete this member?')) return;
// //     try {
// //       await window.electronAPI.deleteMember(id);
// //       refreshMembers();
// //       resetForm();
// //       console.log('Member deleted');
// //     } catch (error) {
// //       console.error('Error deleting member:', error);
// //       alert('Failed to delete member');
// //     }
// //   };

// //   const resetForm = () => {
// //     setForm({
// //       id: null,
// //       accountOpenDate: '2024-11-23',
// //       fullName: '',
// //       height: '',
// //       weight: '',
// //       relativeType: 'S/O',
// //       relativeName: '',
// //       gender: 'Select',
// //       contact: '',
// //       address: '',
// //       status: 'Active',
// //       dayTiming: 'Select',
// //       time: 'None',
// //       photo: '',
// //     });
// //     if (videoRef.current?.srcObject) {
// //       videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
// //       console.log('Form reset');
// //     }
// //   };

// //   return (
// //     <div className="member-registration">
// //       <div className="registration-header">
// //         <div className="user-section">
// //           <span className="user-label">User:</span>
// //           <input type="text" className="user-input" />
// //         </div>
// //         <h2 className="page-title">New Member Registration</h2>
// //         <button className="search-btn">Search</button>
// //       </div>

// //       <div className="registration-content" style={{ display: 'flex', gap: 16 }}>
// //         <div
// //           style={{
// //             width: 280,
// //             borderRight: '1px solid #ccc',
// //             paddingRight: 12,
// //             maxHeight: 'calc(100vh - 160px)',
// //             overflowY: 'auto',
// //           }}
// //         >
// //           <h3 style={{ marginTop: 0 }}>Members</h3>
// //           {members.length === 0 && <p style={{ color: '#666' }}>No members yet</p>}
// //           <ul style={{ listStyle: 'none', padding: 0 }}>
// //             {members.map((m) => (
// //               <li
// //                 key={m.id}
// //                 style={{
// //                   padding: 6,
// //                   borderBottom: '1px solid #eee',
// //                   fontSize: 13,
// //                   display: 'flex',
// //                   justifyContent: 'space-between',
// //                   alignItems: 'center',
// //                 }}
// //               >
// //                 <div>
// //                   <strong>{m.fullName}</strong>
// //                   <br />
// //                   {m.contact}
// //                 </div>
// //                 <div>
// //                   <button
// //                     onClick={() => editMember(m)}
// //                     style={{ marginRight: 8 }}
// //                     title="Edit"
// //                   >
// //                     <FaEdit />
// //                   </button>
// //                   <button onClick={() => deleteMember(m.id)} title="Delete">
// //                     <FaTrash />
// //                   </button>
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>

// //         <div className="left-panel" style={{ flex: 1 }}>
// //           <div className="photo-section">
// //             <div className="photo-container">
// //               <div className="photo-placeholder">
// //                 {form.photo && (
// //                   <img
// //                     src={`data:image/jpeg;base64,${form.photo}`}
// //                     alt="Member"
// //                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// //                   />
// //                 )}
// //                 {!form.photo && (
// //                   <video
// //                     ref={videoRef}
// //                     style={{ width: '100%', height: '100%', display: form.photo ? 'none' : 'block' }}
// //                     autoPlay
// //                   />
// //                 )}
// //                 <canvas ref={canvasRef} style={{ display: 'none' }} width="200" height="200" />
// //               </div>
// //               <div className="photo-controls">
// //                 <button className="control-btn cancel" onClick={resetForm}>
// //                   <FaTimes style={{ marginRight: 6 }} /> Cancel
// //                 </button>
// //                 <label className="control-btn upload">
// //                   <FaUpload style={{ marginRight: 6 }} /> Upload
// //                   <input
// //                     type="file"
// //                     accept="image/jpeg,image/png"
// //                     onChange={handleFileUpload}
// //                     style={{ display: 'none' }}
// //                   />
// //                 </label>
// //                 <button
// //                   className="control-btn webcam"
// //                   onClick={() => { startCamera(); setForm({ ...form, photo: '' }); }}
// //                 >
// //                   <FaCamera style={{ marginRight: 6 }} /> Capture Webcam
// //                 </button>
// //                 {videoRef.current?.srcObject && (
// //                   <button
// //                     className="control-btn webcam"
// //                     onClick={capturePhoto}
// //                     style={{ marginLeft: 8 }}
// //                   >
// //                     Take Photo
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="form-group">
// //             <label>Account Open Date</label>
// //             <div className="date-input">
// //               <input
// //                 type="date"
// //                 name="accountOpenDate"
// //                 value={form.accountOpenDate}
// //                 onChange={handle}
// //               />
// //             </div>
// //           </div>

// //           <div className="form-row">
// //             <div className="form-group">
// //               <label>Full Name</label>
// //               <input
// //                 type="text"
// //                 name="fullName"
// //                 value={form.fullName}
// //                 onChange={handle}
// //               />
// //             </div>
// //             <div className="form-group">
// //               <label>Height</label>
// //               <input
// //                 type="number"
// //                 name="height"
// //                 value={form.height}
// //                 onChange={handle}
// //                 placeholder="0"
// //               />
// //             </div>
// //             <div className="form-group">
// //               <label>Weight</label>
// //               <input
// //                 type="number"
// //                 name="weight"
// //                 value={form.weight}
// //                 onChange={handle}
// //                 placeholder="0"
// //               />
// //             </div>
// //           </div>

// //           <div className="form-group">
// //             <label>Relative</label>
// //             <div className="relative-row">
// //               <select
// //                 name="relativeType"
// //                 value={form.relativeType}
// //                 onChange={handle}
// //                 className="relative-select"
// //               >
// //                 <option>S/O</option>
// //                 <option>D/O</option>
// //                 <option>W/O</option>
// //               </select>
// //               <input
// //                 type="text"
// //                 name="relativeName"
// //                 value={form.relativeName}
// //                 onChange={handle}
// //                 className="relative-name"
// //               />
// //             </div>
// //           </div>

// //           <div className="form-row">
// //             <div className="form-group">
// //               <label>Gender</label>
// //               <select name="gender" value={form.gender} onChange={handle}>
// //                 <option>Select</option>
// //                 <option>Male</option>
// //                 <option>Female</option>
// //               </select>
// //             </div>
// //             <div className="form-group">
// //               <label>Contact #</label>
// //               <div className="contact-row">
// //                 <span className="country-code">+92</span>
// //                 <input
// //                   type="tel"
// //                   name="contact"
// //                   value={form.contact}
// //                   onChange={handle}
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="form-group">
// //             <label>Address</label>
// //             <input
// //               type="text"
// //               name="address"
// //               value={form.address}
// //               onChange={handle}
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label>Member Status</label>
// //             <select name="status" value={form.status} onChange={handle}>
// //               <option>Active</option>
// //               <option>Inactive</option>
// //               <option>Suspended</option>
// //             </select>
// //           </div>

// //           <div className="form-row">
// //             <div className="form-group">
// //               <label>Day Timing</label>
// //               <select
// //                 name="dayTiming"
// //                 value={form.dayTiming}
// //                 onChange={handle}
// //               >
// //                 <option>Select</option>
// //                 <option>Morning</option>
// //                 <option>Evening</option>
// //                 <option>All Day</option>
// //               </select>
// //             </div>
// //             <div className="form-group">
// //               <label>Time</label>
// //               <select name="time" value={form.time} onChange={handle}>
// //                 <option>None</option>
// //                 <option>6:00 AM - 10:00 AM</option>
// //                 <option>5:00 PM - 9:00 PM</option>
// //               </select>
// //               <button className="add-time-btn">+</button>
// //             </div>
// //           </div>

// //           <div style={{ textAlign: 'center', marginTop: 32 }}>
// //             <button className="nav-btn" onClick={addMember}>
// //               {form.id ? 'Update' : 'Add'}
// //             </button>
// //             {form.id && (
// //               <button
// //                 className="nav-btn"
// //                 onClick={resetForm}
// //                 style={{ marginLeft: 8 }}
// //               >
// //                 Cancel
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddMemberScreen;









// // // import React, { useEffect, useState, useRef } from 'react';
// // // import { FaTimes, FaUpload, FaCamera, FaEdit, FaTrash } from 'react-icons/fa';
// // // import '../App.css';

// // // const AddMemberScreen = () => {
// // //   const [form, setForm] = useState({
// // //     id: null,
// // //     accountOpenDate: '2024-11-23',
// // //     fullName: '',
// // //     height: '',
// // //     weight: '',
// // //     relativeType: 'S/O',
// // //     relativeName: '',
// // //     gender: 'Select',
// // //     contact: '',
// // //     address: '',
// // //     status: 'Active',
// // //     dayTiming: 'Select',
// // //     time: 'None',
// // //     photo: '',
// // //   });

// // //   const [members, setMembers] = useState([]);
// // //   const videoRef = useRef(null);
// // //   const canvasRef = useRef(null);

// // //   const refreshMembers = async () => {
// // //     try {
// // //       const members = await window.electronAPI?.getMembers();
// // //       setMembers(members || []);
// // //     } catch (error) {
// // //       console.error('Error fetching members:', error);
// // //       alert('Failed to fetch members');
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     refreshMembers();
// // //   }, []);

// // //   const handle = (e) =>
// // //     setForm({ ...form, [e.target.name]: e.target.value });

// // //   const startCamera = async () => {
// // //     try {
// // //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// // //       if (videoRef.current) videoRef.current.srcObject = stream;
// // //     } catch (error) {
// // //       console.error('Error accessing camera:', error);
// // //       alert('Failed to access camera. Ensure permissions are granted.');
// // //     }
// // //   };

// // //   const capturePhoto = () => {
// // //     if (!videoRef.current || !canvasRef.current) return;
// // //     const context = canvasRef.current.getContext('2d');
// // //     context.drawImage(videoRef.current, 0, 0, 200, 200);
// // //     const dataUrl = canvasRef.current.toDataURL('image/jpeg');
// // //     setForm({ ...form, photo: dataUrl.split(',')[1] }); // Store base64 data
// // //     if (videoRef.current.srcObject) {
// // //       videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
// // //     }
// // //   };

// // //   const handleFileUpload = (e) => {
// // //     const file = e.target.files[0];
// // //     if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
// // //       const reader = new FileReader();
// // //       reader.onloadend = () => {
// // //         setForm({ ...form, photo: reader.result.split(',')[1] });
// // //       };
// // //       reader.readAsDataURL(file);
// // //     } else {
// // //       alert('Please upload a JPEG or PNG image.');
// // //     }
// // //   };

// // //   const addMember = async () => {
// // //     if (!form.fullName.trim()) return alert('Name required');
// // //     try {
// // //       if (form.id) {
// // //         await window.electronAPI.updateMember(form);
// // //       } else {
// // //         await window.electronAPI.addMember(form);
// // //       }
// // //       resetForm();
// // //       refreshMembers();
// // //     } catch (error) {
// // //       console.error('Error saving member:', error);
// // //       alert('Failed to save member');
// // //     }
// // //   };

// // //   const editMember = (member) => {
// // //     setForm(member);
// // //   };

// // //   const deleteMember = async (id) => {
// // //     if (!window.confirm('Are you sure you want to delete this member?')) return;
// // //     try {
// // //       await window.electronAPI.deleteMember(id);
// // //       refreshMembers();
// // //       resetForm();
// // //     } catch (error) {
// // //       console.error('Error deleting member:', error);
// // //       alert('Failed to delete member');
// // //     }
// // //   };

// // //   const resetForm = () => {
// // //     setForm({
// // //       id: null,
// // //       accountOpenDate: '2024-11-23',
// // //       fullName: '',
// // //       height: '',
// // //       weight: '',
// // //       relativeType: 'S/O',
// // //       relativeName: '',
// // //       gender: 'Select',
// // //       contact: '',
// // //       address: '',
// // //       status: 'Active',
// // //       dayTiming: 'Select',
// // //       time: 'None',
// // //       photo: '',
// // //     });
// // //     if (videoRef.current?.srcObject) {
// // //       videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
// // //     }
// // //   };

// // //   return (
// // //     <div className="member-registration">
// // //       <div className="registration-header">
// // //         <div className="user-section">
// // //           <span className="user-label">User:</span>
// // //           <input type="text" className="user-input" />
// // //         </div>
// // //         <h2 className="page-title">New Member Registration</h2>
// // //         <button className="search-btn">Search</button>
// // //       </div>

// // //       <div className="registration-content" style={{ display: 'flex', gap: 16 }}>
// // //         <div
// // //           style={{
// // //             width: 280,
// // //             borderRight: '1px solid #ccc',
// // //             paddingRight: 12,
// // //             maxHeight: 'calc(100vh - 160px)',
// // //             overflowY: 'auto',
// // //           }}
// // //         >
// // //           <h3 style={{ marginTop: 0 }}>Members</h3>
// // //           {members.length === 0 && <p style={{ color: '#666' }}>No members yet</p>}
// // //           <ul style={{ listStyle: 'none', padding: 0 }}>
// // //             {members.map((m) => (
// // //               <li
// // //                 key={m.id}
// // //                 style={{
// // //                   padding: 6,
// // //                   borderBottom: '1px solid #eee',
// // //                   fontSize: 13,
// // //                   display: 'flex',
// // //                   justifyContent: 'space-between',
// // //                   alignItems: 'center',
// // //                 }}
// // //               >
// // //                 <div>
// // //                   <strong>{m.fullName}</strong>
// // //                   <br />
// // //                   {m.contact}
// // //                 </div>
// // //                 <div>
// // //                   <button
// // //                     onClick={() => editMember(m)}
// // //                     style={{ marginRight: 8 }}
// // //                     title="Edit"
// // //                   >
// // //                     <FaEdit />
// // //                   </button>
// // //                   <button onClick={() => deleteMember(m.id)} title="Delete">
// // //                     <FaTrash />
// // //                   </button>
// // //                 </div>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         </div>

// // //         <div className="left-panel" style={{ flex: 1 }}>
// // //           <div className="photo-section">
// // //             <div className="photo-container">
// // //               <div className="photo-placeholder">
// // //                 {form.photo && (
// // //                   <img
// // //                     src={`data:image/jpeg;base64,${form.photo}`}
// // //                     alt="Member"
// // //                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// // //                   />
// // //                 )}
// // //                 {!form.photo && (
// // //                   <video ref={videoRef} style={{ width: '100%', height: '100%', display: form.photo ? 'none' : 'block' }} autoPlay />
// // //                 )}
// // //                 <canvas ref={canvasRef} style={{ display: 'none' }} width="200" height="200" />
// // //               </div>
// // //               <div className="photo-controls">
// // //                 <button className="control-btn cancel" onClick={resetForm}>
// // //                   <FaTimes style={{ marginRight: 6 }} /> Cancel
// // //                 </button>
// // //                 <label className="control-btn upload">
// // //                   <FaUpload style={{ marginRight: 6 }} /> Upload
// // //                   <input
// // //                     type="file"
// // //                     accept="image/jpeg,image/png"
// // //                     onChange={handleFileUpload}
// // //                     style={{ display: 'none' }}
// // //                   />
// // //                 </label>
// // //                 <button className="control-btn webcam" onClick={() => { startCamera(); setForm({ ...form, photo: '' }); }}>
// // //                   <FaCamera style={{ marginRight: 6 }} /> Capture Webcam
// // //                 </button>
// // //                 {videoRef.current?.srcObject && (
// // //                   <button className="control-btn webcam" onClick={capturePhoto} style={{ marginLeft: 8 }}>
// // //                     Take Photo
// // //                   </button>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="form-group">
// // //             <label>Account Open Date</label>
// // //             <div className="date-input">
// // //               <input
// // //                 type="date"
// // //                 name="accountOpenDate"
// // //                 value={form.accountOpenDate}
// // //                 onChange={handle}
// // //               />
// // //             </div>
// // //           </div>

// // //           <div className="form-row">
// // //             <div className="form-group">
// // //               <label>Full Name</label>
// // //               <input
// // //                 type="text"
// // //                 name="fullName"
// // //                 value={form.fullName}
// // //                 onChange={handle}
// // //               />
// // //             </div>
// // //             <div className="form-group">
// // //               <label>Height</label>
// // //               <input
// // //                 type="number"
// // //                 name="height"
// // //                 value={form.height}
// // //                 onChange={handle}
// // //                 placeholder="0"
// // //               />
// // //             </div>
// // //             <div className="form-group">
// // //               <label>Weight</label>
// // //               <input
// // //                 type="number"
// // //                 name="weight"
// // //                 value={form.weight}
// // //                 onChange={handle}
// // //                 placeholder="0"
// // //               />
// // //             </div>
// // //           </div>

// // //           <div className="form-group">
// // //             <label>Relative</label>
// // //             <div className="relative-row">
// // //               <select
// // //                 name="relativeType"
// // //                 value={form.relativeType}
// // //                 onChange={handle}
// // //                 className="relative-select"
// // //               >
// // //                 <option>S/O</option>
// // //                 <option>D/O</option>
// // //                 <option>W/O</option>
// // //               </select>
// // //               <input
// // //                 type="text"
// // //                 name="relativeName"
// // //                 value={form.relativeName}
// // //                 onChange={handle}
// // //                 className="relative-name"
// // //               />
// // //             </div>
// // //           </div>

// // //           <div className="form-row">
// // //             <div className="form-group">
// // //               <label>Gender</label>
// // //               <select name="gender" value={form.gender} onChange={handle}>
// // //                 <option>Select</option>
// // //                 <option>Male</option>
// // //                 <option>Female</option>
// // //               </select>
// // //             </div>
// // //             <div className="form-group">
// // //               <label>Contact #</label>
// // //               <div className="contact-row">
// // //                 <span className="country-code">+92</span>
// // //                 <input
// // //                   type="tel"
// // //                   name="contact"
// // //                   value={form.contact}
// // //                   onChange={handle}
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="form-group">
// // //             <label>Address</label>
// // //             <input
// // //               type="text"
// // //               name="address"
// // //               value={form.address}
// // //               onChange={handle}
// // //             />
// // //           </div>

// // //           <div className="form-group">
// // //             <label>Member Status</label>
// // //             <select name="status" value={form.status} onChange={handle}>
// // //               <option>Active</option>
// // //               <option>Inactive</option>
// // //               <option>Suspended</option>
// // //             </select>
// // //           </div>

// // //           <div className="form-row">
// // //             <div className="form-group">
// // //               <label>Day Timing</label>
// // //               <select
// // //                 name="dayTiming"
// // //                 value={form.dayTiming}
// // //                 onChange={handle}
// // //               >
// // //                 <option>Select</option>
// // //                 <option>Morning</option>
// // //                 <option>Evening</option>
// // //                 <option>All Day</option>
// // //               </select>
// // //             </div>
// // //             <div className="form-group">
// // //               <label>Time</label>
// // //               <select name="time" value={form.time} onChange={handle}>
// // //                 <option>None</option>
// // //                 <option>6:00 AM - 10:00 AM</option>
// // //                 <option>5:00 PM - 9:00 PM</option>
// // //               </select>
// // //               <button className="add-time-btn">+</button>
// // //             </div>
// // //           </div>

// // //           <div style={{ textAlign: 'center', marginTop: 32 }}>
// // //             <button className="nav-btn" onClick={addMember}>
// // //               {form.id ? 'Update' : 'Add'}
// // //             </button>
// // //             {form.id && (
// // //               <button
// // //                 className="nav-btn"
// // //                 onClick={resetForm}
// // //                 style={{ marginLeft: 8 }}
// // //               >
// // //                 Cancel
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AddMemberScreen;










// // // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // // import '../App.css';

// // // // // // Placeholder for ZKTeco SDK (replace with actual SDK import)
// // // // // const zkLib = require('node-zklib'); // Example; adjust based on SDK

// // // // // const AddMemberScreen = () => {
// // // // //   const [form, setForm] = useState({
// // // // //     fullName: '',
// // // // //     contact: '',
// // // // //     gender: 'Male',
// // // // //     fingerprintTemplate: '',
// // // // //     status: 'Active',
// // // // //   });

// // // // //   const [deviceConnected, setDeviceConnected] = useState(false);

// // // // //   useEffect(() => {
// // // // //     // Initialize ZKTeco device
// // // // //     const zkInstance = new zkLib();
// // // // //     zkInstance.connect({ ip: '192.168.1.100', port: 4370 }) // Replace with your device IP and port
// // // // //       .then(() => {
// // // // //         console.log('Device connected');
// // // // //         setDeviceConnected(true);
// // // // //       })
// // // // //       .catch((error) => {
// // // // //         console.error('Failed to connect to device:', error);
// // // // //         alert('Failed to connect to ZKTeco device. Check IP and port.');
// // // // //       });

// // // // //     return () => {
// // // // //       if (zkInstance) zkInstance.disconnect();
// // // // //     };
// // // // //   }, []);

// // // // //   const handleInput = (e) => {
// // // // //     const { name, value } = e.target;
// // // // //     setForm((prev) => ({
// // // // //       ...prev,
// // // // //       [name]: value,
// // // // //     }));
// // // // //   };

// // // // //   const captureFingerprint = useCallback(async () => {
// // // // //     if (!deviceConnected) {
// // // // //       alert('Device not connected');
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       const zkInstance = new zkLib();
// // // // //       await zkInstance.connect({ ip: '192.168.1.100', port: 4370 });
// // // // //       const template = await zkInstance.getFingerprintTemplate(); // SDK-specific method
// // // // //       console.log('Captured fingerprint template:', template);
// // // // //       setForm((prev) => ({
// // // // //         ...prev,
// // // // //         fingerprintTemplate: template.toString('base64'),
// // // // //       }));
// // // // //       await zkInstance.disconnect();
// // // // //     } catch (error) {
// // // // //       console.error('Error capturing fingerprint:', error);
// // // // //       alert('Failed to capture fingerprint');
// // // // //     }
// // // // //   }, [deviceConnected]);

// // // // //   const addMember = async () => {
// // // // //     if (!form.fullName.trim()) {
// // // // //       alert('Full Name is required');
// // // // //       return;
// // // // //     }
// // // // //     if (!form.contact.trim()) {
// // // // //       alert('Contact is required');
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       console.log('Adding member:', form);
// // // // //       await window?.electronAPI?.addMember(form);
// // // // //       setForm({ fullName: '', contact: '', gender: 'Male', fingerprintTemplate: '', status: 'Active' });
// // // // //     } catch (error) {
// // // // //       console.error('Error adding member:', error);
// // // // //       alert('Failed to add member');
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="trainer-helper-section">
// // // // //       <div className="trainer-helper-left">
// // // // //         <h3>Add a Member</h3>
// // // // //         <div className="form-group">
// // // // //           <label>Full Name</label>
// // // // //           <input
// // // // //             type="text"
// // // // //             name="fullName"
// // // // //             value={form.fullName}
// // // // //             onChange={handleInput}
// // // // //           />
// // // // //         </div>
// // // // //         <div className="form-group">
// // // // //           <label>Contact</label>
// // // // //           <input
// // // // //             type="text"
// // // // //             name="contact"
// // // // //             value={form.contact}
// // // // //             onChange={handleInput}
// // // // //           />
// // // // //         </div>
// // // // //         <div className="form-group">
// // // // //           <label>Gender</label>
// // // // //           <select name="gender" value={form.gender} onChange={handleInput}>
// // // // //             <option>Male</option>
// // // // //             <option>Female</option>
// // // // //           </select>
// // // // //         </div>
// // // // //         <div className="form-group">
// // // // //           <label>Fingerprint</label>
// // // // //           <button className="btn-orange" onClick={captureFingerprint} disabled={!deviceConnected}>
// // // // //             Capture Fingerprint
// // // // //           </button>
// // // // //           <span style={{ marginLeft: 10 }}>
// // // // //             {form.fingerprintTemplate ? 'Captured' : 'Not captured'}
// // // // //           </span>
// // // // //         </div>
// // // // //         <div className="trainer-helper-actions">
// // // // //           <button className="btn-orange-outline" onClick={() => setForm({ fullName: '', contact: '', gender: 'Male', fingerprintTemplate: '', status: 'Active' })}>
// // // // //             Add New
// // // // //           </button>
// // // // //           <button className="btn-orange" onClick={addMember}>
// // // // //             Save
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className="trainer-helper-right">
// // // // //         <h3>Members Detail</h3>
// // // // //         <div className="trainer-helper-table-wrapper">
// // // // //           <table className="trainer-helper-table">
// // // // //             <thead>
// // // // //               <tr>
// // // // //                 <th>ID</th>
// // // // //                 <th>Full Name</th>
// // // // //                 <th>Contact</th>
// // // // //                 <th>Gender</th>
// // // // //                 <th>Fingerprint</th>
// // // // //                 <th>Status</th>
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody>
// // // // //               {/* Placeholder for dynamic data; add fetch logic if needed */}
// // // // //               <tr>
// // // // //                 <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
// // // // //                   No members to display.
// // // // //                 </td>
// // // // //               </tr>
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default AddMemberScreen;








// // // // import React, { useEffect, useState } from 'react';
// // // // import { FaTimes, FaUpload, FaCamera, FaEdit, FaTrash } from 'react-icons/fa';
// // // // import '../App.css';

// // // // const AddMemberScreen = () => {
// // // //   const [form, setForm] = useState({
// // // //     id: null,
// // // //     accountOpenDate: '2024-11-23',
// // // //     fullName: '',
// // // //     height: '',
// // // //     weight: '',
// // // //     relativeType: 'S/O',
// // // //     relativeName: '',
// // // //     gender: 'Select',
// // // //     contact: '',
// // // //     address: '',
// // // //     status: 'Active',
// // // //     dayTiming: 'Select',
// // // //     time: 'None',
// // // //   });

// // // //   const [members, setMembers] = useState([]);

// // // //   const refreshMembers = async () => {
// // // //     try {
// // // //       const members = await window.electronAPI?.getMembers();
// // // //       setMembers(members || []);
// // // //     } catch (error) {
// // // //       console.error('Error fetching members:', error);
// // // //       alert('Failed to fetch members');
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     refreshMembers();
// // // //   }, []);

// // // //   const handle = (e) =>
// // // //     setForm({ ...form, [e.target.name]: e.target.value });

// // // //   const addMember = async () => {
// // // //     if (!form.fullName.trim()) return alert('Name required');
// // // //     try {
// // // //       if (form.id) {
// // // //         // Update existing member
// // // //         await window.electronAPI.updateMember(form);
// // // //       } else {
// // // //         // Add new member
// // // //         await window.electronAPI.addMember(form);
// // // //       }
// // // //       resetForm();
// // // //       refreshMembers();
// // // //     } catch (error) {
// // // //       console.error('Error saving member:', error);
// // // //       alert('Failed to save member');
// // // //     }
// // // //   };

// // // //   const editMember = (member) => {
// // // //     setForm(member);
// // // //   };

// // // //   const deleteMember = async (id) => {
// // // //     if (!window.confirm('Are you sure you want to delete this member?')) return;
// // // //     try {
// // // //       await window.electronAPI.deleteMember(id);
// // // //       refreshMembers();
// // // //       resetForm();
// // // //     } catch (error) {
// // // //       console.error('Error deleting member:', error);
// // // //       alert('Failed to delete member');
// // // //     }
// // // //   };

// // // //   const resetForm = () => {
// // // //     setForm({
// // // //       id: null,
// // // //       accountOpenDate: '2024-11-23',
// // // //       fullName: '',
// // // //       height: '',
// // // //       weight: '',
// // // //       relativeType: 'S/O',
// // // //       relativeName: '',
// // // //       gender: 'Select',
// // // //       contact: '',
// // // //       address: '',
// // // //       status: 'Active',
// // // //       dayTiming: 'Select',
// // // //       time: 'None',
// // // //     });
// // // //   };

// // // //   return (
// // // //     <div className="member-registration">
// // // //       <div className="registration-header">
// // // //         <div className="user-section">
// // // //           <span className="user-label">User:</span>
// // // //           <input type="text" className="user-input" />
// // // //         </div>
// // // //         <h2 className="page-title">New Member Registration</h2>
// // // //         <button className="search-btn">Search</button>
// // // //       </div>

// // // //       <div className="registration-content" style={{ display: 'flex', gap: 16 }}>
// // // //         <div
// // // //           style={{
// // // //             width: 280,
// // // //             borderRight: '1px solid #ccc',
// // // //             paddingRight: 12,
// // // //             maxHeight: 'calc(100vh - 160px)',
// // // //             overflowY: 'auto',
// // // //           }}
// // // //         >
// // // //           <h3 style={{ marginTop: 0 }}>Members</h3>
// // // //           {members.length === 0 && <p style={{ color: '#666' }}>No members yet</p>}
// // // //           <ul style={{ listStyle: 'none', padding: 0 }}>
// // // //             {members.map((m) => (
// // // //               <li
// // // //                 key={m.id}
// // // //                 style={{
// // // //                   padding: 6,
// // // //                   borderBottom: '1px solid #eee',
// // // //                   fontSize: 13,
// // // //                   display: 'flex',
// // // //                   justifyContent: 'space-between',
// // // //                   alignItems: 'center',
// // // //                 }}
// // // //               >
// // // //                 <div>
// // // //                   <strong>{m.fullName}</strong>
// // // //                   <br />
// // // //                   {m.contact}
// // // //                 </div>
// // // //                 <div>
// // // //                   <button
// // // //                     onClick={() => editMember(m)}
// // // //                     style={{ marginRight: 8 }}
// // // //                     title="Edit"
// // // //                   >
// // // //                     <FaEdit />
// // // //                   </button>
// // // //                   <button onClick={() => deleteMember(m.id)} title="Delete">
// // // //                     <FaTrash />
// // // //                   </button>
// // // //                 </div>
// // // //               </li>
// // // //             ))}
// // // //           </ul>
// // // //         </div>

// // // //         <div className="left-panel" style={{ flex: 1 }}>
// // // //           <div className="photo-section">
// // // //             <div className="photo-container">
// // // //               <div className="photo-placeholder"></div>
// // // //               <div className="photo-controls">
// // // //                 <button className="control-btn cancel">
// // // //                   <FaTimes style={{ marginRight: 6 }} /> Cancel
// // // //                 </button>
// // // //                 <button className="control-btn upload">
// // // //                   <FaUpload style={{ marginRight: 6 }} /> Upload
// // // //                 </button>
// // // //                 <button className="control-btn webcam">
// // // //                   <FaCamera style={{ marginRight: 6 }} /> Capture Webcam
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label>Account Open Date</label>
// // // //             <div className="date-input">
// // // //               <input
// // // //                 type="date"
// // // //                 name="accountOpenDate"
// // // //                 value={form.accountOpenDate}
// // // //                 onChange={handle}
// // // //               />
// // // //             </div>
// // // //           </div>

// // // //           <div className="form-row">
// // // //             <div className="form-group">
// // // //               <label>Full Name</label>
// // // //               <input
// // // //                 type="text"
// // // //                 name="fullName"
// // // //                 value={form.fullName}
// // // //                 onChange={handle}
// // // //               />
// // // //             </div>
// // // //             <div className="form-group">
// // // //               <label>Height</label>
// // // //               <input
// // // //                 type="number"
// // // //                 name="height"
// // // //                 value={form.height}
// // // //                 onChange={handle}
// // // //                 placeholder="0"
// // // //               />
// // // //             </div>
// // // //             <div className="form-group">
// // // //               <label>Weight</label>
// // // //               <input
// // // //                 type="number"
// // // //                 name="weight"
// // // //                 value={form.weight}
// // // //                 onChange={handle}
// // // //                 placeholder="0"
// // // //               />
// // // //             </div>
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label>Relative</label>
// // // //             <div className="relative-row">
// // // //               <select
// // // //                 name="relativeType"
// // // //                 value={form.relativeType}
// // // //                 onChange={handle}
// // // //                 className="relative-select"
// // // //               >
// // // //                 <option>S/O</option>
// // // //                 <option>D/O</option>
// // // //                 <option>W/O</option>
// // // //               </select>
// // // //               <input
// // // //                 type="text"
// // // //                 name="relativeName"
// // // //                 value={form.relativeName}
// // // //                 onChange={handle}
// // // //                 className="relative-name"
// // // //               />
// // // //             </div>
// // // //           </div>

// // // //           <div className="form-row">
// // // //             <div className="form-group">
// // // //               <label>Gender</label>
// // // //               <select name="gender" value={form.gender} onChange={handle}>
// // // //                 <option>Select</option>
// // // //                 <option>Male</option>
// // // //                 <option>Female</option>
// // // //               </select>
// // // //             </div>
// // // //             <div className="form-group">
// // // //               <label>Contact #</label>
// // // //               <div className="contact-row">
// // // //                 <span className="country-code">+92</span>
// // // //                 <input
// // // //                   type="tel"
// // // //                   name="contact"
// // // //                   value={form.contact}
// // // //                   onChange={handle}
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label>Address</label>
// // // //             <input
// // // //               type="text"
// // // //               name="address"
// // // //               value={form.address}
// // // //               onChange={handle}
// // // //             />
// // // //           </div>

// // // //           <div className="form-group">
// // // //             <label>Member Status</label>
// // // //             <select name="status" value={form.status} onChange={handle}>
// // // //               <option>Active</option>
// // // //               <option>Inactive</option>
// // // //               <option>Suspended</option>
// // // //             </select>
// // // //           </div>

// // // //           <div className="form-row">
// // // //             <div className="form-group">
// // // //               <label>Day Timing</label>
// // // //               <select
// // // //                 name="dayTiming"
// // // //                 value={form.dayTiming}
// // // //                 onChange={handle}
// // // //               >
// // // //                 <option>Select</option>
// // // //                 <option>Morning</option>
// // // //                 <option>Evening</option>
// // // //                 <option>All Day</option>
// // // //               </select>
// // // //             </div>
// // // //             <div className="form-group">
// // // //               <label>Time</label>
// // // //               <select name="time" value={form.time} onChange={handle}>
// // // //                 <option>None</option>
// // // //                 <option>6:00 AM - 10:00 AM</option>
// // // //                 <option>5:00 PM - 9:00 PM</option>
// // // //               </select>
// // // //               <button className="add-time-btn">+</button>
// // // //             </div>
// // // //           </div>

// // // //           <div style={{ textAlign: 'center', marginTop: 32 }}>
// // // //             <button className="nav-btn" onClick={addMember}>
// // // //               {form.id ? 'Update' : 'Add'}
// // // //             </button>
// // // //             {form.id && (
// // // //               <button
// // // //                 className="nav-btn"
// // // //                 onClick={resetForm}
// // // //                 style={{ marginLeft: 8 }}
// // // //               >
// // // //                 Cancel
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AddMemberScreen;










// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import { FaTimes, FaUpload, FaCamera } from 'react-icons/fa';
// // // // // // // import '../App.css';

// // // // // // // const AddMemberScreen = () => {
// // // // // // //   /* ---- form state ---- */
// // // // // // //   const [form, setForm] = useState({
// // // // // // //     accountOpenDate: '2024-11-23',
// // // // // // //     fullName: '',
// // // // // // //     height: '',
// // // // // // //     weight: '',
// // // // // // //     relativeType: 'S/O',
// // // // // // //     relativeName: '',
// // // // // // //     gender: 'Select',
// // // // // // //     contact: '',
// // // // // // //     address: '',
// // // // // // //     status: 'Active',
// // // // // // //     dayTiming: 'Select',
// // // // // // //     time: 'None',
// // // // // // //   });

// // // // // // //   /* ---- members list (left) ---- */
// // // // // // //   const [members, setMembers] = useState([]);

// // // // // // //   /* ---- load once + refresh ---- */
// // // // // // //   // const refreshMembers = async () =>
// // // // // // //   //   await window.electronAPI?.getMembers().then(setMembers);

// // // // // // //   // const refreshMembers = () =>
// // // // // // //   //   window.electronAPI?.getMembers().then(setMembers);

// // // // // // //   useEffect(() => {
// // // // // // //     window.electronAPI?.getMembers().then(setMembers);
// // // // // // //   }, [members])

// // // // // // //   // useEffect(() => refreshMembers(), []);

// // // // // // //   /* ---- form helpers ---- */
// // // // // // //   const handle = (e) =>
// // // // // // //     setForm({ ...form, [e.target.name]: e.target.value });

// // // // // // //   const addMember = async () => {
// // // // // // //     if (!form.fullName.trim()) return alert('Name required');
// // // // // // //     await window.electronAPI.addMember(form);
// // // // // // //     // refreshMembers();          // ← re-fetch
// // // // // // //     /* optional: reset form */
// // // // // // //     setForm({
// // // // // // //       accountOpenDate: '2024-11-23',
// // // // // // //       fullName: '',
// // // // // // //       height: '',
// // // // // // //       weight: '',
// // // // // // //       relativeType: 'S/O',
// // // // // // //       relativeName: '',
// // // // // // //       gender: 'Select',
// // // // // // //       contact: '',
// // // // // // //       address: '',
// // // // // // //       status: 'Active',
// // // // // // //       dayTiming: 'Select',
// // // // // // //       time: 'None',
// // // // // // //     });
// // // // // // //   };

// // // // // // //   /* ---- UI ---- */
// // // // // // //   return (
// // // // // // //     <div className="member-registration">
// // // // // // //       {/* ---- HEADER (unchanged) ---- */}
// // // // // // //       <div className="registration-header">
// // // // // // //         <div className="user-section">
// // // // // // //           <span className="user-label">User:</span>
// // // // // // //           <input type="text" className="user-input" />
// // // // // // //         </div>
// // // // // // //         <h2 className="page-title">New Member Registration</h2>
// // // // // // //         <button className="search-btn">Search</button>
// // // // // // //       </div>

// // // // // // //       {/* ---- MAIN GRID: LEFT LIST + RIGHT FORM ---- */}
// // // // // // //       <div
// // // // // // //         className="registration-content"
// // // // // // //         style={{ display: 'flex', gap: 16 }}
// // // // // // //       >
// // // // // // //         {/* LEFT: MEMBERS LIST */}
// // // // // // //         <div
// // // // // // //           style={{
// // // // // // //             width: 280,
// // // // // // //             borderRight: '1px solid #ccc',
// // // // // // //             paddingRight: 12,
// // // // // // //             maxHeight: 'calc(100vh - 160px)',
// // // // // // //             overflowY: 'auto',
// // // // // // //           }}
// // // // // // //         >
// // // // // // //           <h3 style={{ marginTop: 0 }}>Members</h3>
// // // // // // //           {members.length === 0 && <p style={{ color: '#666' }}>No members yet</p>}
// // // // // // //           <ul style={{ listStyle: 'none', padding: 0 }}>
// // // // // // //             {members.map((m) => (
// // // // // // //               <li
// // // // // // //                 key={m.id}
// // // // // // //                 style={{
// // // // // // //                   padding: 6,
// // // // // // //                   borderBottom: '1px solid #eee',
// // // // // // //                   fontSize: 13,
// // // // // // //                 }}
// // // // // // //               >
// // // // // // //                 <strong>{m.fullName}</strong>
// // // // // // //                 <br />
// // // // // // //                 {m.contact}
// // // // // // //               </li>
// // // // // // //             ))}
// // // // // // //           </ul>
// // // // // // //         </div>

// // // // // // //         {/* RIGHT: ORIGINAL FORM */}
// // // // // // //         <div className="left-panel" style={{ flex: 1 }}>
// // // // // // //           {/* ---- photo section ---- */}
// // // // // // //           <div className="photo-section">
// // // // // // //             <div className="photo-container">
// // // // // // //               <div className="photo-placeholder"></div>
// // // // // // //               <div className="photo-controls">
// // // // // // //                 <button className="control-btn cancel">
// // // // // // //                   <FaTimes style={{ marginRight: 6 }} /> Cancel
// // // // // // //                 </button>
// // // // // // //                 <button className="control-btn upload">
// // // // // // //                   <FaUpload style={{ marginRight: 6 }} /> Upload
// // // // // // //                 </button>
// // // // // // //                 <button className="control-btn webcam">
// // // // // // //                   <FaCamera style={{ marginRight: 6 }} /> Capture Webcam
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* ---- all other form groups (unchanged) ---- */}
// // // // // // //           <div className="form-group">
// // // // // // //             <label>Account Open Date</label>
// // // // // // //             <div className="date-input">
// // // // // // //               <input
// // // // // // //                 type="date"
// // // // // // //                 name="accountOpenDate"
// // // // // // //                 value={form.accountOpenDate}
// // // // // // //                 onChange={handle}
// // // // // // //               />
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           <div className="form-row">
// // // // // // //             <div className="form-group">
// // // // // // //               <label>Full Name</label>
// // // // // // //               <input
// // // // // // //                 type="text"
// // // // // // //                 name="fullName"
// // // // // // //                 value={form.fullName}
// // // // // // //                 onChange={handle}
// // // // // // //               />
// // // // // // //             </div>
// // // // // // //             <div className="form-group">
// // // // // // //               <label>Height</label>
// // // // // // //               <input
// // // // // // //                 type="number"
// // // // // // //                 name="height"
// // // // // // //                 value={form.height}
// // // // // // //                 onChange={handle}
// // // // // // //                 placeholder="0"
// // // // // // //               />
// // // // // // //             </div>
// // // // // // //             <div className="form-group">
// // // // // // //               <label>Weight</label>
// // // // // // //               <input
// // // // // // //                 type="number"
// // // // // // //                 name="weight"
// // // // // // //                 value={form.weight}
// // // // // // //                 onChange={handle}
// // // // // // //                 placeholder="0"
// // // // // // //               />
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           <div className="form-group">
// // // // // // //             <label>Relative</label>
// // // // // // //             <div className="relative-row">
// // // // // // //               <select
// // // // // // //                 name="relativeType"
// // // // // // //                 value={form.relativeType}
// // // // // // //                 onChange={handle}
// // // // // // //                 className="relative-select"
// // // // // // //               >
// // // // // // //                 <option>S/O</option>
// // // // // // //                 <option>D/O</option>
// // // // // // //                 <option>W/O</option>
// // // // // // //               </select>
// // // // // // //               <input
// // // // // // //                 type="text"
// // // // // // //                 name="relativeName"
// // // // // // //                 value={form.relativeName}
// // // // // // //                 onChange={handle}
// // // // // // //                 className="relative-name"
// // // // // // //               />
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           <div className="form-row">
// // // // // // //             <div className="form-group">
// // // // // // //               <label>Gender</label>
// // // // // // //               <select name="gender" value={form.gender} onChange={handle}>
// // // // // // //                 <option>Select</option>
// // // // // // //                 <option>Male</option>
// // // // // // //                 <option>Female</option>
// // // // // // //               </select>
// // // // // // //             </div>
// // // // // // //             <div className="form-group">
// // // // // // //               <label>Contact #</label>
// // // // // // //               <div className="contact-row">
// // // // // // //                 <span className="country-code">+92</span>
// // // // // // //                 <input
// // // // // // //                   type="tel"
// // // // // // //                   name="contact"
// // // // // // //                   value={form.contact}
// // // // // // //                   onChange={handle}
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           <div className="form-group">
// // // // // // //             <label>Address</label>
// // // // // // //             <input
// // // // // // //               type="text"
// // // // // // //               name="address"
// // // // // // //               value={form.address}
// // // // // // //               onChange={handle}
// // // // // // //             />
// // // // // // //           </div>

// // // // // // //           <div className="form-group">
// // // // // // //             <label>Member Status</label>
// // // // // // //             <select name="status" value={form.status} onChange={handle}>
// // // // // // //               <option>Active</option>
// // // // // // //               <option>Inactive</option>
// // // // // // //               <option>Suspended</option>
// // // // // // //             </select>
// // // // // // //           </div>

// // // // // // //           <div className="form-row">
// // // // // // //             <div className="form-group">
// // // // // // //               <label>Day Timing</label>
// // // // // // //               <select
// // // // // // //                 name="dayTiming"
// // // // // // //                 value={form.dayTiming}
// // // // // // //                 onChange={handle}
// // // // // // //               >
// // // // // // //                 <option>Select</option>
// // // // // // //                 <option>Morning</option>
// // // // // // //                 <option>Evening</option>
// // // // // // //                 <option>All Day</option>
// // // // // // //               </select>
// // // // // // //             </div>
// // // // // // //             <div className="form-group">
// // // // // // //               <label>Time</label>
// // // // // // //               <select name="time" value={form.time} onChange={handle}>
// // // // // // //                 <option>None</option>
// // // // // // //                 <option>6:00 AM - 10:00 AM</option>
// // // // // // //                 <option>5:00 PM - 9:00 PM</option>
// // // // // // //               </select>
// // // // // // //               <button className="add-time-btn">+</button>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* ---- ADD BUTTON ---- */}
// // // // // // //           <div style={{ textAlign: 'center', marginTop: 32 }}>
// // // // // // //             <button className="nav-btn" onClick={addMember}>
// // // // // // //               Add
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default AddMemberScreen;