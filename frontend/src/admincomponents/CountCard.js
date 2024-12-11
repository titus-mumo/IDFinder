import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // Ensure react-icons is installed

export const CountCard = ({ name, count }) => {
  const [minutesAgo, setMinutesAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesAgo((prev) => prev + 1);
    }, 60000); // 60000 ms = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Set dynamic colors based on count value
  const bgColor = count > 50 ? 'bg-green-500' : 'bg-gray-800'; // Change card color based on count

  return (
    <div
      className={`${bgColor} rounded-lg p-5 m-3 shadow-lg hover:shadow-2xl transition-shadow duration-300`}
      style={{
        width: '200px',
        height: 'auto', // Adjust height dynamically
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className='flex items-center justify-between flex-col lg:flex-row'>
        <p
          className={`text-sm text-white font-medium flex items-center
            md:text-base  // Medium screens
            lg:text-xl`} // Large screens
        >
          <FaCheckCircle className={`mr-1 md:text-base lg:text-xl`} /> {/* Icon size changes */}
          {name}
        </p>
        <span className='text-xs text-gray-200'>
          {minutesAgo === 0 ? 'Updated now' : `Updated ${minutesAgo} minute(s) ago`}
        </span>
      </div>
      <p className={`text-3xl font-bold text-white md:text-4xl lg:text-5xl`}>{count}</p>
    </div>
  );
};
