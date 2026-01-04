import React, { useState, useEffect, useRef } from 'react';
import OrderQueue from './OrderQueue';
import StockManager from './StockManager';
import { Order, OrderStatus } from '../types';
import { ORDER_NOTIFICATION_SOUND } from '../constants'; // Import sound constant

interface StaffDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onClearOrders: () => void;
  stocks: Record<string, number>;
  onUpdateStock: (id: string, delta: number) => void;
  onRestockAll: () => void;
  currentTheme: 'dark' | 'light';
  onToggleTheme: () => void;
  isShopOpen: boolean;
  onToggleShopStatus: () => void;
  hasPendingOrders: boolean; // New prop for sound alert
}

const StaffDashboardModal: React.FC<StaffDashboardModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateStatus,
  onClearOrders,
  stocks,
  onUpdateStock,
  onRestockAll,
  currentTheme,
  onToggleTheme,
  isShopOpen,
  onToggleShopStatus,
  hasPendingOrders // Destructure new prop
}) => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Effect to manage the sound alert loop
  useEffect(() => {
    // Start playing sound if there are pending orders and sound is enabled
    if (isOpen && hasPendingOrders && isSoundPlaying) {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play prevented:", e)); // Autoplay might be blocked
      }

      // Set up interval for repeated dings
      intervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0; // Rewind to start
          audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
        }
      }, 3000); // Ding every 3 seconds
    } else {
      // Stop sound and clear interval if no pending orders or sound is disabled/modal closed
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio to start
      }
    }

    // Cleanup function for when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isOpen, hasPendingOrders, isSoundPlaying]);

  // When the dashboard opens, if there are pending orders, enable sound
  useEffect(() => {
    if (isOpen && hasPendingOrders) {
      setIsSoundPlaying(true);
    } else if (!isOpen || !hasPendingOrders) {
      setIsSoundPlaying(false);
    }
  }, [isOpen, hasPendingOrders]);


  const handleOrderAccepted = () => {
    setIsSoundPlaying(false); // Stop the sound when an order is accepted
  };

  if (!isOpen) return null;

  return (
    <div className={`theme-container theme-${currentTheme} fixed inset-0 z-[80] bg-[var(--bg-color)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden transition-colors`}>
      <audio ref={audioRef} src={ORDER_NOTIFICATION_SOUND} preload="auto" /> {/* Audio element */}

      {/* Dashboard Header */}
      <div className="sticky top-0 z-10 theme-nav backdrop-blur-xl border-b px-6 py-4 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-xs">S</div>
          <div>
            <h2 className="text-[var(--text-color)] font-black uppercase tracking-widest text-xs">Staff Dashboard</h2>
            <p className="text-[9px] theme-text-muted font-bold uppercase tracking-tighter">Live Management Mode</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Shop Status Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest theme-text-muted">Shop Status:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" checked={isShopOpen} onChange={onToggleShopStatus} />
              <div className="w-11 h-6 bg-slate-500/20 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-2 text-sm font-medium text-[var(--text-color)]">{isShopOpen ? 'Open' : 'Closed'}</span>
            </label>
          </div>

          {/* Independent Theme Toggle for Staff */}
          <button 
            onClick={onToggleTheme}
            className="p-2.5 bg-slate-500/10 rounded-xl text-[var(--text-color)] hover:bg-slate-500/20 transition-all border border-[var(--border-color)] active:scale-90"
            aria-label="Toggle Staff Theme"
          >
            {currentTheme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>

          <button 
            onClick={onClose}
            className="bg-slate-500/10 text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-red-500/20 transition-all p-2.5 rounded-xl border border-[var(--border-color)] active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-10 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <OrderQueue 
            orders={orders} 
            onUpdateStatus={onUpdateStatus} 
            onClearOrders={onClearOrders} 
            onOrderAccepted={handleOrderAccepted} // Pass callback
          />
          <StockManager 
            stocks={stocks} 
            onUpdateStock={onUpdateStock} 
            onRestockAll={onRestockAll} 
            onLogout={onClose} 
          />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardModal;