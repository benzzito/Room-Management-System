import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, getDocs} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import ManageBookings from './ManageBookings';
import './AdminEditRoom.css';//search style

const AdminManageBookings = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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

  useEffect(() => {
    console.log("Selected User:", selectedUser.id);
}, [selectedUser]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const matchingUser = users.find((user) => {
    if (!user.email) return false;
  
    // Transform the email to lowercase
    const userLowercaseEmail = user.email.toLowerCase();
  
    // Transform the search query to lowercase
    const searchLowercaseQuery = searchQuery.toLowerCase();
  
    // Check if the user's email includes the search query
    return userLowercaseEmail.includes(searchLowercaseQuery);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
    <div >
    <div style={{ paddingBottom: "10px", color: "white", fontSize: "24px" }}>
      <h1>Manage User Bookings</h1>
    </div>

      <div className='EditRoomPage'>
        <div className='RoomListSearch'>
          <h2>Search Users</h2>
          <input
            type="text"
            placeholder="Search by email"
            value={searchQuery}
            onChange={handleSearch}
          />
          <div>
          {searchQuery ? (
            // Display the first matching user when a search query is entered
            matchingUser ? (
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedUser && selectedUser.id === matchingUser.id}
                    onChange={() => handleUserSelect(matchingUser)}
                  />
                  {matchingUser.email}
                </label>
              </div>
            ) : (
              <p>No matching user found.</p>
            )
          ) : (
            // Display empty or no user when no search query is entered
            <p>Enter a name to search for a user.</p>
          )}
        </div>

        </div>
        
       
    <div className="scrollable-container">
        <h2>User Bookings </h2>
        {selectedUser.id && <ManageBookings userId={selectedUser.id} />}
    </div>

        
      </div>
    </div>
    <div>
          <Link to="/">Back to Dashboard</Link>
        </div>
    </div>
  );
};

export default AdminManageBookings;
