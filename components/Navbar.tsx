
import React from 'react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currentTheme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, currentTheme, onToggleTheme }) => {
  return (
    <nav className="sticky top-0 z-40 theme-nav backdrop-blur-xl border-b py-4 sm:py-6 px-4 sm:px-8 flex justify-between items-center shadow-2xl transition-colors w-full pt-[calc(1rem+env(safe-area-inset-top,0px))]">
      <div className="w-8 sm:w-12 flex-shrink-0">
        {/* Logo space */}
      </div>
      
      {/* Centered Trust Bar */}
      <div className="flex-1 flex justify-center items-center overflow-hidden px-1">
        <div className="py-1 border-y border-[var(--border-color)] flex justify-center items-center gap-2 sm:gap-6 px-1 flex-nowrap overflow-hidden">
          <div className="flex items-center gap-1 flex-nowrap">
            <span className="text-[7px] sm:text-[10px]">❄️</span>
            <span className="text-[6px] sm:text-[9px] font-bold uppercase tracking-[0.05em] sm:tracking-[0.2em] theme-text-muted whitespace-nowrap">Frozen</span>
          </div>
          <div className="w-px h-2 bg-[var(--border-color)] opacity-50"></div>
          <div className="flex items-center gap-1 flex-nowrap">
            <span className="text-[7px] sm:text-[10px]">📍</span>
            <span className="text-[6px] sm:text-[9px] font-bold uppercase tracking-[0.05em] sm:tracking-[0.2em] theme-text-muted whitespace-nowrap">Tengah</span>
          </div>
          <div className="w-px h-2 bg-[var(--border-color)] opacity-50"></div>
          <div className="flex items-center gap-1 flex-nowrap">
            <span className="text-[7px] sm:text-[10px]">✨</span>
            <span className="text-[6px] sm:text-[9px] font-bold uppercase tracking-[0.05em] sm:tracking-[0.2em] theme-text-muted whitespace-nowrap">Premium</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-2 sm:gap-4 flex-shrink-0">
        <button 
          onClick={onToggleTheme}
          className="p-2 sm:p-3 bg-slate-800/10 rounded-xl sm:rounded-2xl text-[var(--text-color)] hover:bg-slate-500/10 transition-all active:scale-90 border border-[var(--border-color)]"
          aria-label="Toggle Theme"
        >
          {currentTheme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </button>

        <button 
          onClick={onOpenCart}
          className="relative p-2 sm:p-3 bg-slate-800/10 rounded-xl sm:rounded-2xl text-[var(--text-color)] hover:bg-slate-500/10 hover:text-pink-400 transition-all active:scale-90 border border-[var(--border-color)]"
          aria-label="Open Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-pink-500 text-white text-[7px] sm:text-[10px] font-black w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border-2 border-[var(--bg-color)] shadow-xl animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
