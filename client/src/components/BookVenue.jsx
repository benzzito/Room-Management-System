import { db } from '../config/firebase-config';
import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs, doc,limit } from 'firebase/firestore';
import dayjs from 'dayjs';
import SelectBasic from './VenueSelection';
import ValidationBehaviorView from './CalenderView';
import { BookingContext } from './BookingContext';
import ConfirmButton from './ConfirmButton';
import './BookVenue.css';

export default function BookVenue(props) {

  const uid = props.uid;
  const userType = props.userType;
  const [price, setPrice] = useState(null);
  let total_due = 0; 
  const [childData, setChildData] = useState({ v: 'Initial', d: null, sT: null, eT: null, dCreated: null });
  const venue = childData.v;
  const selectedDate = childData.d;
  const start_time = childData.sT;
  const end_time = childData.eT;
  const dCreated = childData.dCreated;


  if (userType === 'Tenant') {
    total_due = 0;
    
  } else if (userType === 'Ad-Hoc') {
    const diffInHours = (end_time - start_time) / (1000 * 60 * 60); // Calculating the difference in hours
    total_due = price * diffInHours;
    
  }
  
  const handleChildData = (childName, data) => {
    setChildData((prevData) => ({ ...prevData, [childName]: data }));
  };

  const fetchRoomReference = async (venue) => {
    try {
      const roomsCollection = collection(db, 'rooms');
      const querySnapshots = await getDocs(query(roomsCollection, where('room_name', '==', venue), limit(1)));
      
      if (!querySnapshots.empty) {
        const roomDoc = querySnapshots.docs[0];
        const venueDocRef = doc(db, 'rooms', roomDoc.id);
               
        return venueDocRef;
      } else {
        console.error('No room found with the specified venue');
        return null;
      }
    } catch (error) {
      console.error('Error getting room reference:', error);
      return null;
    }
  };

  const fetchRoomPrice = async (venue) => {
    try {
      const roomsCollection = collection(db, 'rooms');
      const querySnapshots = await getDocs(query(roomsCollection, where('room_name', '==', venue), limit(1)));
      
      if (!querySnapshots.empty) {
        const roomDoc = querySnapshots.docs[0];
        
        // Extracting room_price from the document data
        const roomData = roomDoc.data();
        const roomPrice = roomData ? roomData.room_price : null;
        
        return roomPrice;
      } else {
        console.error('No room found with the specified venue');
        return null;
      }
    } catch (error) {
      console.error('Error getting room price:', error);
      return null;
    }
  };
  

  const fetchBookingDetails = async (venueDocRef, selectedDate) => {
    try {
      if (venueDocRef) {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('room_id', '==', venueDocRef));
        const snapshot = await getDocs(q);
        const moment = require('moment');
        
        const fetchedBookings = snapshot.docs
          .map((doc) => {
            let createdTimestamp = doc.data().start_time.toDate();
            let firestoreTimestampFormatted = dayjs(createdTimestamp).format('MM-DD-YYYY');
            let selectedDateFormatted = dayjs(selectedDate).format('MM-DD-YYYY');
        
            if (selectedDateFormatted === firestoreTimestampFormatted) {
              return {
                id: doc.id,
                start_time: moment(doc.data().start_time.toDate()).format('h a'),
                end_time: moment(doc.data().end_time.toDate()).format('h a'),
              };
            } else {
              return null;  // return null for items that don't match the condition
            }
          })
          .filter(item => item !== null);  // filter out the null items
        
        
        return fetchedBookings;
      } else {
        console.error('Invalid room reference provided');
        return [];
      }
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  };

  const { bookings, setBookings } = useContext(BookingContext) || {};

  const [roomID, setRoomID] = useState(null); 
  useEffect(() => {
    const fetchData = async () => {
      
        const venueDocRef = await fetchRoomReference(venue);     
        const fetchedBookings = await fetchBookingDetails(venueDocRef, selectedDate);
        const fetchPrice = await fetchRoomPrice(venue);
        setBookings(fetchedBookings);
        setRoomID(venueDocRef);
        setPrice(fetchPrice);
      
    };
    fetchData();
  }, [venue, selectedDate, setBookings]);

   //Log the fetched bookings for debugging purposes
  console.log('Bookings:', bookings,venue, selectedDate);
  console.log("Selected Details", start_time, end_time)

  return (
    <div>
        <div className="steps-container">
          <SelectBasic onSendData={handleChildData} />
          
          <ValidationBehaviorView onSendData={handleChildData} />   
           <ConfirmButton start_time={start_time} end_time= {end_time} roomID = {roomID} created_at ={dCreated} user_id={uid} total_due={total_due}/>
           </div>
    </div>
        );
};

