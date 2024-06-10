import { db } from '../config/firebase-config';
import React, { useState, } from "react";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import { collection, addDoc } from 'firebase/firestore';
import { query, where, getDocs } from 'firebase/firestore';

export default function ConfirmButton(props) {
  const confirmPos = {
    position: "fixed",
    top: "570px",
    right: "580px",
  };
  
  const startDate = new Date(props.start_time);
  const endDate = new Date(props.end_time);
  const dateCreated = new Date(props.created_at);

  const book = {
      user_id: props.user_id,
      start_time: startDate,
      end_time: endDate,
      room_id: props.roomID,
      created_at: dateCreated,
      total_due: props.total_due
  };
  
  

  const [isLoading, setIsLoading] = useState(false);


  const createBooking = async () => {
    try {
        const bookingsCollectionRef = collection(db, 'bookings');

        // Fetch bookings where start_time falls within the new booking's time range
    const startsWithinQuery = query(
      bookingsCollectionRef,
      where("room_id", "==", props.roomID),
      where("start_time", "<", endDate), // starts before new booking ends
      where("start_time", ">=", startDate) // and after new booking starts
  );
  const startsWithinSnapshot = await getDocs(startsWithinQuery);
  const startsWithinBookings = startsWithinSnapshot.docs.map(doc => doc.data());

  // Fetch bookings where end_time falls within the new booking's time range
  const endsWithinQuery = query(
      bookingsCollectionRef,
      where("room_id", "==", props.roomID),
      where("end_time", ">", startDate), // ends after new booking starts
      where("end_time", "<=", endDate) // and before or when new booking ends
  );
  const endsWithinSnapshot = await getDocs(endsWithinQuery);
  const endsWithinBookings = endsWithinSnapshot.docs.map(doc => doc.data());

  // Fetch bookings that encompass the new booking's time range entirely
  const overlapsEntirelyBookings = startsWithinBookings.filter(booking => {
      return booking.start_time.toDate() < startDate && booking.end_time.toDate() > endDate;
  });
  const isTimeWithinRange = (time) => {
    const hour = time.getHours();
    return hour >= 8 && hour < 21; // 8 AM to strictly before 9 PM
};

if (startsWithinBookings.length>0||
  endsWithinBookings.length>0||
  overlapsEntirelyBookings.length > 0) {
  alert("Selected time slot is already booked. Please choose another time.");
console.log("Ends",endsWithinBookings )
  setIsLoading(false);
  return;
}
            // Check if both start and end times are within the desired range
          if (!isTimeWithinRange(startDate) || !isTimeWithinRange(endDate)) {
            alert("Please select a time between 8 AM and 9 PM.");
            return;
        }

        // Check if start_time is lower than end_time
        if (startDate >= endDate) {
            alert("Start time must be earlier than the end time.");
            return;
        }

        // If there's no overlap, proceed with the booking
        await addDoc(bookingsCollectionRef, book);
        alert("Booking successfully created! Go to Manage Bookings to see your Details");

    } catch (error) {
        console.error('Error writing new booking to database', error);
        alert("Booking creation failed");
    } finally {
        // Whether successful or there's an error, set isLoading to false
        setIsLoading(false);
    }
};


  //console.error('trying', book);


 


  const handleButtonClick = () => {
    setIsLoading(true);
    // Simulate some asynchronous task
    createBooking();
  };

  return (
    <div style={confirmPos}>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button onClick={handleButtonClick} disabled={isLoading}>
          {isLoading ? "confirming" : "Submit Booking"}
          
        </Button>

       
      </Box>

    </div>
  );
}
