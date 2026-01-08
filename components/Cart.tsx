import React, { useState, useMemo, useEffect } from 'react';
import { CartItem } from '../types';
import { PICKUP_LOCATION } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderConfirmed: (name: string, timeDetails: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cart, setCart, onOrderConfirmed }) => {
  const [name, setName] = useState('');
  
  // Calculate available slots dynamically
  const availableSlots = useMemo(() => {
    const slots: string[] = [];
    const now = new Date();
    
    // 30-minute buffer for preparation
    const prepBuffer = 30 * 60 * 1000; 
    const earliestPossible = now.getTime() + prepBuffer;

    const shopCloseTime = new Date();
    shopCloseTime.setHours(21, 30, 0, 0); // 9:30 PM

    // Only allow ordering if we haven't reached the last pickup slot
    if (now.getTime() < shopCloseTime.getTime()) {
      // Start generating 15-min intervals
      // Align start time to the next 15-minute block after the prep buffer
      let start = new Date(earliestPossible);
      let minutes = start.getMinutes();
      let roundedMinutes = Math.ceil(minutes / 15) * 15;
      start.setMinutes(roundedMinutes, 0, 0);

      let currentHour = start.getHours();
      let currentMinute = start.getMinutes();
      
      // Ensure we don't start before shop opens (8:30 AM)
      if (currentHour < 8 || (currentHour === 8 && currentMinute < 30)) {
        currentHour = 8;
        currentMinute = 30;
      }

      while (currentHour < 21 || (currentHour === 21 && currentMinute <= 30)) {
        const period = currentHour >= 12 ? 'PM' : 'AM';
        const displayHour = currentHour > 12 ? currentHour - 12 : (currentHour === 0 ? 12 : currentHour);
        const timeStr = `${displayHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')} ${period}`;
        
        if (!slots.includes(timeStr)) {
          slots.push(timeStr);
        }
        
        currentMinute += 15; // 15-minute increments
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour += 1;
        }
      }
    }
    return slots;
  }, [isOpen]);

  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    if (availableSlots.length > 0 && (!selectedTime || !availableSlots.includes(selectedTime))) {
      setSelectedTime(availableSlots[0]);
    }
  }, [availableSlots, selectedTime]);
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedTime && availableSlots.length > 0) {
      onOrderConfirmed(name, selectedTime);
    }
  };

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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-8 scrollbar-hide">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Self Pickup Point</p>
               <p className="text-[var(--text-color)] text-xs font-bold">{PICKUP_LOCATION}</p>
            </div>
          </div>

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
                  <label className="text-[9px] font-black uppercase tracking-widest theme-text-muted px-1">Pickup Time Today</label>
                  
                  {availableSlots.length > 0 ? (
                    <>
                      <div className="max-h-72 overflow-y-auto pr-2 scrollbar-hide bg-slate-500/5 border-2 border-[var(--border-color)] rounded-2xl p-4">
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 px-1 rounded-xl text-[9px] font-bold uppercase transition-all duration-200 border ${
                                selectedTime === time
                                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/20'
                                  : 'bg-slate-500/10 text-[var(--text-color)] border-[var(--border-color)] hover:border-pink-500/50'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="px-2 mt-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] italic text-emerald-500">
                          Scheduled: {selectedTime}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 bg-red-500/10 border-2 border-red-500/20 rounded-2xl text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Orders closed for today</p>
                      <p className="text-[9px] theme-text-muted mt-1">Please come back tomorrow morning!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        {cart.length > 0 && (
          <div className="p-8 border-t theme-nav shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black theme-text-muted uppercase tracking-[0.2em]">Final Total</span>
              <span className="font-kampung text-3xl font-black text-[var(--text-color)]">${subtotal.toFixed(2)}</span>
            </div>
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={!name.trim() || !selectedTime || availableSlots.length === 0}
              className="w-full bg-green-600 text-white font-black py-5 rounded-[2.5rem] shadow-xl uppercase text-xs tracking-[0.2em] hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7  2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Confirm via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;