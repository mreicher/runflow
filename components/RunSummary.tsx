import React from 'react';
import { Run } from '../types';
import { formatTime, formatPace, metersToMiles, formatElevation } from '../utils/helpers';
import MapView from './MapView';
import ElevationChart from './ElevationChart';
import SplitsModal from './SplitsModal'; // Reusing for table display logic

const SummaryStat: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="bg-white p-3 rounded-xl shadow-md">
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 font-semibold">{label}</p>
    </div>
);

const RunSummary: React.FC<{ run: Run; onSave: (run: Run) => void; onDiscard: () => void; }> = ({ run, onSave, onDiscard }) => {
  const avgPace = run.distance > 0 ? run.duration / metersToMiles(run.distance) : 0;
  
  return (
    <div className="w-full h-full bg-slate-100 flex flex-col">
       <header className="flex-shrink-0 bg-white shadow-md p-4">
            <h1 className="text-2xl font-bold text-blue-800 text-center">
                Run Summary
            </h1>
       </header>

       <main className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="h-64 rounded-xl overflow-hidden shadow-lg">
                <MapView path={run.path} isStatic={true} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <SummaryStat label="Miles" value={metersToMiles(run.distance).toFixed(2)} />
                <SummaryStat label="Time" value={formatTime(run.duration)} />
                <SummaryStat label="Avg Pace" value={formatPace(avgPace)} />
                <SummaryStat label="Elev Gain" value={formatElevation(run.elevationGain)} />
            </div>

            {run.altitudes.filter(a => a !== null).length > 1 && (
                 <div className="bg-white p-4 rounded-xl shadow-md">
                    <h3 className="font-bold text-slate-700 mb-2">Elevation Profile</h3>
                    <div className="h-32">
                        <ElevationChart altitudes={run.altitudes} distance={run.distance} />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <h3 className="font-bold text-slate-700 p-4">Splits</h3>
                {run.splits.length > 0 ? (
                    <table className="w-full text-left table-auto">
                        <thead className="bg-slate-100">
                            <tr>
                            <th className="p-3 font-semibold text-slate-600 text-sm">Mile</th>
                            <th className="p-3 font-semibold text-slate-600 text-sm">Time</th>
                            <th className="p-3 font-semibold text-slate-600 text-sm">Pace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {run.splits.map(split => (
                            <tr key={split.mile}>
                                <td className="p-3 font-medium text-slate-800">{split.mile}</td>
                                <td className="p-3">{formatTime(split.time)}</td>
                                <td className="p-3">{formatPace(split.pace)}/mi</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p className="p-4 text-slate-500 text-center">No full miles completed.</p>}
            </div>

       </main>

       <footer className="flex-shrink-0 p-4 grid grid-cols-2 gap-4 bg-white border-t">
            <button onClick={onDiscard} className="w-full bg-slate-500 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition">
                Discard
            </button>
            <button onClick={() => onSave(run)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition">
                Save Run
            </button>
       </footer>
    </div>
  );
};

export default RunSummary;