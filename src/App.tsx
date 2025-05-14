import React, { useState } from 'react';
import './App.css';
import DigitalClock from './components/DigitalClock';
import StopWatch from './components/StopWatch';
import Timer from './components/Timer';
import ClockNavigation from './components/ClockNavigation';

function App() {
  const [activeTab, setActiveTab] = useState<string>('clock');

  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'clock':
        return <DigitalClock />;
      case 'stopwatch':
        return <StopWatch />;
      case 'timer':
        return <Timer />;
      default:
        return <DigitalClock />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Digital Clock App</h1>
      </header>
      <main className="app-content">
        <ClockNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderActiveComponent()}
      </main>
      <footer className="app-footer">
        <p>Multi-function Digital Clock App</p>
      </footer>
    </div>
  );
}

export default App;
