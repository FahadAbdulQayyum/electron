import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../App.css';

const SelectMemberScreen = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMembers = async (query = '') => {
    try {
      const result = await window.electronAPI.searchMembers(query);
      setMembers(result || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Failed to fetch members');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = () => {
    fetchMembers(searchQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="select-member-container">
      <div className="select-member-header">
        <span className="select-member-title">Search by Name or Contact (only active members)</span>
        <div className="select-member-search-row">
          <input
            type="text"
            className="select-member-search-input"
            placeholder="Enter name or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="select-member-search-btn" onClick={handleSearch}>
            <FaSearch style={{ marginRight: 6 }} /> Search
          </button>
        </div>
      </div>
      <div className="select-member-table-wrapper">
        <table className="select-member-table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>Acc#</th>
              <th>Member Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Commission</th>
              <th>Trainer Fee</th>
              <th>Trainer Name</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: '#888' }}>
                  No data to display.
                </td>
              </tr>
            ) : (
              members.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>{member.id}</td>
                  <td>{member.fullName}</td>
                  <td>{member.address || 'N/A'}</td>
                  <td>{member.contact || 'N/A'}</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelectMemberScreen;








// import React from 'react';
// import { FaSearch } from 'react-icons/fa';
// import '../App.css';

// const SelectMemberScreen = () => (
//   <div className="select-member-container">
//     <div className="select-member-header">
//       <span className="select-member-title">Search by Name or Contact (only active members)</span>
//       <div className="select-member-search-row">
//         <input
//           type="text"
//           className="select-member-search-input"
//           placeholder="Enter name or contact..."
//         />
//         <button className="select-member-search-btn">
//           <FaSearch style={{ marginRight: 6 }} /> Search
//         </button>
//       </div>
//     </div>
//     <div className="select-member-table-wrapper">
//       <table className="select-member-table">
//         <thead>
//           <tr>
//             <th>SNO</th>
//             <th>Acc#</th>
//             <th>Member Name</th>
//             <th>Address</th>
//             <th>Contact</th>
//             <th>Commission</th>
//             <th>Trainer Fee</th>
//             <th>Trainer Name</th>
//             <th>Expiry</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* Placeholder row */}
//           <tr>
//             <td colSpan="9" style={{ textAlign: 'center', color: '#888' }}>
//               No data to display.
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// export default SelectMemberScreen; 