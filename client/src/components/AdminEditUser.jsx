import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AdminEditUser.css';

const AdminEditUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch users from Firestore and update the 'users' state.
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      
      await updateDoc(userRef, editedUser);

      // Update the 'users' state with the updated user
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === selectedUser.id ? editedUser : user))
      );

      // Update the 'selectedUser' state with the updated user
      setSelectedUser(editedUser);

      console.log('User updated successfully!');
      alert('User details updated successfully');

    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!user.first_name || !user.last_name) return false;
    return (
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="AdminEditUser">
      <h1>Edit User Page</h1>
      <div className="container">
        <div className="userListContainer">
          {/* User Search */}
          <div className="search-container">
            <h2>Search Users</h2>
            <input
              type="text"
              placeholder="Search by first or last name"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <br />
          {/* User List */}
          <div className="container">
            <h2>User List</h2>
            <ul>
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedUser && selectedUser.id === user.id}
                      onChange={() => handleUserSelect(user)}
                    />
                    {user.first_name} {user.last_name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* User Details */}
        <div className="details-display-container">
          <h2>User Details</h2>
          <div>
            <p>First Name: {selectedUser?.first_name}</p>
            <p>Last Name: {selectedUser?.last_name}</p>
            <p>Company: {selectedUser?.company}</p>
            <p>Email: {selectedUser?.email}</p>
            <p>User Type: {selectedUser?.user_type}</p>
          </div>
        </div>
        {/* Edit User Form */}
        <div className="edit-user-container">
          <h2>Edit User</h2>
          <form onSubmit={handleEditUser}>
            <label>
              First Name:
              <input
                type="text"
                value={editedUser?.first_name || ""}
                onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={editedUser?.last_name || ""}
                onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })}
              />
            </label>
            <label>
              Company:
              <input
                type="text"
                value={editedUser?.company || ""}
                onChange={(e) => setEditedUser({ ...editedUser, company: e.target.value })}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={editedUser?.email || ""}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              />
            </label>
            <label>
              User Type:
              <select
                value={editedUser?.user_type || ""}
                onChange={(e) => setEditedUser({ ...editedUser, user_type: e.target.value })}
              >
                <option value="">Select User Type</option>
                <option value="Admin">Admin</option>
                <option value="Tenant">Tenant</option>
                <option value="Ad-hoc">Ad-hoc</option>
              </select>
            </label>
            <button type="submit">Update</button>
          </form>
          <Link to="/">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );  

};

export default AdminEditUser;

