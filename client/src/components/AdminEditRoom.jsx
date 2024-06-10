import React, { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import './AdminEditRoom.css';

function AdminEditRoom() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editedRoom, setEditedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomCollection = collection(db, 'rooms');
        const snapshot = await getDocs(roomCollection);
        const roomList = [];
        snapshot.forEach((roomDoc) => {
          roomList.push({ id: roomDoc.id, ...roomDoc.data() });
        });
        setRooms(roomList);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setEditedRoom({ ...room });
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    try {
      const roomRef = doc(db, 'rooms', selectedRoom.id);
      await updateDoc(roomRef, editedRoom);

      // Update the 'rooms' state with the updated room
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room.id === selectedRoom.id ? editedRoom : room))
      );

      // Update the 'selectedRoom' state with the updated room
      setSelectedRoom(editedRoom);

      console.log('Room updated successfully!');
      alert('Room details updated successfully');
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter rooms based on search query
  const filteredRooms = rooms.filter((rooms) => {
    if (!rooms.room_name) return false;
    return (
      rooms.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddFeature = () => {
    if (editedRoom.room_features) {
      setEditedRoom({
        ...editedRoom,
        room_features: [...editedRoom.room_features, ''],
      });
    } else {
      setEditedRoom({
        ...editedRoom,
        room_features: [''],
      });
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...editedRoom.room_features];
    updatedFeatures.splice(index, 1);
    setEditedRoom({
      ...editedRoom,
      room_features: updatedFeatures,
    });
  };

  const handleUpdateFeature = (index, value) => {
    const updatedFeatures = [...editedRoom.room_features];
    updatedFeatures[index] = value;
    setEditedRoom({
      ...editedRoom,
      room_features: updatedFeatures,
    });
  };

  return (
    <div>
      <div className='EditRoomPage'>
        <div className='RoomListSearch'>
          <div>
            <h2>Search Rooms</h2>
            <br />
            <input
              type="text"
              placeholder="Search by room name"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <br />
          <div>
            <h2>Room List</h2>
            <br />
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
        </div>
  
        <div className='RoomDetailsDisplay'>
          <div>
            <h2>Room Details</h2>
            <div>
              <p>Room Name: <br />{selectedRoom?.room_name}</p>
              <p>Room Size: <br />{selectedRoom?.room_size}</p>
              <p>Room Features: <br /> {selectedRoom?.room_features.join(', ')}</p>
              <p>Room Description: <br /> {selectedRoom?.room_description}</p>
              <p>Room Price: <br /> {selectedRoom?.room_price}</p>
              <p>Room Picture:</p>
              <img
                src={selectedRoom?.room_picture}
                alt="Room"
                style={{ width: '1in', height: '1in' }}
              />
            </div>
          </div>
        </div>
  
        <div className='EditRoomContainer'>
          <div>
            <h2>Edit Room</h2>
            <form onSubmit={handleEditRoom}>
              <div>
                <label>
                  Room Name:
                  <input
                    type="text"
                    value={editedRoom?.room_name || ''}
                    onChange={(e) => setEditedRoom({ ...editedRoom, room_name: e.target.value })}
                  />
                </label>
              </div>
              <div>
                <label>
                  Room Size:
                  <input
                    type="text"
                    value={editedRoom?.room_size || ''}
                    onChange={(e) => setEditedRoom({ ...editedRoom, room_size: e.target.value })}
                  />
                </label>
              </div>
              <div>
                <label>
                  Room Features:
                  <ul>
                    {editedRoom?.room_features &&
                      editedRoom.room_features.map((feature, index) => (
                        <div key={index}>
                          <label>
                            Room Feature {index + 1}:
                            <input
                              type="text"
                              value={feature || ''}
                              onChange={(e) => handleUpdateFeature(index, e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemoveFeature(index)}>
                              Remove
                            </button>
                          </label>
                        </div>
                      ))}
                  </ul>
                  <button type="button" onClick={handleAddFeature}>
                    Add Feature
                  </button>
                </label>
              </div>
              <div>
                <label>
                  Room Description:
                  <input
                    type="text"
                    value={editedRoom?.room_description || ''}
                    onChange={(e) => setEditedRoom({ ...editedRoom, room_description: e.target.value })}
                  />
                </label>
              </div>
              <div>
                <label>
                  Room Price:
                  <input
                    type="text"
                    value={editedRoom?.room_price || ""}
                    onChange={(e) => setEditedRoom({ ...editedRoom, room_price: e.target.value })}
                  />
                </label>
              </div>
              <button type="submit">Update</button>
            </form>
            <Link to="/">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default AdminEditRoom;



{/*    
<p>Room Features:</p>                                                               
  <ul>
    {selectedRoom?.room_features.map((feature, index) => (
    <li key={index}>{feature}</li>))}
</ul> 
        
*/}


{/*
      <label>                                                                           
      Room Picture:
      <input
        type="file"
        onChange={async (e) => {
          if (e.target.files.length > 0) {
          const file = e.target.files[0];
          const storageRef = ref(storage, `room_images/${editedRoom.room_name}`);
          await storageRef.put(file);
          const imageUrl = await getDownloadURL(storageRef);
          setEditedRoom({ ...editedRoom, room_picture: imageUrl });
          }
         }}
      />
  </label>                                                                            

*/}







