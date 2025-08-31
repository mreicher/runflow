
import React from 'react';

interface ControlButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ label, icon, onClick, color, disabled = false }) => {
  const buttonClasses = `
    flex flex-col items-center justify-center p-3 rounded-xl shadow-lg
    transform transition-transform duration-150
    ${color}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
  `;
  return (
    <button onClick={onClick} disabled={disabled} className={buttonClasses}>
      <i className={`fas ${icon} text-2xl`}></i>
      <span className="mt-1 text-xs">{label}</span>
    </button>
  );
};

export default ControlButton;
