import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../App.css';

const MemberDetailsScreen = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshMembers = async () => {
    try {
      const members = await window.electronAPI?.getMembers();
      setMembers(members || []);
      setFilteredMembers(members || []); // Initialize filtered members
      console.log('Members fetched:', members);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Failed to fetch members');
    }
  };

  useEffect(() => {
    refreshMembers();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = members.filter(
      (member) =>
        member.fullName.toLowerCase().includes(query) ||
        (member.contact && member.contact.toLowerCase().includes(query))
    );
    setFilteredMembers(filtered);
  };

  const editMember = (member) => {
    // Assuming navigation to AddMemberScreen with member data for editing
    window.electronAPI?.navigateToEdit(member);
    console.log('Navigating to edit member:', member);
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await window.electronAPI?.deleteMember(id);
      refreshMembers();
      console.log('Member deleted');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    }
  };

  return (
    <div className="member-details" style={{ padding: '20px' }}>
      <div className="registration-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="user-section">
          <span className="user-label">User:</span>
          <input type="text" className="user-input" />
        </div>
        <h2 className="page-title" style={{ flex: 1 }}>All Members Details</h2>
        <input
          type="text"
          placeholder="Search by name or contact..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            width: '200px',
            backgroundColor: '#fff',
          }}
        />
        <button
          className="search-btn"
          onClick={() => handleSearch({ target: { value: searchQuery } })}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      <div className="members-list" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
        {filteredMembers.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center' }}>
            {searchQuery ? 'No members match your search' : 'No members found'}
          </p>
        )}
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              style={{
                border: '1px solid #eee',
                borderRadius: '5px',
                padding: '16px',
                display: 'flex',
                gap: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
                {member.photo && (
                  <img
                    src={`data:image/jpeg;base64,${member.photo}`}
                    alt={member.fullName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px', color: '#333' }}>{member.fullName}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <strong>Contact:</strong> {member.contact || 'N/A'}<br />
                    <strong>Address:</strong> {member.address || 'N/A'}<br />
                    <strong>Gender:</strong> {member.gender || 'N/A'}<br />
                    <strong>Height:</strong> {member.height || 'N/A'}<br />
                    <strong>Weight:</strong> {member.weight || 'N/A'}<br />
                    <strong>Relative:</strong> {member.relativeType} {member.relativeName || 'N/A'}
                  </div>
                  <div>
                    <strong>Account Open Date:</strong> {member.accountOpenDate || 'N/A'}<br />
                    <strong>Status:</strong> {member.status || 'N/A'}<br />
                    <strong>Day Timing:</strong> {member.dayTiming || 'N/A'}<br />
                    <strong>Time Slot:</strong> {member.time || 'None'}<br />
                    <strong>Total Amount:</strong> {member.totalAmount || 0}<br />
                    <strong>Balance:</strong> {member.balance || 0}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => editMember(member)}
                  style={{
                    padding: '8px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Edit"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  style={{
                    padding: '8px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Delete"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsScreen;









// import React, { useEffect, useState } from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa';
// import '../App.css';

// const MemberDetailsScreen = () => {
//   const [members, setMembers] = useState([]);

//   const refreshMembers = async () => {
//     try {
//       const members = await window.electronAPI?.getMembers();
//       setMembers(members || []);
//       console.log('Members fetched:', members);
//     } catch (error) {
//       console.error('Error fetching members:', error);
//       alert('Failed to fetch members');
//     }
//   };

//   useEffect(() => {
//     refreshMembers();
//   }, []);

//   const editMember = (member) => {
//     // Assuming navigation to AddMemberScreen with member data for editing
//     window.electronAPI?.navigateToEdit(member);
//     console.log('Navigating to edit member:', member);
//   };

//   const deleteMember = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this member?')) return;
//     try {
//       await window.electronAPI?.deleteMember(id);
//       refreshMembers();
//       console.log('Member deleted');
//     } catch (error) {
//       console.error('Error deleting member:', error);
//       alert('Failed to delete member');
//     }
//   };

//   return (
//     <div className="member-details" style={{ padding: '20px' }}>
//       <div className="registration-header">
//         <div className="user-section">
//           <span className="user-label">User:</span>
//           <input type="text" className="user-input" />
//         </div>
//         <h2 className="page-title">All Members Details</h2>
//         <button className="search-btn">Search</button>
//       </div>

//       <div className="members-list" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
//         {members.length === 0 && <p style={{ color: '#666', textAlign: 'center' }}>No members found</p>}
//         <div style={{ display: 'grid', gap: '16px' }}>
//           {members.map((member) => (
//             <div
//               key={member.id}
//               style={{
//                 border: '1px solid #eee',
//                 borderRadius: '5px',
//                 padding: '16px',
//                 display: 'flex',
//                 gap: '16px',
//                 backgroundColor: '#fff',
//                 boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//               }}
//             >
//               <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
//                 {member.photo && (
//                   <img
//                     src={`data:image/jpeg;base64,${member.photo}`}
//                     alt={member.fullName}
//                     style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
//                   />
//                 )}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <h3 style={{ margin: '0 0 8px', color: '#333' }}>{member.fullName}</h3>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
//                   <div>
//                     <strong>Contact:</strong> {member.contact || 'N/A'}<br />
//                     <strong>Address:</strong> {member.address || 'N/A'}<br />
//                     <strong>Gender:</strong> {member.gender || 'N/A'}<br />
//                     <strong>Height:</strong> {member.height || 'N/A'}<br />
//                     <strong>Weight:</strong> {member.weight || 'N/A'}<br />
//                     <strong>Relative:</strong> {member.relativeType} {member.relativeName || 'N/A'}
//                   </div>
//                   <div>
//                     <strong>Account Open Date:</strong> {member.accountOpenDate || 'N/A'}<br />
//                     <strong>Status:</strong> {member.status || 'N/A'}<br />
//                     <strong>Day Timing:</strong> {member.dayTiming || 'N/A'}<br />
//                     <strong>Time Slot:</strong> {member.time || 'None'}<br />
//                     <strong>Total Amount:</strong> {member.totalAmount || 0}<br />
//                     <strong>Balance:</strong> {member.balance || 0}
//                   </div>
//                 </div>
//               </div>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                 <button
//                   onClick={() => editMember(member)}
//                   style={{
//                     padding: '8px',
//                     backgroundColor: '#007bff',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '3px',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '4px',
//                   }}
//                   title="Edit"
//                 >
//                   <FaEdit /> Edit
//                 </button>
//                 <button
//                   onClick={() => deleteMember(member.id)}
//                   style={{
//                     padding: '8px',
//                     backgroundColor: '#dc3545',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '3px',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '4px',
//                   }}
//                   title="Delete"
//                 >
//                   <FaTrash /> Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MemberDetailsScreen;