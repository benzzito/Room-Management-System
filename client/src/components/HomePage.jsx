import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useHistory } from 'react-router-dom';
import ProductCard from './ProductCard';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollectionRef = collection(db, 'rooms');
        const roomsSnapshot = await getDocs(roomsCollectionRef);
        const roomsData = roomsSnapshot.docs.map(doc => doc.data());
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h1 className="centered-heading">Rooms</h1>
      <div className="product-card-container">
        {rooms.map((room, index) => (
          <ProductCard
            key={index}
            roomName={room.room_name}
            roomPicture={room.room_picture}
            roomFeatures={room.room_features}
            roomSize={room.room_size}
            roomTenantPrice={room.room_tenant_price}
            status={room.status} 
            onBookNowClick={() => {
              // Handle the "Book Now" button click
              // Redirect to the BookVenue page or perform any other action
              window.location.href = '/book-venue';
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
