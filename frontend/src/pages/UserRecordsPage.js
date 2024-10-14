import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

export default function UserRecordsPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null); 
  const [editedUserData, setEditedUserData] = useState({}); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/users');
        const userData = response.data.map((doc) => ({
          id: doc.docId, 
          ...doc 
        }));
        console.log('data',userData)
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users by search term
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    console.log('Deleting user with ID:', id); // Log the user ID being deleted
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Ensure this endpoint is correct
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        console.log('User deleted from backend.');

        // Update state to remove the deleted user
        setUsers(users.filter((user) => user.id !== id)); 
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">User Details</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Full Name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ maxWidth: '400px' }}
        />
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-primary">
          <tr>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              {editingUser === user.id ? (
                <>
                  <td>{user.id}</td>
                  <td>
                    <input
                      type="text"
                      name="fullName"
                      value={editedUserData.fullName || user.fullName}
                      onChange={(e) => setEditedUserData({ ...editedUserData, fullName: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editedUserData.email || user.email}
                      onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={editedUserData.phone || user.phone}
                      onChange={(e) => setEditedUserData({ ...editedUserData, phone: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="address"
                      value={editedUserData.address || user.address}
                      onChange={(e) => setEditedUserData({ ...editedUserData, address: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="dob"
                      value={editedUserData.dob || user.dob}
                      onChange={(e) => setEditedUserData({ ...editedUserData, dob: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      name="gender"
                      value={editedUserData.gender || user.gender}
                      onChange={(e) => setEditedUserData({ ...editedUserData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </td>
                  <td>
                    {/* Add buttons for saving or canceling edits */}
                  </td>
                </>
              ) : (
                <>
                  <td>{user.userId}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>{user.dob}</td>
                  <td>{user.gender}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.docId)} // Ensure this matches the ID passed to the delete request
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
