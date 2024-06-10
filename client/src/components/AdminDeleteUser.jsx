import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AdminDeleteUser.css';

const AdminDeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
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
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await deleteDoc(userRef);
     
      setUsers((prevUsers) =>           //refresh the user list and remove the deleted user
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
      
      console.log('User deleted successfully!');
      alert('User deleted successfully!');
      setConfirmDelete(false); // Reset the confirmation state
      setSelectedUser(null); // Clear the selected user
    } catch (error) {
      console.error('Error deleting user:', error);
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
    <div className="DeleteUserPage">
      <h1>Delete User Page</h1>
      <div>
        {/* User Search Container */}
        <div>
          <h2>Search Users</h2>
          <input
            type="text"
            placeholder="Search by first or last name"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {/* User List */}
        <div>
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
        {/* User Details */}
        <div className='UserDetails'>
          <h2>User Details</h2>
          <div>
            <p>First Name: {selectedUser?.first_name || ''}</p>
            <p>Last Name: {selectedUser?.last_name || ''}</p>
            <p>Company: {selectedUser?.company || ''}</p>
            <p>Email: {selectedUser?.email || ''}</p>
            <p>User Type: {selectedUser?.user_type || ''}</p>
          </div>
        </div>
        {/* Delete User Button */}
        <div>
          <button onClick={() => setConfirmDelete(true)}>Delete User</button>
        </div>
        {/* Confirmation Dialog */}
        {confirmDelete && (
          <div>
            <p>Are you sure you want to delete this user?</p>
            <button onClick={handleDeleteUser}>Yes</button>
            <button onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        )}
      </div>
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
  
  
};

export default AdminDeleteUser;

