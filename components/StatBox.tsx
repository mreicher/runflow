
import React from 'react';

interface StatBoxProps {
  label: string;
  value: string;
  unit: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, unit }) => {
  return (
    <div className="bg-white rounded-xl p-4 text-center shadow-md">
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="text-xs text-slate-400">{unit}</p>
    </div>
  );
};

export default StatBox;
