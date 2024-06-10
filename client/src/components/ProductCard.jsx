import React from 'react';
import './ProductCard.css';

const ProductCard = ({
  roomName,
  roomPicture,
  roomFeatures,
  roomSize,
  roomTenantPrice,
  status, // Add status as a prop
  onBookNowClick
}) => {
  return (
    
    
    <div className="product-card">
      <img src={roomPicture} alt={roomName} className="product-card-image" />
      <div className="product-card-content">
        <h3>{roomName}</h3>
        <p>Features: {roomFeatures ? roomFeatures.join(', ') : ''}</p>
        <p>Size: {roomSize}</p>
        <p>Status: {status}</p> {/* Display status */}
        <p>Tenant Price: {roomTenantPrice}</p>
        <button onClick={onBookNowClick}>Book Now</button>
      </div>
    </div>
    
   
  );
};

export default ProductCard;
