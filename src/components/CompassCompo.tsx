import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// Define the type for the sensor data you'll be sending to the backend
interface MovementData {
  heading: number;
}

const PhoneCompass: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null); // State to hold the heading value
  const [socket, setSocket] = useState<Socket | null>(null); // Socket instance to connect with the backend

  useEffect(() => {
    // Establish WebSocket connection
    const socketConnection = io('http://your-server-url'); // Replace with your backend URL
    setSocket(socketConnection);

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if ('Magnetometer' in window) {
      const sensor = new Magnetometer();

      // Add event listener for reading changes
      sensor.addEventListener('reading', () => {
        if (socket) {
          // Send compass heading data to the backend
          socket.emit('movement', {
            heading: sensor.x, // Send the x-axis magnetic data (compass heading)
          });
        }
        setHeading(sensor.x); // Update the heading state with the x-axis value
      });

      sensor.start(); // Start the sensor
    } else {
      console.log("Magnetometer is not supported in this browser.");
    }
  }, [socket]); // Re-run if socket changes

  return (
    <div>
      <h1>Compass Heading: {heading !== null ? heading : 'Waiting for sensor...'}</h1>
      
    </div>
  );
};

export default PhoneCompass;
