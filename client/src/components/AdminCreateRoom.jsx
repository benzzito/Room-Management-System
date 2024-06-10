import React, { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase-config'; // Import your Firebase setup
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import './AdminCreateRoom.css';

function CreateRoom() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room_name: '',
    room_size: '',
    room_features: [],
    room_description: '',
    room_price: 0,
    room_picture: null,
  });

  

  useEffect(() => {
    // Query Firestore to get a list of existing rooms
    const fetchRooms = async () => {
      const roomCollection = collection(db, 'rooms');
      const snapshot = await getDocs(roomCollection);
      const roomList = [];
      snapshot.forEach((doc) => {
        roomList.push({ id: doc.id, ...doc.data() });
      });
      setRooms(roomList);
    };

    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, room_picture: file });
  };

  const addFeature = () => {
    // Add an empty feature to the array
    setFormData({ ...formData, room_features: [...formData.room_features, ''] });
  };

  const removeFeature = (index) => {
    // Remove the feature at the specified index
    const updatedFeatures = [...formData.room_features];
    updatedFeatures.splice(index, 1);
    setFormData({ ...formData, room_features: updatedFeatures });
  };

  const handleFeatureChange = (index, value) => {
    // Update the feature at the specified index
    const updatedFeatures = [...formData.room_features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, room_features: updatedFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, `room_images/${formData.room_name}`);
      await uploadBytes(storageRef, formData.room_picture);

      // Get the download URL for the uploaded image
      const imageUrl = await getDownloadURL(storageRef);

      // Create a new room document in Firestore with the form data
      const roomData = {
        room_name: formData.room_name,
        room_size: formData.room_size,
        room_features: formData.room_features.filter((feature) => feature.trim() !== ''), // Remove empty features
        room_description: formData.room_description,
        room_price: parseFloat(formData.room_price),
        room_picture: imageUrl, // Set the download URL of the uploaded image
        created_at: new Date(),
        status: 'available', // You can set the initial status as per your requirements
      };

      const roomCollection = collection(db, 'rooms');
      await addDoc(roomCollection, roomData);

      // Clear the form after submission
      setFormData({
        room_name: '',
        room_size: '',
        room_features: [],
        room_description: '',
        room_price: 0,
        room_picture: null,
      });

      alert('Room added successfully!');
    } catch (error) {
      console.error('Error adding room: ', error);
      alert('Failed to add room. Please try again.');
    }
  };

  return (
    
    <div className='CreateRoomMenu'>
      {/* List of current rooms */}

      <div className='RoomsList'>
        <h2>List of current rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.room_name}</li>
        ))}
      </ul>
      </div>
      {/* Add new room to list */}

      <div className='AddRoomForm'>
          <h3>Add new room to list</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name:</label>
          <br />
          <input
            type="text"
            name="room_name"
            value={formData.room_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Room Capacity:</label>
          <br />
          <input
            type="text"
            name="room_size"
            value={formData.room_size}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Room Features:</label>
          <br />
          {formData.room_features.map((feature, index) => (
            <div key={index}>
              <input
                type="text"
                name={`room_features_${index}`}
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
              />
              <button type="button" onClick={() => removeFeature(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addFeature}>
            Add Feature
          </button>
        </div>

        <div>
          <label>Room Description:</label>
          <br />
          <input
            type="text"
            name="room_description"
            value={formData.room_description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Room Price:</label>
          <br />
          <input
            type="text"
            name="room_price"
            value={formData.room_price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Upload Room Photo:</label>
          <br />
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </div>

        <button type="submit">Create Room</button>
        <Link to="/">Back to Dashboard</Link>
      </form>
      </div>

    </div>

  );
}

export default CreateRoom;

