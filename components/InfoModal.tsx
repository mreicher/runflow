
import React from 'react';
import Modal from './Modal';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About RunFlow">
        <div className="space-y-4 text-slate-600">
            <div className="modal-section">
                <h4 className="font-bold text-lg text-slate-800 mb-2">How to Use RunFlow</h4>
                <p>RunFlow is a GPS running tracker that helps you monitor your runs with accurate metrics.</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Press <strong>Start</strong> to begin tracking your run.</li>
                    <li>Use <strong>Pause</strong> to temporarily stop tracking.</li>
                    <li>Press <strong>Stop</strong> to end your run and view summary.</li>
                    <li>Use <strong>Reset</strong> to clear current data and start fresh.</li>
                </ul>
            </div>
            
            <div className="modal-section">
                <h4 className="font-bold text-lg text-slate-800 mb-2">Understanding Metrics</h4>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Distance</strong>: How far you've run (in miles).</li>
                    <li><strong>Instant Pace</strong>: Your current speed, averaged over the last few seconds.</li>
                    <li><strong>Current Mile</strong>: The mile marker you're currently on.</li>
                    <li><strong>Mile Pace</strong>: Your average pace for the current mile.</li>
                </ul>
            </div>
            
            <a href="https://www.buymeacoffee.com" target="_blank" rel="noopener noreferrer" className="block text-center mt-6 p-3 bg-amber-100 text-amber-800 rounded-lg font-semibold hover:bg-amber-200 transition">
                <i className="fas fa-coffee mr-2"></i> Buy me a coffee
            </a>
        </div>
    </Modal>
  );
};

export default InfoModal;
