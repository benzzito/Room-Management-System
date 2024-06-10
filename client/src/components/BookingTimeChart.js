import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BookingTimeChart = ({ bookingData, loading }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);

  //console.log('TimeData:', bookingData);      //TEST

  useEffect(() => {
    if (loading) {
      // Render "Loading..." while data is not available
      return;
    }

   // console.log('TimeData2:', bookingData);

    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy the existing chart instance
    }

    const ctx = chartRef.current.getContext('2d');

    const timeSlots = Array.from({ length: 13 }, (_, i) => {
      const hour = i + 8;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      return `${displayHour}:00 ${period}`;
    });
    const bookingCounts = timeSlots.map((slot) => bookingData[slot] || 0);

    //console.log('Generated time slots:', timeSlots);
    //console.log('Booking counts:', bookingCounts);
    //console.log('TimeData3:', bookingData);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: timeSlots,
        datasets: [
          {
            label: 'Popular Booking Times',
            data: bookingCounts,
            backgroundColor: 'rgba(35, 90, 151, 0.5)',
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
  }, [bookingData, loading]);

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

export default BookingTimeChart;


