import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getDoc, DocumentReference } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import BookingTimeChart from './BookingTimeChart';
import RoomChart from './RoomChart';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [bookingData, setBookingData] = useState({});
  const [roomData, setRoomData] = useState({});
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const bookingCounts = {};
    const roomCounts = {};
  
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
  
      // Create an array of promises for room data retrieval
      const roomDocPromises = [];
  
      querySnapshot.forEach(async (doc) => {
        const { start_time, room_id } = doc.data();
  
        // Convert Firestore Timestamp to JavaScript Date
        const startTime = start_time.toDate();
  
        if (startTime instanceof Date) {
          const startTimeSlot = formatTimeSlot(startTime);
          bookingCounts[startTimeSlot] = (bookingCounts[startTimeSlot] || 0) + 1;
  
          if (room_id instanceof DocumentReference) {
            roomDocPromises.push(getDoc(room_id));
          }
        } else {
          // Handle the case where the Timestamp couldn't be converted to a Date
          console.error('Invalid start_time:', start_time);
        }
      });
  
      // Wait for all room data retrieval to complete
      const roomDocs = await Promise.all(roomDocPromises);
  
      roomDocs.forEach((roomDoc) => {
        if (roomDoc.exists()) {
          const roomNameData = roomDoc.data();
          const roomName = roomNameData.room_name;
  
          if (roomName) {
            roomCounts[roomName] = (roomCounts[roomName] || 0) + 1;
          }
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  
    console.log('bookingCounts:', bookingCounts); // TEST
    console.log('roomCounts:', roomCounts); // TEST
  
    setBookingData(bookingCounts);
    setRoomData(roomCounts);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  },[]);

  function formatTimeSlot(time) {
    if (time instanceof Date) {
      const hour = time.getHours();
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      return `${displayHour}:00 ${period}`;
    } else {
      // Handle the case where `start_time` is not a valid Date
      console.error('Invalid start_time:', time);
      return 'Unknown';
    }
  }

  return (
    <div className="AdminDashboard">
      <h1>Dashboard</h1>
      
        <div className="ManageRoomsContainer">
          <h2>Manage Rooms</h2>
          ,<br />
          <ul className="ManageRoom-links">
            <li><Link to="/admin-create-room">Create New Room</Link></li>
            <li><Link to="/admin-edit-room">Edit Existing Room</Link></li>
            <li><Link to="/admin-delete-room">Delete Room</Link></li>
          </ul>
        </div>

        <div className="ManageUsersContainer">
          <h3>Manage Users</h3>
          ,<br />
          <ul className="ManageUser-links">
            <li><Link to="/admin-create-user">Create New User</Link></li>
            <li><Link to="/admin-edit-user">Edit Existing User</Link></li>
            <li><Link to="/admin-delete-user">Delete User</Link></li>
          </ul>
        </div>
      

       <div className='LiveAnalyticsContainer'>
        <h4>Live Analytics</h4>
        <br />
        <div className='Charts'>
          
          <div className="BookingTimeChart">
          <h5>Popular Booking Times</h5>
          <BookingTimeChart bookingData={bookingData} loading={loading} />
         </div>
         <div className="RoomChart"> {/* TEST */}
          <h5>Popular Room Choices</h5>
          <RoomChart roomData={roomData} loading={loading}/>
         </div>
        
        </div>
       </div>
        
      </div>
    
  );
};

export default AdminDashboard;
