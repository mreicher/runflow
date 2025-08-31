import React, { useState } from 'react';
import { useRunTracker } from '../hooks/useRunTracker';
import { formatTime, formatPace, metersToMiles, formatElevation } from '../utils/helpers';
import MapView from './MapView';
import Modal from './Modal';
import SplitsModal from './SplitsModal';
import type { Run } from '../types';

interface TrackingPageProps {
  onRunComplete: (runData: Run) => void;
}

const StatCard: React.FC<{ label: string; value: string; unit?: string }> = ({ label, value, unit }) => (
    <div className="flex flex-col">
        <p className="text-slate-500 text-sm font-semibold tracking-wide">{label}</p>
        <p className="text-slate-800 text-3xl font-bold">
            {value}
            {unit && <span className="text-lg font-medium ml-1">{unit}</span>}
        </p>
    </div>
);

const TrackingPage: React.FC<TrackingPageProps> = ({ onRunComplete }) => {
  const {
    isRunning, isPaused, gpsReady, elapsedTime, distance, splits, instantPace, avgPace, elevationGain, path, 
    startRun, pauseRun, resumeRun, stopRun, resetRun,
  } = useRunTracker(onRunComplete);
  
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [isSplitsModalOpen, setSplitsModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-slate-100">
      {/* GPS Loading Overlay */}
      {!gpsReady && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 text-white">
              <div className="w-16 h-16 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-lg font-semibold">Acquiring GPS Signal...</p>
          </div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center p-4 space-y-4 overflow-y-auto">
        {/* Top Stats */}
        <div className="text-center">
            <p className="text-slate-500 font-semibold tracking-widest text-lg">TIME</p>
            <p className="text-7xl sm:text-8xl font-mono font-bold text-slate-800 tracking-tighter">
                {formatTime(elapsedTime)}
            </p>
        </div>
        
        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full max-w-md mx-auto text-center">
            <StatCard label="DISTANCE" value={metersToMiles(distance).toFixed(2)} unit="mi" />
            <StatCard label="AVG PACE" value={formatPace(avgPace)} unit="/mi" />
            <StatCard label="CURRENT PACE" value={formatPace(instantPace)} unit="/mi" />
            <StatCard label="ELEV GAIN" value={formatElevation(elevationGain)} />
        </div>
      </main>

      {/* Controls */}
      <footer className="flex-shrink-0 bg-white/50 backdrop-blur-sm p-4 rounded-t-3xl shadow-t-2xl">
        <div className="flex justify-around items-center h-24">
            <button onClick={resetRun} disabled={isRunning && !isPaused} className="text-slate-500 text-center disabled:opacity-30 transition-transform hover:scale-110">
                <i className="fas fa-redo text-2xl"></i>
                <span className="block text-xs font-semibold mt-1">Reset</span>
            </button>

            {!isRunning || isPaused ? (
                <button onClick={isPaused ? resumeRun : startRun} disabled={!gpsReady} className="w-20 h-20 bg-emerald-500 text-white rounded-full flex flex-col items-center justify-center text-xl font-bold shadow-lg transform transition-transform hover:scale-105 disabled:bg-slate-400">
                    <i className={`fas ${isPaused ? 'fa-play' : 'fa-play'}`}></i>
                    <span className="text-xs mt-1">{isPaused ? 'RESUME' : 'START'}</span>
                </button>
            ) : (
                <button onClick={pauseRun} className="w-20 h-20 bg-amber-500 text-white rounded-full flex flex-col items-center justify-center text-xl font-bold shadow-lg transform transition-transform hover:scale-105">
                     <i className="fas fa-pause"></i>
                     <span className="text-xs mt-1">PAUSE</span>
                </button>
            )}

             <button onClick={stopRun} disabled={!isRunning} className="text-red-500 text-center disabled:opacity-30 transition-transform hover:scale-110">
                <i className="fas fa-stop text-2xl"></i>
                <span className="block text-xs font-semibold mt-1">Stop</span>
            </button>
        </div>
        
        <div className="flex justify-center items-center gap-8 -mt-2">
            <button onClick={() => setMapModalOpen(true)} className="text-blue-600 font-semibold py-2 transition-transform hover:scale-110">
                <i className="fas fa-map-marked-alt mr-2"></i>View Route
            </button>
            <button 
                onClick={() => setSplitsModalOpen(true)} 
                disabled={splits.length === 0}
                className="text-blue-600 font-semibold py-2 transition-transform hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                <i className="fas fa-list-ol mr-2"></i>View Splits
            </button>
        </div>
      </footer>
      
      <Modal isOpen={isMapModalOpen} onClose={() => setMapModalOpen(false)} title="Your Route" size="fullscreen">
        <div className="w-full h-full">
          <MapView path={path} isStatic={false} />
        </div>
      </Modal>

      <SplitsModal 
          isOpen={isSplitsModalOpen} 
          onClose={() => setSplitsModalOpen(false)} 
          splits={splits} 
      />
    </div>
  );
};

export default TrackingPage;