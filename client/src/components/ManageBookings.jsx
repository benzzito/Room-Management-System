import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Update the path based on your configuration
import { doc, deleteDoc } from 'firebase/firestore'; // Add this to your imports
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

function ManageBookings({userId}) {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleCancelBooking = async (bookingId) => {
      // Optional: Add a confirmation prompt
      const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
      if (!confirmCancel) return;

      // Delete the booking from Firestore
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);

      // Refresh or filter out the canceled booking from local state (upcomingBookings)
      const updatedBookings = upcomingBookings.filter(booking => booking.id !== bookingId);
      setUpcomingBookings(updatedBookings);
      // Refresh or filter out the canceled booking from local state (pastBookings)
      const updatedBooking = pastBookings.filter(booking => booking.id !== bookingId);
      setPastBookings(updatedBooking);
  }

const fetchRooms = async () => {
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    
    const roomsMap = {};
        roomsSnapshot.forEach(roomDoc => {
        roomsMap[roomDoc.id] = roomDoc.data().room_name;
    });
    return roomsMap;
};
console.log(userId)

    useEffect(() => {
        const fetchBookings = async () => {
          try {
              const roomsMap = await fetchRooms(); // Fetch rooms and create map

              const bookingsQuery = query(
                  collection(db, 'bookings'),
                  where('user_id', '==', userId)
              );
      
              const bookingSnapshot = await getDocs(bookingsQuery);
      
              const userUpcomingBookings = [];
              const userPastBookings = [];
      
              bookingSnapshot.forEach((doc) => {
                  const booking = {
                      id: doc.id,
                      ...doc.data()
                  };
                  const roomIdStr = booking.room_id.id || booking.room_id; // Assuming room_id could be a reference or a string
    
                  // Looking up the room name using the room_id string
                  booking.room_name = roomsMap[roomIdStr] || 'Room not found';

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  const bookingDate = booking.start_time.toDate();
                  bookingDate.setHours(0, 0, 0, 0);
                  if (bookingDate >= today) {
                    userUpcomingBookings.push(booking);
                }  else{
                    userPastBookings.push(booking);
                  } 
                                
              });
                setUpcomingBookings(userUpcomingBookings);
                setPastBookings(userPastBookings);
            
            
          } catch (error) {
          setError("Failed to fetch bookings. Please try again later.");
          } finally {
          setLoading(false);
          }
        }

        fetchBookings();
        
    }, [userId]);
    if (loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>{error}</div>;
  }

  return (
    
    <Box sx={{ width: '800px', bgcolor: 'background.paper', padding: 2 }}>
      <List component="nav">
        <ListItemText primary="Upcoming Bookings" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 2 }} />
        {upcomingBookings.map((booking, idx) => {
          //time conversions
          const startTime = new Date(booking.start_time.toDate());
          const endTime = new Date(booking.end_time.toDate());
          endTime.setMinutes(0);
          startTime.setMinutes(0);
          const startDateStr = new Date(booking.start_time.toDate()).toLocaleDateString(undefined,{ month: 'long', day: '2-digit', year: 'numeric' });
          let startTimeStr;
          let endTimeStr;

          if (startTime.getHours() === 12) {
              startTimeStr = '12:' + startTime.getMinutes().toString().padStart(2, '0') + ' PM';

            } else {
              startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            }
            
          if (endTime.getHours() === 12) {
            endTimeStr = '12:' + endTime.getMinutes().toString().padStart(2, '0') + ' PM';

          } else {
            endTimeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

          }
          const total_due = booking.total_due;

          return (
            <ListItemButton key={idx} sx={{ width: '740px', margin: '10px 10px', borderRadius: 2, bgcolor: '#A3BCFE', padding: 1 }}>
                <ListItemText 
                    primary={`📍 ${booking.room_name}`}
                    primaryTypographyProps={{ style: { fontSize: '1.1em' } }} 
                    secondary={
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <EventIcon fontSize="small" style={{ marginRight: '10px' }} />
                                <span>{`Date: ${startDateStr}`}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <AccessTimeIcon fontSize="small" style={{ marginRight: '10px' }} />
                                <span>{`Start Time: ${startTimeStr}`}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <AccessTimeIcon fontSize="small" style={{ marginRight: '10px' }} />
                                <span>{`End Time: ${endTimeStr}`}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <MonetizationOnIcon fontSize="small" style={{ marginRight: '10px' }} />
                                <span>{`Total Due: R ${total_due.toFixed(2)}`}</span>
                            </div>

                            <Button 
                                onClick={() => handleCancelBooking(booking.id)} 
                                variant="outlined" 
                                startIcon={<DeleteIcon />}
                                color="primary"
                                style={{ backgroundColor: '#FFF', 
                                color: '#757575',
                                padding: '5px 15px',
                                border: '1px solid #ccc',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                Cancel
                            </Button>
                        </div>

                     
                        </>}
                />
            </ListItemButton>
        );
})}
      </List>
      <Divider sx={{ marginY: 2 }} />
      <List component="nav">
        <ListItemText primary="Past Bookings" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 2 }} />
        {pastBookings.map((booking, idx) => {
          const startTime = new Date(booking.start_time.toDate());
          const endTime = new Date(booking.end_time.toDate());
          endTime.setMinutes(0);
          startTime.setMinutes(0);
          const startDateStr = new Date(booking.start_time.toDate()).toLocaleDateString(undefined,{ month: 'long', day: '2-digit', year: 'numeric' });
          let startTimeStr;
          let endTimeStr;

          if (startTime.getHours() === 12) {
              startTimeStr = '12:' + startTime.getMinutes().toString().padStart(2, '0') + ' PM';

            } else {
              startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            }
            
          if (endTime.getHours() === 12) {
            endTimeStr = '12:' + endTime.getMinutes().toString().padStart(2, '0') + ' PM';

          } else {
            endTimeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

          }
          const total_due = booking.total_due;
          return (
            <ListItemButton key={idx} sx={{ width: '740px', margin: '10px 10px', borderRadius: 2, bgcolor:  'grey.200', padding: 1 }}>
                <ListItemText 
                    primary={`📍 ${booking.room_name}`}
                    primaryTypographyProps={{ style: { fontSize: '1.1em' } }} 
                    secondary={
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <EventIcon fontSize="small" style={{ marginRight: '10px' }} />
                                <span>{`Date: ${startDateStr}`}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <AccessTimeIcon fontSize="small" style={{ marginRight: '10px' }} />
                                <span>{`Start Time: ${startTimeStr}`}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <AccessTimeIcon fontSize="small" style={{ marginRight: '10px' }} />
                                <span>{`End Time: ${endTimeStr}`}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <MonetizationOnIcon fontSize="small" style={{ marginRight: '10px' }} />
                                <span>{`Total Due: R ${total_due.toFixed(2)}`}</span>
                            </div>

                            <Button 
                                onClick={() => handleCancelBooking(booking.id)} 
                                variant="outlined" 
                                startIcon={<DeleteIcon />}
                                color="primary"
                                style={{ backgroundColor: '#FFF', 
                                color: '#757575',
                                padding: '5px 15px',
                                border: '1px solid #ccc',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                Delete
                            </Button>
                        </div>

                     
                        </>}
                />
            </ListItemButton>
        );
})}
      </List>
    </Box>
  );

}

export default ManageBookings;
