import React, { useState, useEffect } from 'react';
import './DigitalClock.css';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [timezone, setTimezone] = useState<string>('local');
  
  // List of common timezones
  const timezones = [
    { label: 'Local', value: 'local' },
    { label: 'UTC', value: 'UTC' },
    { label: 'New York (EST/EDT)', value: 'America/New_York' },
    { label: 'London (GMT/BST)', value: 'Europe/London' },
    { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
    { label: 'Sydney (AEST/AEDT)', value: 'Australia/Sydney' },
  ];

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

  const getTimeInTimezone = (): Date => {
    if (timezone === 'local') {
      return new Date();
    }
    
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    
    if (timezone === 'UTC') {
      return utcDate;
    }
    
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  };

  // Get formatted time based on current settings
  const getFormattedTime = () => {
    const currentTime = timezone === 'local' ? time : getTimeInTimezone();
    
    let hours = currentTime.getHours();
    const minutes = formatTime(currentTime.getMinutes());
    const seconds = formatTime(currentTime.getSeconds());
    
    // Format hours based on 12/24 hour setting
    let ampm = '';
    if (!is24Hour) {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12 for 12-hour format
    }
    
    const formattedHours = formatTime(hours);
    
    return {
      hours: formattedHours,
      minutes,
      seconds,
      ampm
    };
  };

  // Format the date as "Day, Month DD, YYYY"
  const getFormattedDate = () => {
    const currentTime = timezone === 'local' ? time : getTimeInTimezone();
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const { hours, minutes, seconds, ampm } = getFormattedTime();

  return (
    <div className="digital-clock">
      <div className="clock-container">
        <div className="settings">
          <button 
            className={`format-toggle ${is24Hour ? 'active' : ''}`} 
            onClick={() => setIs24Hour(!is24Hour)}
          >
            {is24Hour ? '24H' : '12H'}
          </button>
          <button 
            className={`date-toggle ${showDate ? 'active' : ''}`} 
            onClick={() => setShowDate(!showDate)}
          >
            {showDate ? 'Hide Date' : 'Show Date'}
          </button>
          <select 
            value={timezone} 
            onChange={(e) => setTimezone(e.target.value)}
            className="timezone-select"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="time">
          <span className="hours">{hours}</span>
          <span className="separator">:</span>
          <span className="minutes">{minutes}</span>
          <span className="separator">:</span>
          <span className="seconds">{seconds}</span>
          {!is24Hour && <span className="ampm">{ampm}</span>}
        </div>
        
        {showDate && (
          <div className="date">
            {getFormattedDate()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalClock; 