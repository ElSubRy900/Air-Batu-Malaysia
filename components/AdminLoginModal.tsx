
import React, { useState } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      onLogin(password);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-xs theme-card border rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 mb-[300px] sm:mb-0 transition-colors">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-color)]"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 className="font-black uppercase tracking-widest text-[var(--text-color)] text-sm">Staff Login</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className={`w-full bg-slate-500/5 border-2 ${error ? 'border-red-500 animate-shake' : 'border-[var(--border-color)]'} rounded-xl px-4 py-3 text-center font-bold text-[var(--text-color)] focus:outline-none focus:border-pink-500 transition-all`}
                autoFocus
              />
              {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter mt-2 text-center">Incorrect Password</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[var(--text-color)] text-[var(--bg-color)] font-black py-3 rounded-xl uppercase tracking-widest text-xs hover:opacity-80 transition-colors shadow-lg"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
