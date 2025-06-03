import React, { useState, createContext, useEffect } from 'react';
import './App.css';
import DigitalClock from './components/DigitalClock';
import StopWatch from './components/StopWatch';
import Timer from './components/Timer';
import ClockNavigation from './components/ClockNavigation';

// Create theme context
export const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
}>({ theme: 'dark', toggleTheme: () => {} });

function App() {
  const [activeTab, setActiveTab] = useState<string>('clock');
  const [theme, setTheme] = useState<string>('dark');
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Apply theme to body
  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`App ${theme}-theme`}>
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
    </ThemeContext.Provider>
  );
}

export default App;
