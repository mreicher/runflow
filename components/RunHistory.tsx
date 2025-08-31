
import React from 'react';
import { Run } from '../types';
import { formatTime, metersToMiles } from '../utils/helpers';

interface RunHistoryProps {
  runs: Run[];
}

const RunHistory: React.FC<RunHistoryProps> = ({ runs }) => {
  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
        <i className="fas fa-box-open text-6xl mb-4"></i>
        <h2 className="text-2xl font-bold text-slate-700">No Runs Yet</h2>
        <p className="mt-2">Your saved runs will appear here once you complete and save an activity.</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Activity History</h2>
      <ul className="space-y-3">
        {runs.map(run => (
          <li key={run.id} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">
                {new Date(run.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-slate-500">
                {new Date(run.date).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
                <p className="text-xl font-semibold text-blue-700">{metersToMiles(run.distance).toFixed(2)} mi</p>
                <p className="text-sm text-slate-500">{formatTime(run.duration)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RunHistory;
