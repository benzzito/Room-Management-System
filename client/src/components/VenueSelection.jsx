import React, { useState, useContext, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BookingContext } from './BookingContext';
import moment from 'moment'; // Import moment at the top
import Typography from '@mui/joy/Typography';

const vSelectPosition = {
    position: "fixed",
    top: "95px",
    right: "876px",
    
  };
  const vSelectP = {
    position: "fixed",
    top: "45px",
    right: "960px",
    
  };
  const Avail = {
    position: "fixed",
    top: "160px",
    right: "880px",
    width:"230px",
    height: "300px"
  };
   
   
   export default function SelectBasic({onSendData}) {
  // Create a state variable to store the selected option
  const [selectedOption, setSelectedOption] = useState('');
  const [rooms, setRooms] = useState([]);

  const { bookings } = useContext(BookingContext)|| {}; // Access bookings state here without props
  // Function to handle the change event when an option is selected
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    onSendData('v',event.target.value);
  };

  useEffect(() => {
    // Fetch rooms from Firestore
    const fetchRooms = async () => {
      const roomsCollection = collection(db, 'rooms');
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsList = roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsList);
    };
    
    fetchRooms();
}, []);


function checkAvailability(time) {
  if (!Array.isArray(bookings)) {
    console.error('bookings is not iterable');
    // Handle error gracefully, e.g., by returning a default value or throwing an error
    return;
  }

  for (const booking of bookings) {
    const bookingStartTime = moment(booking.start_time, 'h:mm a');
    const bookingEndTime = moment(booking.end_time, 'h:mm a');
    const formattedTime = moment(time, 'h:mm a');
  
    if (formattedTime.isSame(bookingStartTime) || formattedTime.isSame(bookingEndTime) || (formattedTime.isAfter(bookingStartTime) && formattedTime.isBefore(bookingEndTime))) {
      return 'Unavailable';
    }
  }
  return 'Available';
}

  

  function createData(time, status) {
    return { time, status };
  }

  const rows = [
    '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'
  ].map(time => createData(time, checkAvailability(time)));
  
  //Room visibility feature

return (
<>
  <div style={vSelectP}><Typography level="h2">STEP 1</Typography></div>
    <div 
   

    style={vSelectPosition}>
        <FormControl sx={{ m: 1, minWidth: 220 }}> 
        <InputLabel id="demo-simple-select-autowidth-label">Select a Venue</InputLabel>

      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        
        value={selectedOption}
        label="Select a Venue"
        onChange={handleOptionChange}
      >
        {rooms.map((room) => (
          <MenuItem key={room.id} value={room.room_name}>
            {room.room_name}
          </MenuItem>
        ))}
      </Select>
      </FormControl>

    

      <TableContainer style ={Avail} component={Paper}>
    

      <Table aria-label="time-availability">
     
        <TableBody>


          {rows.map((row) => (
            
           
            <TableRow
              key={row.time}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.time}
              </TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
            
          ))}
           
        </TableBody>
       
      </Table>
      
    </TableContainer>
    
    </div>
    </>
  );
}
