import React from 'react';
import './ClockNavigation.css';

interface ClockNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ClockNavigation: React.FC<ClockNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'clock', label: 'Digital Clock' },
    { id: 'stopwatch', label: 'Stopwatch' },
    { id: 'timer', label: 'Timer' },
  ];

  return (
    <div className="clock-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ClockNavigation; 