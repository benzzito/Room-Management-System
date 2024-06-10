import React, { createContext, useState } from 'react';

//Booking Context
export const BookingContext = createContext();
// Create a provider component
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  return (
    // Provide the state and updater function to the components that use this context
    <BookingContext.Provider value={{ bookings, setBookings }}>
      {children}
    </BookingContext.Provider>
  );
};
