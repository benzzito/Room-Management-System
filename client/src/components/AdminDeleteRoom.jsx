import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AdminDeleteRoom.css';

const AdminDeleteRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch rooms from Firestore and update the 'rooms' state.
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, 'rooms');
        const querySnapshot = await getDocs(roomsCollection);
        const roomsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    try {
      const roomRef = doc(db, 'rooms', selectedRoom.id);
      await deleteDoc(roomRef);

      setRooms((prevRooms) =>
        prevRooms.filter((room) => room.id !== selectedRoom.id)
      );

      console.log('Room deleted successfully!');
      alert('Room deleted successfully!');
      setConfirmDelete(false); // Reset the confirmation state
      setSelectedRoom(null); // Clear the selected room
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter rooms based on search query
  const filteredRooms = rooms.filter((room) => {
    if (!room.room_name) return false;
    return room.room_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="DeleteRoomPage">
      <h1>Delete Room </h1>
      <div>
        {/* Room Search */}
        <div>
          <h2>Search Rooms</h2>
          <input
            type="text"
            placeholder="Search by room name"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {/* Room List */}
        <div>
          <h2>Room List</h2>
          <ul>
            {filteredRooms.map((room) => (
              <li key={room.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRoom && selectedRoom.id === room.id}
                    onChange={() => handleRoomSelect(room)}
                  />
                  {room.room_name}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {/* Room Details */}
        <div>
          <h2>Room Details</h2>
          <div>
            <p><strong>Room Name:</strong> {selectedRoom?.room_name}</p>
            <p><strong>Room Size:</strong> {selectedRoom?.room_size}</p>
            <p><strong>Room Features:</strong> {selectedRoom?.room_features.join(', ')}</p>
            <p><strong>Room Description:</strong> {selectedRoom?.room_description}</p>
            <p><strong>Room Price:</strong> {selectedRoom?.room_price}</p>
            <p><strong>Room Picture:</strong></p>
            <img
              src={selectedRoom?.room_picture}
              alt="Room"
              style={{ width: '1in', height: '1in' }}
            />
          </div>
        </div>
        {/* Delete Room Button */}
        <div>
          <button onClick={() => setConfirmDelete(true)}>Delete Room</button>
        </div>
        {/* Confirmation Dialog */}
        {confirmDelete && (
          <div>
            <p>Are you sure you want to delete this room?</p>
            <button onClick={handleDeleteRoom}>Yes</button>
            <button onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        )}
      </div>
      
               <Link to="/" className="EditRoomPage-a">
                Back to Dashboard
                </Link>
    </div>
  );
  
};

export default AdminDeleteRoom;

