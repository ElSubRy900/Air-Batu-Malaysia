import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CartItem } from '../types';
import { PICKUP_LOCATION } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderConfirmed: (name: string, timeDetails: string) => void;
}

// New 12-hour format constants
const HOURS_12 = Array.from({ length: 12 }, (_, i) => (i === 0 ? '12' : (i).toString()).padStart(2, '0')); // '12', '01', '02', ..., '11'
const MINUTES = ['00', '15', '30', '45'];

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cart, setCart, onOrderConfirmed }) => {
  const [name, setName] = useState('');
  // Default to 09:00 (12-hour format, with PM)
  const [selectedHour, setSelectedHour] = useState('09'); 
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');
  
  // State for custom dropdown visibility
  const [showHourDropdown, setShowHourDropdown] = useState(false);
  const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);

  // Refs for trigger buttons and dropdowns themselves
  const hourButtonRef = useRef<HTMLButtonElement>(null);
  const hourDropdownRef = useRef<HTMLDivElement>(null);
  const minuteButtonRef = useRef<HTMLButtonElement>(null);
  const minuteDropdownRef = useRef<HTMLDivElement>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /**
   * Business Logic Validation - TEMPORARILY DISABLED
   * Always returns isValid: true for testing purposes.
   */
  const validation = useMemo(() => {
    return { isValid: true, message: '' }; // TEMPORARILY ALWAYS VALID
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && validation.isValid) {
      // Time string is now 12-hour format (HH:MM AM/PM)
      const timeStr = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
      onOrderConfirmed(name, timeStr);
    }
  };

  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hourDropdownRef.current && !hourDropdownRef.current.contains(event.target as Node) &&
        hourButtonRef.current && !hourButtonRef.current.contains(event.target as Node)
      ) {
        setShowHourDropdown(false);
      }
      if (
        minuteDropdownRef.current && !minuteDropdownRef.current.contains(event.target as Node) &&
        minuteButtonRef.current && !minuteButtonRef.current.contains(event.target as Node)
      ) {
        setShowMinuteDropdown(false);
      }
    };

    if (showHourDropdown || showMinuteDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHourDropdown, showMinuteDropdown]);

  // Effect to scroll selected hour into view when dropdown opens
  useEffect(() => {
    if (showHourDropdown && hourDropdownRef.current) {
      const selectedItem = hourDropdownRef.current.querySelector(
        `button[aria-selected="true"]`
      ) as HTMLButtonElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [showHourDropdown, selectedHour]);

  // Effect to scroll selected minute into view when dropdown opens
  useEffect(() => {
    if (showMinuteDropdown && minuteDropdownRef.current) {
      const selectedItem = minuteDropdownRef.current.querySelector(
        `button[aria-selected="true"]`
      ) as HTMLButtonElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [showMinuteDropdown, selectedMinute]);


  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute inset-y-0 right-0 w-full max-w-md theme-card shadow-2xl flex flex-col border-l transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-8 border-b theme-nav flex justify-between items-center">
          <h2 className="font-kampung text-2xl font-black uppercase text-[var(--text-color)]">Your Basket</h2>
          <button onClick={onClose} className="text-[var(--text-color)] hover:text-pink-500 transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-8">
          {/* Pickup Banner */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Self Pickup</p>
               <p className="text-[var(--text-color)] text-xs font-bold">{PICKUP_LOCATION}</p>
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black theme-text-muted uppercase tracking-[0.2em] mb-4">Your Treats</h3>
            {cart.length === 0 ? (
              <div className="py-12 text-center opacity-30 italic">Basket is empty</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} className="w-16 h-16 rounded-2xl object-cover border border-[var(--border-color)]" alt={item.name} />
                  <div className="flex-1">
                    <p className="font-black text-[var(--text-color)] text-xs uppercase mb-2">{item.name}</p>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 theme-card border rounded-lg font-black text-[var(--text-color)] text-xs flex items-center justify-center">-</button>
                      <span className="text-xs font-black text-[var(--text-color)]">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 theme-card border rounded-lg font-black text-[var(--text-color)] text-xs flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <p className="font-black text-[var(--text-color)] font-kampung text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-[10px] font-black theme-text-muted uppercase tracking-[0.2em]">Customer Info</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest theme-text-muted px-1">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Siti"
                    className="w-full bg-slate-500/5 border-2 border-[var(--border-color)] rounded-2xl px-5 py-4 font-bold text-[var(--text-color)] focus:border-pink-500 outline-none transition-all text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[9px] font-black uppercase tracking-widest theme-text-muted">Pickup Time (12hr)</label>
                    {!validation.isValid && (
                      <span className="text-[8px] font-bold text-red-500 uppercase animate-pulse tracking-tighter">Hours Required</span>
                    )}
                  </div>
                  
                  {/* Custom Dropdown UI for Time Picker */}
                  <div className="bg-slate-900 rounded-[2.5rem] border-2 border-[var(--border-color)] p-4 shadow-inner">
                    <div className="flex gap-2 relative z-20"> {/* Parent for hour/minute selectors, relative for absolute popups */}
                        {/* Hour Selector */}
                        <div className="flex-1 relative">
                            <button
                                ref={hourButtonRef}
                                type="button"
                                onClick={() => setShowHourDropdown(prev => !prev)}
                                className="w-full py-3 px-4 rounded-xl theme-card border border-pink-500/30 text-xl font-bold text-pink-500 flex justify-center items-center transition-colors hover:border-pink-500"
                                aria-haspopup="listbox"
                                aria-expanded={showHourDropdown}
                            >
                                {selectedHour}
                                {/* Dropdown arrow icon */}
                                <svg className={`ml-2 h-4 w-4 transform transition-transform ${showHourDropdown ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {showHourDropdown && (
                                <div
                                    ref={hourDropdownRef}
                                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-pink-500 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 py-1"
                                    role="listbox"
                                >
                                    {HOURS_12.map(h => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={() => {
                                                setSelectedHour(h);
                                                setShowHourDropdown(false);
                                            }}
                                            className={`w-full text-center py-2 text-lg font-bold transition-colors
                                                ${selectedHour === h ? 'bg-pink-600 text-white' : 'text-[var(--text-color)] hover:bg-slate-700'}`}
                                            role="option"
                                            aria-selected={selectedHour === h}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <span className="text-xl font-black text-slate-800 self-center">:</span>

                        {/* Minute Selector */}
                        <div className="flex-1 relative">
                            <button
                                ref={minuteButtonRef}
                                type="button"
                                onClick={() => setShowMinuteDropdown(prev => !prev)}
                                className="w-full py-3 px-4 rounded-xl theme-card border border-pink-500/30 text-xl font-bold text-pink-500 flex justify-center items-center transition-colors hover:border-pink-500"
                                aria-haspopup="listbox"
                                aria-expanded={showMinuteDropdown}
                            >
                                {selectedMinute}
                                {/* Dropdown arrow icon */}
                                <svg className={`ml-2 h-4 w-4 transform transition-transform ${showMinuteDropdown ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {showMinuteDropdown && (
                                <div
                                    ref={minuteDropdownRef}
                                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-pink-500 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 py-1"
                                    role="listbox"
                                >
                                    {MINUTES.map(m => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => {
                                                setSelectedMinute(m);
                                                setShowMinuteDropdown(false);
                                            }}
                                            className={`w-full text-center py-2 text-lg font-bold transition-colors
                                                ${selectedMinute === m ? 'bg-pink-600 text-white' : 'text-[var(--text-color)] hover:bg-slate-700'}`}
                                            role="option"
                                            aria-selected={selectedMinute === m}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* AM/PM Selector */}
                        <div className="flex flex-col justify-center gap-1.5 self-center shrink-0">
                            <button
                                type="button"
                                onClick={() => setSelectedPeriod('AM')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors border
                                    ${selectedPeriod === 'AM' ? 'bg-pink-600 text-white border-pink-600' : 'theme-card text-[var(--text-color)] border-pink-500/30 hover:border-pink-500/60'}`}
                                aria-pressed={selectedPeriod === 'AM'}
                            >
                                AM
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedPeriod('PM')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors border
                                    ${selectedPeriod === 'PM' ? 'bg-pink-600 text-white border-pink-600' : 'theme-card text-[var(--text-color)] border-pink-500/30 hover:border-pink-500/60'}`}
                                aria-pressed={selectedPeriod === 'PM'}
                            >
                                PM
                            </button>
                        </div>
                    </div>
                  </div>

                  {!validation.isValid && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                      <span className="text-lg">⚠️</span>
                      <p className="text-[10px] font-bold text-red-500 leading-tight uppercase tracking-tight">{validation.message}</p>
                    </div>
                  )}

                  <div className="px-2">
                    <p className={`text-[9px] font-black uppercase tracking-[0.2em] italic transition-colors duration-300 ${validation.isValid ? 'text-emerald-500' : 'text-slate-600 opacity-30'}`}>
                      Selected Pickup: {selectedHour}:{selectedMinute} {selectedPeriod}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer with Checkout */}
        {cart.length > 0 && (
          <div className="p-8 border-t theme-nav shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black theme-text-muted uppercase tracking-[0.2em]">Final Total</span>
              <span className="font-kampung text-3xl font-black text-[var(--text-color)]">${subtotal.toFixed(2)}</span>
            </div>
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={!name.trim() || !validation.isValid}
              className="w-full bg-green-600 text-white font-black py-5 rounded-[2.5rem] shadow-xl uppercase text-xs tracking-[0.2em] hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7  2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Confirm via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;