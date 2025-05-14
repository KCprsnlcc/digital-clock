import React, { useState, useEffect } from 'react';
import './DigitalClock.css';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update time every second using setInterval
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format time to always show 2 digits (e.g., 09:04:02)
  const formatTime = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  return (
    <div className="digital-clock">
      <div className="time">
        <span className="hours">{hours}</span>
        <span className="separator">:</span>
        <span className="minutes">{minutes}</span>
        <span className="separator">:</span>
        <span className="seconds">{seconds}</span>
      </div>
    </div>
  );
};

export default DigitalClock; 