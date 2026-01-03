
import React, { useState } from 'react';

interface FindOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFind: (input: string, type: 'id' | 'phone') => void;
}

const FindOrderModal: React.FC<FindOrderModalProps> = ({ isOpen, onClose, onFind }) => {
  const [input, setInput] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'phone'>('id');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onFind(input, searchType);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xs theme-card border rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 transition-colors">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-pink-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3 className="font-black uppercase tracking-widest text-[var(--text-color)] text-sm">Find My Receipt</h3>
          
          <div className="flex bg-slate-500/10 rounded-lg p-1 mt-4 transition-colors">
            <button 
              onClick={() => setSearchType('id')}
              className={`flex-1 py-1.5 text-[9px] font-black rounded-md transition-all ${searchType === 'id' ? 'bg-[var(--bg-card)] text-[var(--text-color)] shadow-sm' : 'theme-text-muted'}`}
            >
              ORDER ID
            </button>
            <button 
              onClick={() => setSearchType('phone')}
              className={`flex-1 py-1.5 text-[9px] font-black rounded-md transition-all ${searchType === 'phone' ? 'bg-[var(--bg-card)] text-[var(--text-color)] shadow-sm' : 'theme-text-muted'}`}
            >
              PHONE NUMBER
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type={searchType === 'id' ? 'text' : 'tel'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={searchType === 'id' ? 'e.g. S18U' : 'e.g. 8888 1234'}
            className="w-full bg-slate-500/5 border-2 border-[var(--border-color)] rounded-xl px-4 py-3 text-center font-black text-lg focus:outline-none focus:border-pink-500 transition-all uppercase text-[var(--text-color)] placeholder:theme-text-muted"
            autoFocus
            maxLength={searchType === 'id' ? 5 : 15}
          />
          <button
            type="submit"
            className="w-full bg-[var(--text-color)] text-[var(--bg-color)] font-black py-4 rounded-xl uppercase tracking-widest text-[10px] hover:opacity-80 transition-colors shadow-lg"
          >
            Track Status
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindOrderModal;
