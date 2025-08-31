
import React from 'react';
import Modal from './Modal';
import { Split } from '../types';
import { formatTime, formatPace } from '../utils/helpers';

interface SplitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  splits: Split[];
}

const SplitsModal: React.FC<SplitsModalProps> = ({ isOpen, onClose, splits }) => {
  const exportData = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Mile,Time,Pace\n";
    splits.forEach(split => {
        csvContent += `${split.mile},${formatTime(split.time)},${formatPace(split.pace)}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "runflow_splits.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Run Splits">
      <div className="w-full">
        {splits.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No splits recorded yet. Complete a mile to see your splits here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 font-semibold text-slate-600">Mile</th>
                  <th className="p-3 font-semibold text-slate-600">Time</th>
                  <th className="p-3 font-semibold text-slate-600">Pace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {splits.map(split => (
                  <tr key={split.mile}>
                    <td className="p-3 font-medium text-slate-800">{split.mile}</td>
                    <td className="p-3">{formatTime(split.time)}</td>
                    <td className="p-3">{formatPace(split.pace)}/mi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {splits.length > 0 && (
            <button onClick={exportData} className="mt-6 w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                <i className="fas fa-download"></i> Export as CSV
            </button>
        )}
      </div>
    </Modal>
  );
};

export default SplitsModal;
