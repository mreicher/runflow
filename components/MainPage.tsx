
import React, { useState } from 'react';
import TrackingPage from './TrackingPage';
import RunHistory from './RunHistory';
import type { UserType } from '../App';
import type { Run } from '../types';

interface MainPageProps {
  user: UserType;
  onSignOut: () => void;
  onRunComplete: (runData: Run) => void;
  runs: Run[];
}

type Tab = 'run' | 'history';

const MainPage: React.FC<MainPageProps> = ({ user, onSignOut, onRunComplete, runs }) => {
  const [activeTab, setActiveTab] = useState<Tab>('run');

  const NavButton: React.FC<{tab: Tab, icon: string, label: string}> = ({ tab, icon, label }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
      >
        <i className={`fas ${icon} text-2xl`}></i>
        <span className="text-xs font-semibold mt-1">{label}</span>
      </button>
    );
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex-shrink-0 bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <i className="fas fa-running"></i> RunFlow
        </h1>
        <button onClick={onSignOut} className="w-10 h-10 bg-red-500 text-white rounded-full text-xl font-bold hover:bg-red-600 transition flex items-center justify-center">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {activeTab === 'run' && <TrackingPage onRunComplete={onRunComplete} />}
        {activeTab === 'history' && <RunHistory runs={runs} />}
      </main>

      <footer className="flex-shrink-0 bg-white border-t border-slate-200 shadow-inner">
        <nav className="flex justify-around items-center h-16">
          <NavButton tab="run" icon="fa-stopwatch-20" label="Run" />
          <NavButton tab="history" icon="fa-history" label="History" />
        </nav>
      </footer>
    </div>
  );
};

export default MainPage;
