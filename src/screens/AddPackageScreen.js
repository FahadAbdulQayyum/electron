import React, { useEffect, useState, useCallback } from 'react';
import '../App.css';

const AddPackageScreen = () => {
  const [form, setForm] = useState({
    id: null,
    packageName: '',
    price: '',
    gender: 'Male',
  });

  const [packages, setPackages] = useState([]);

  const fetchPackages = useCallback(async () => {
    try {
      const result = await window?.electronAPI?.getPackages();
      console.log('Received packages:', result);
      setPackages(result || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      alert('Failed to fetch packages');
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = useCallback(() => {
    setForm({
      id: null,
      packageName: '',
      price: '',
      gender: 'Male',
    });
  }, []);

  const addPackage = async () => {
    if (!form.packageName.trim()) {
      alert('Package Name is required');
      return;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) {
      alert('Valid Package Price is required');
      return;
    }
    try {
      console.log('Adding package:', form);
      await window.electronAPI.addPackage({
        packageName: form.packageName,
        price: Number(form.price),
        gender: form.gender,
      });
      resetForm();
      fetchPackages();
    } catch (error) {
      console.error('Error adding package:', error);
      alert('Failed to add package');
    }
  };

  const updatePackage = async () => {
    if (!form.packageName.trim()) {
      alert('Package Name is required');
      return;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) {
      alert('Valid Package Price is required');
      return;
    }
    try {
      console.log('Updating package:', form);
      await window.electronAPI.updatePackage({
        id: form.id,
        packageName: form.packageName,
        price: Number(form.price),
        gender: form.gender,
      });
      resetForm();
      fetchPackages();
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Failed to update package');
    }
  };

  const deletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      console.log('Deleting package ID:', id);
      await window.electronAPI.deletePackage(id);
      fetchPackages();
      resetForm();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Failed to delete package');
    }
  };

  const editPackage = (pkg) => {
    console.log('Editing package:', pkg);
    setForm({
      id: pkg.id,
      packageName: pkg.packageName,
      price: pkg.price.toString(),
      gender: pkg.gender,
    });
  };

  console.log('Rendering packages:', packages);

  return (
    <div className="trainer-helper-section">
      <div className="trainer-helper-left">
        <h3>Add New Package</h3>
        <div className="form-group">
          <label>Package Name</label>
          <input
            type="text"
            name="packageName"
            value={form.packageName}
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label>Package Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleInput}
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Package Gender</label>
          <select name="gender" value={form.gender} onChange={handleInput}>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div className="trainer-helper-actions">
          <button className="btn-orange-outline" onClick={resetForm}>
            New Package
          </button>
          <button className="btn-orange" onClick={addPackage}>
            Save
          </button>
          <button className="btn-green" onClick={updatePackage} disabled={!form.id}>
            Update
          </button>
          <button className="btn-red" onClick={fetchPackages}>
            Refresh
          </button>
        </div>
      </div>
      <div className="trainer-helper-right">
        <h3>Packages Detail</h3>
        <div className="trainer-helper-table-wrapper">
          <table className="trainer-helper-table">
            <thead>
              <tr>
                <th>SNO</th>
                <th>Package Name</th>
                <th>Price</th>
                <th>Package Gender</th>
                <th>Edit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                    No packages to display.
                  </td>
                </tr>
              ) : (
                packages.map((pkg, index) => (
                  <tr key={pkg.id}>
                    <td>{index + 1}</td>
                    <td className={index === 0 ? 'highlighted' : ''}>{pkg.packageName}</td>
                    <td>{pkg.price}</td>
                    <td>{pkg.gender}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editPackage(pkg)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <span
                        className="table-x"
                        onClick={() => deletePackage(pkg.id)}
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

export default AddPackageScreen;










// import React from 'react';
// import '../App.css';

// const AddPackageScreen = () => (
//   <div className="trainer-helper-section">
//     <div className="trainer-helper-left">
//       <h3>Add New Package</h3>
//       <div className="form-group">
//         <label>Package Name</label>
//         <input type="text" />
//       </div>
//       <div className="form-group">
//         <label>Package Price</label>
//         <input type="number" />
//       </div>
//       <div className="form-group">
//         <label>Package Gender</label>
//         <select>
//           <option>Male</option>
//           <option>Female</option>
//         </select>
//       </div>
//       <div className="trainer-helper-actions">
//         <button className="btn-orange-outline">New Package</button>
//         <button className="btn-orange">Save</button>
//         <button className="btn-green">Update</button>
//         <button className="btn-red">Refresh</button>
//       </div>
//     </div>
//     <div className="trainer-helper-right">
//       <h3>Packages Detail</h3>
//       <div className="trainer-helper-table-wrapper">
//         <table className="trainer-helper-table">
//           <thead>
//             <tr>
//               <th>SNO</th>
//               <th>Package Name</th>
//               <th>Price</th>
//               <th>Package Gender</th>
//               <th>Edit</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>1</td>
//               <td className="highlighted">DEFAULT PACKAGE</td>
//               <td>2500</td>
//               <td>Male</td>
//               <td><button className="edit-btn">Edit</button></td>
//             </tr>
//             <tr>
//               <td>2</td>
//               <td>GYM + CARDIO</td>
//               <td>5000</td>
//               <td>Male</td>
//               <td><button className="edit-btn">Edit</button></td>
//             </tr>
//             <tr>
//               <td>3</td>
//               <td>PERSONAL TRAINING</td>
//               <td>8000</td>
//               <td>Male</td>
//               <td><button className="edit-btn">Edit</button></td>
//             </tr>
//             <tr>
//               <td>4</td>
//               <td>TARGET TRAINING</td>
//               <td>12000</td>
//               <td>Male</td>
//               <td><button className="edit-btn">Edit</button></td>
//             </tr>
//             <tr>
//               <td>5</td>
//               <td>STRENGHT</td>
//               <td>2500</td>
//               <td>Male</td>
//               <td><button className="edit-btn">Edit</button></td>
//             </tr>
//             <tr>
//               <td>6</td>
//               <td>CARDIO</td>
//               <td>2500</td>
//               <td>Male</td>
//               <td><button className="edit-btn">Edit</button></td>
//             </tr>
//             <tr>
//               <td>7</td>
//               <td>GROUP TRAINING</td>
//               <td>6000</td>
//               <td>Male</td>
//               <td><button className="edit-btn">Edit</button></td>
//             </tr>
//             <tr>
//               <td>8</td>
//               <td>AEROBIC</td>
//               <td>3000</td>
//               <td>Female</td>
//               <td><button className="edit-btn">Edit</button></td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// );

// export default AddPackageScreen; 