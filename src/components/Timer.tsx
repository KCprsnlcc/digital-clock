import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const Timer: React.FC = () => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timerComplete, setTimerComplete] = useState<boolean>(false);

  // Effect to handle timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);
            setTimerComplete(true);
            // You could add sound notification here
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle input changes
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 23);
    setHours(value);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 59);
    setMinutes(value);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 59);
    setSeconds(value);
  };

  // Start the timer
  const startTimer = () => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      return; // Don't start if no time is set
    }
    
    const total = hours * 3600 + minutes * 60 + seconds;
    setTotalSeconds(total);
    setTimeLeft(total);
    setIsRunning(true);
    setTimerComplete(false);
  };

  // Pause the timer
  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Reset the timer
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTimerComplete(false);
  };

  // Format time display
  const formatTimeDisplay = () => {
    const displayHours = Math.floor(timeLeft / 3600);
    const displayMinutes = Math.floor((timeLeft % 3600) / 60);
    const displaySeconds = timeLeft % 60;

    return {
      hours: displayHours.toString().padStart(2, '0'),
      minutes: displayMinutes.toString().padStart(2, '0'),
      seconds: displaySeconds.toString().padStart(2, '0')
    };
  };

  const { hours: displayHours, minutes: displayMinutes, seconds: displaySeconds } = formatTimeDisplay();

  // Calculate progress percentage
  const progressPercentage = totalSeconds > 0 
    ? ((totalSeconds - timeLeft) / totalSeconds) * 100 
    : 0;

  return (
    <div className="timer">
      {!isRunning && timeLeft === 0 ? (
        <div className="timer-setup">
          <div className="timer-inputs">
            <div className="timer-input-group">
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={handleHoursChange}
                className="timer-input"
              />
              <label>Hours</label>
            </div>
            <span className="timer-colon">:</span>
            <div className="timer-input-group">
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={handleMinutesChange}
                className="timer-input"
              />
              <label>Minutes</label>
            </div>
            <span className="timer-colon">:</span>
            <div className="timer-input-group">
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={handleSecondsChange}
                className="timer-input"
              />
              <label>Seconds</label>
            </div>
          </div>
          <button 
            className="timer-button start" 
            onClick={startTimer}
            disabled={hours === 0 && minutes === 0 && seconds === 0}
          >
            Start Timer
          </button>
        </div>
      ) : (
        <div className="timer-running">
          <div className="timer-display">
            <span className="timer-display-time">{displayHours}:{displayMinutes}:{displaySeconds}</span>
            {timerComplete && <div className="timer-complete-message">Timer Complete!</div>}
          </div>
          
          <div className="timer-progress-container">
            <div 
              className="timer-progress-bar" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="timer-controls">
            {isRunning ? (
              <button className="timer-button pause" onClick={pauseTimer}>
                Pause
              </button>
            ) : (
              <button className="timer-button resume" onClick={startTimer}>
                Resume
              </button>
            )}
            <button className="timer-button reset" onClick={resetTimer}>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer; 