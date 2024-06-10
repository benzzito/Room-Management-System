import React, {  useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from 'dayjs';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Typography from '@mui/joy/Typography';
import './BookVenue.css';


const calendarPosition = {
  position: "fixed",
  top: "180px",
  right: "439px",
};

const DatePosition = {
  position: "fixed",
  top: "120px",
  right: "495px",
};
const DateP = {
  position: "fixed",
  top: "50px",
  right: "575px",
};

const startTimePos = {
  width: "200px",
  height: "60px",
  position: "fixed",
  top: "120px",
  right: "145px",
};
const startPos = {
  width: "200px",
  height: "60px",
  position: "fixed",
  top: "60px",
  right: "140px",
};
const endTimePos = {
  width: "200px",
  height: "60px",
  position: "fixed",
  top: "200px",
  right: "145px",
};

const today = dayjs();

  function ValidationBehaviorView({onSendData}) {

    const [start, setStart] = React.useState(dayjs('0000-00-00'));
    const [end, setEnd] = React.useState(dayjs('0000-00-00'));

    const handleStartTime = (newValue) => {
      
      onSendData('sT',newValue);
    }

    const handleEndTime = (newValue) => {
      
      onSendData('eT',newValue);
    }

    
  // State to hold the selected date

  const [value, setValue] = useState(today);
  // Function to handle date selection
  
    const handleDateSelection = (newValue) => {
    const selectedDateFormatted = dayjs(newValue).format('MM-DD-YYYY'); 
    setValue(newValue); // You might need to adjust this line based on the format newDate is received
    onSendData('d',selectedDateFormatted);
    onSendData('dCreated',today);
    setStart(newValue);
    setEnd(newValue);
  };

  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div className='step2'>
      <div style={DateP}><Typography level="h2">STEP 2</Typography></div>

      <div style={calendarPosition}>
        
        {/* Pass the selected date to DateCalendar and provide the handleDateSelection function */}
        <DateCalendar  minDate={today} value={value} onChange={(handleDateSelection)} />
      </div>

      <div style={DatePosition}>     
        <DateField label="Select Date from Calender Below" value={value} />
        
      </div>
      </div>
      </div>
      <div style={startPos}><Typography level="h2">STEP 3</Typography></div>

      <DemoContainer components={["TimePicker"]}>
        <div style={startTimePos}>
        <TimePicker 
            label="Start Time" 
            value={start}
            onChange={(handleStartTime)}
            views={['hours']}
          />

        </div>
        
        <div style={endTimePos}>
          <TimePicker 
            label="End Time" 
            value={end}
            onChange={(handleEndTime)} 
            views={['hours']}
          />
        </div>

      </DemoContainer>
    </LocalizationProvider>

  );
}
export default ValidationBehaviorView;




