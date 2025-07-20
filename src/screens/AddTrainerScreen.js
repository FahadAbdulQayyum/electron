import React, { useEffect, useState } from 'react';
import '../App.css';

const AddTrainerScreen = () => {
  const [form, setForm] = useState({
    id: null,
    fullName: '',
    contact: '',
    isPersonalTrainer: false,
    isGymTrainer: false,
    status: 'Active',
  });

  const [trainers, setTrainers] = useState([]);

  const fetchTrainers = async () => {
    try {
      const result = await window?.electronAPI?.getTrainers();
      setTrainers(result || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      alert('Failed to fetch trainers');
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      fullName: '',
      contact: '',
      isPersonalTrainer: false,
      isGymTrainer: false,
      status: 'Active',
    });
  };

  const addTrainer = async () => {
    if (!form.fullName.trim()) {
      alert('Full Name is required');
      return;
    }
    try {
      await window.electronAPI.addTrainer(form);
      resetForm();
      fetchTrainers();
    } catch (error) {
      console.error('Error adding trainer:', error);
      alert('Failed to add trainer');
    }
  };

  const updateTrainer = async () => {
    if (!form.fullName.trim()) {
      alert('Full Name is required');
      return;
    }
    try {
      await window.electronAPI.updateTrainer(form);
      resetForm();
      fetchTrainers();
    } catch (error) {
      console.error('Error updating trainer:', error);
      alert('Failed to update trainer');
    }
  };

  const deleteTrainer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    try {
      await window.electronAPI.deleteTrainer(id);
      fetchTrainers();
      resetForm();
    } catch (error) {
      console.error('Error deleting trainer:', error);
      alert('Failed to delete trainer');
    }
  };

  const editTrainer = (trainer) => {
    setForm({
      id: trainer.id,
      fullName: trainer.fullName,
      contact: trainer.contact,
      isPersonalTrainer: !!trainer.isPersonalTrainer,
      isGymTrainer: !!trainer.isGymTrainer,
      status: trainer.status,
    });
  };

  return (
    <div className="trainer-helper-section">
      <div className="trainer-helper-left">
        <h3>Trainer / Helper</h3>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleInput}
          />
        </div>
        <div className="form-group" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <label style={{ margin: 0 }}>
            <input
              type="checkbox"
              name="isPersonalTrainer"
              checked={form.isPersonalTrainer}
              onChange={handleInput}
              style={{ marginRight: 5 }}
            /> Personal Trainer
          </label>
          <label style={{ margin: 0 }}>
            <input
              type="checkbox"
              name="isGymTrainer"
              checked={form.isGymTrainer}
              onChange={handleInput}
              style={{ marginRight: 5 }}
            /> Gym Trainer
          </label>
        </div>
        <div className="form-group">
          <label>Contact #</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleInput}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Deactive</option>
          </select>
        </div>
        <div className="trainer-helper-actions">
          <button className="btn-orange-outline" onClick={resetForm}>
            Add New
          </button>
          <button className="btn-orange" onClick={addTrainer}>
            Save
          </button>
          <button className="btn-green" onClick={updateTrainer} disabled={!form.id}>
            Update
          </button>
          <button className="btn-red" onClick={fetchTrainers}>
            Refresh
          </button>
        </div>
      </div>
      <div className="trainer-helper-right">
        <h3>Trainer/Helper Detail</h3>
        <div className="trainer-helper-table-wrapper">
          <table className="trainer-helper-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Contact #</th>
                <th>Personal Trainer</th>
                <th>Gym Trainer</th>
                <th>Status</th>
                <th>Edit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {trainers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#888' }}>
                    No trainers to display.
                  </td>
                </tr>
              ) : (
                trainers.map((trainer) => (
                  <tr key={trainer.id}>
                    <td>{trainer.id}</td>
                    <td>{trainer.fullName}</td>
                    <td>{trainer.contact || 'N/A'}</td>
                    <td>{trainer.isPersonalTrainer ? 'Yes' : 'No'}</td>
                    <td>{trainer.isGymTrainer ? 'Yes' : 'No'}</td>
                    <td>{trainer.status}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editTrainer(trainer)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <span
                        className="table-x"
                        onClick={() => deleteTrainer(trainer.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        ✗
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddTrainerScreen;









// import React from 'react';
// import '../App.css';

// const AddTrainerScreen = () => (
//   <div className="trainer-helper-section">
//     <div className="trainer-helper-left">
//       <h3>Trainer / Helper</h3>
//       <div className="form-group">
//         <label>Full Name</label>
//         <input type="text" />
//       </div>
//       <div className="form-group" style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
//         <label style={{margin: 0}}><input type="checkbox" style={{marginRight: 5}} /> Personal Trainer</label>
//         <label style={{margin: 0}}><input type="checkbox" style={{marginRight: 5}} /> Gym Trainer</label>
//       </div>
//       <div className="form-group">
//         <label>Contact #</label>
//         <input type="text" />
//       </div>
//       <div className="form-group">
//         <label>Status</label>
//         <select>
//           <option>Active</option>
//           <option>Inactive</option>
//           <option>Deactive</option>
//         </select>
//       </div>
//       <div className="trainer-helper-actions">
//         <button className="btn-orange-outline">Add New</button>
//         <button className="btn-orange">Save</button>
//         <button className="btn-green">Update</button>
//         <button className="btn-red">Refresh</button>
//       </div>
//     </div>
//     <div className="trainer-helper-right">
//       <h3>Trainer/Helper Detail</h3>
//       <div className="trainer-helper-table-wrapper">
//         <table className="trainer-helper-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Full Name</th>
//               <th>Contact #</th>
//               <th>Personal Trainer</th>
//               <th>Gym Trainer</th>
//               <th>Status</th>
//               <th>Edit</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>1</td>
//               <td>.</td>
//               <td>0000</td>
//               <td>Yes</td>
//               <td>Yes</td>
//               <td>Deactive</td>
//               <td><button className="edit-btn">Edit</button></td>
//               <td><span className="table-x">✗</span></td>
//             </tr>
//             <tr>
//               <td>2</td>
//               <td><span className="highlighted">AHMED KHAN</span></td>
//               <td>03128888885</td>
//               <td>No</td>
//               <td>Yes</td>
//               <td>Active</td>
//               <td><button className="edit-btn">Edit</button></td>
//               <td><span className="table-x">✗</span></td>
//             </tr>
//             <tr>
//               <td>3</td>
//               <td>RIJJA IBRAHIM</td>
//               <td>0</td>
//               <td>Yes</td>
//               <td>No</td>
//               <td>Active</td>
//               <td><button className="edit-btn">Edit</button></td>
//               <td><span className="table-x">✗</span></td>
//             </tr>
//             <tr>
//               <td>4</td>
//               <td>QAIS DURANI</td>
//               <td>0</td>
//               <td>Yes</td>
//               <td>No</td>
//               <td>Active</td>
//               <td><button className="edit-btn">Edit</button></td>
//               <td><span className="table-x">✗</span></td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// );

// export default AddTrainerScreen; 