import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RoomChart = ({ roomData, loading }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);

  //console.log('RoomData:', roomData);      //TEST

  useEffect(() => {
    if (loading) {
      // Render "Loading..." while data is not available
      return;
    }

    if (Object.keys(roomData).length === 0) {
      return;
    }

    console.log('roomData2:', roomData);     //TEST

    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy the existing chart instance
    }

    const ctx = chartRef.current.getContext('2d');

    const roomNames = Object.keys(roomData);
    const bookingCounts = roomNames.map((roomName) => roomData[roomName]);

    // Generate random colors for bars
    const barColors = roomNames.map(() => getRandomColor());

    console.log('RoomData3:', roomData);      //TEST
    console.log('roomNames:', roomNames); 
    console.log('bookingCounts:', bookingCounts); 

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: roomNames,
        datasets: [
          {
            label: 'Room Bookings',
            data: bookingCounts,
            backgroundColor: barColors, // Use different colors for bars
            borderColor: 'rgba(35, 90, 151, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [roomData, loading]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <canvas ref={chartRef} width="400" height="200" />
      )}
    </div>
  );
};

export default RoomChart;

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
