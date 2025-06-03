import React, { useState, useEffect, useContext } from 'react';
import './DigitalClock.css';
import { ThemeContext } from '../App';
import { DateTime } from 'luxon';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(true);
  const [showSeconds, setShowSeconds] = useState<boolean>(true);
  const [timezone, setTimezone] = useState<string>('local');
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // List of common timezones with enhanced display names
  const timezones = [
    { label: 'LOCAL', value: 'local' },
    { label: 'UTC', value: 'UTC' },
    { label: 'NEW YORK', value: 'America/New_York', displayName: 'New York' },
    { label: 'LONDON', value: 'Europe/London', displayName: 'London' },
    { label: 'TOKYO', value: 'Asia/Tokyo', displayName: 'Tokyo' },
    { label: 'SYDNEY', value: 'Australia/Sydney', displayName: 'Sydney' },
    { label: 'PARIS', value: 'Europe/Paris', displayName: 'Paris' },
    { label: 'DUBAI', value: 'Asia/Dubai', displayName: 'Dubai' },
    { label: 'SINGAPORE', value: 'Asia/Singapore', displayName: 'Singapore' },
    { label: 'LOS ANGELES', value: 'America/Los_Angeles', displayName: 'Los Angeles' },
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

  const getTimeInTimezone = (): DateTime => {
    if (timezone === 'local') {
      return DateTime.local();
    }
    
    if (timezone === 'UTC') {
      return DateTime.utc();
    }
    
    return DateTime.local().setZone(timezone);
  };

  // Get formatted time based on current settings using Luxon
  const getFormattedTime = () => {
    const currentTime = getTimeInTimezone();
    
    let hours: number;
    let ampm = '';
    
    if (is24Hour) {
      hours = currentTime.hour;
    } else {
      hours = currentTime.hour % 12 || 12; // Convert 0 to 12 for 12-hour format
      ampm = currentTime.hour >= 12 ? 'PM' : 'AM';
    }
    
    const formattedHours = formatTime(hours);
    const minutes = formatTime(currentTime.minute);
    const seconds = formatTime(currentTime.second);
    
    return {
      hours: formattedHours,
      minutes,
      seconds,
      ampm
    };
  };

  // Format the date as "Day, Month DD, YYYY" using Luxon
  const getFormattedDate = () => {
    const currentTime = getTimeInTimezone();
    return currentTime.toLocaleString({
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get current timezone display name or offset
  const getCurrentTimezoneDisplay = () => {
    if (timezone === 'local') {
      return 'LOCAL';
    }
    
    if (timezone === 'UTC') {
      return 'UTC';
    }
    
    const selectedTimezone = timezones.find(tz => tz.value === timezone);
    if (selectedTimezone?.displayName) {
      const offset = getTimeInTimezone().toFormat('ZZ');
      return `${selectedTimezone.displayName} (${offset})`;
    }
    
    return timezone.split('/').pop() || timezone;
  };

  // toggleTheme is now provided by ThemeContext

  const { hours, minutes, seconds, ampm } = getFormattedTime();

  // Detect if using a touch device
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  // Check if device is touch-enabled and update orientation state
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    const checkOrientation = () => {
      setIsLandscape(window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches);
    };
    
    checkTouchDevice();
    checkOrientation();
    
    window.addEventListener('resize', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);
  
  return (
    <div className={`digital-clock ${theme}-theme ${isLandscape ? 'landscape-mode' : ''}`}>
      <div className="clock-container">
        <div className="top-row">
          <div className="theme-toggle">
            <button 
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="icon-button"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span aria-hidden="true">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>
          </div>
          
          <div className="timezone-wrapper">
            <select 
              value={timezone} 
              onChange={(e) => setTimezone(e.target.value)}
              className="timezone-select"
              aria-label="Select timezone"
              title="Select timezone"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.displayName || tz.label}
                </option>
              ))}
            </select>
            <div className="timezone-display" aria-hidden="true">
              {getCurrentTimezoneDisplay()}
            </div>
          </div>
        </div>
        
        {showDate && (
          <div className="date" aria-live="polite">
            {getFormattedDate()}
          </div>
        )}
        
        <div className="time-display">
          <div className="time" role="timer" aria-label="Digital clock showing current time">
            <span className="time-unit hours">{hours}</span>
            <span className="separator" aria-hidden="true">:</span>
            <span className="time-unit minutes">{minutes}</span>
            {showSeconds && (
              <>
                <span className="separator" aria-hidden="true">:</span>
                <span className="time-unit seconds">{seconds}</span>
              </>
            )}
            {!is24Hour && <span className="ampm">{ampm}</span>}
          </div>
        </div>
        
        <div className="controls-panel" role="group" aria-label="Clock display options">
          <button 
            className={is24Hour ? 'active' : ''}
            onClick={() => setIs24Hour(!is24Hour)}
            aria-label={is24Hour ? 'Switch to 12 hour format' : 'Switch to 24 hour format'}
            aria-pressed={is24Hour}
            title={is24Hour ? 'Switch to 12 hour format' : 'Switch to 24 hour format'}
          >
            <span className="label">{is24Hour ? '24H' : '12H'}</span>
          </button>
          
          <button 
            className={showDate ? 'active' : ''}
            onClick={() => setShowDate(!showDate)}
            aria-label={showDate ? 'Hide date' : 'Show date'}
            aria-pressed={showDate}
            title={showDate ? 'Hide date' : 'Show date'}
          >
            <span className="label">{showDate ? 'DATE OFF' : 'DATE ON'}</span>
          </button>
          
          <button 
            className={showSeconds ? 'active' : ''}
            onClick={() => setShowSeconds(!showSeconds)}
            aria-label={showSeconds ? 'Hide seconds' : 'Show seconds'}
            aria-pressed={showSeconds}
            title={showSeconds ? 'Hide seconds' : 'Show seconds'}
          >
            <span className="label">{showSeconds ? 'SEC OFF' : 'SEC ON'}</span>
          </button>
          
          {/* Fullscreen feature removed */}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;