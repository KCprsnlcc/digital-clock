import React, { useState, useEffect, useRef } from 'react';
import './StopWatch.css';

const StopWatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      // Clean up interval on component unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startStopwatch = () => {
    if (isRunning) {
      // Stop the stopwatch
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Start the stopwatch
      const startTime = Date.now() - elapsedTime;
      startTimeRef.current = startTime;

      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10); // Update every 10ms for more precise timing
    }
    setIsRunning(!isRunning);
  };

  const resetStopwatch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const recordLap = () => {
    if (isRunning) {
      setLaps([...laps, elapsedTime]);
    }
  };

  // Format milliseconds into mm:ss:ms
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="stopwatch">
      <div className="stopwatch-display">
        {formatTime(elapsedTime)}
      </div>

      <div className="stopwatch-controls">
        <button 
          className={`control-button ${isRunning ? 'stop' : 'start'}`} 
          onClick={startStopwatch}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        
        <button 
          className="control-button lap" 
          onClick={recordLap}
          disabled={!isRunning}
        >
          Lap
        </button>
        
        <button 
          className="control-button reset" 
          onClick={resetStopwatch}
          disabled={isRunning && elapsedTime === 0}
        >
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-container">
          <h3>Laps</h3>
          <ul className="lap-list">
            {laps.map((lap, index) => (
              <li key={index} className="lap-item">
                <span className="lap-number">Lap {index + 1}</span>
                <span className="lap-time">{formatTime(lap)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StopWatch; 