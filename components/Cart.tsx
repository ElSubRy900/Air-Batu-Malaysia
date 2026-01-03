
import React, { useState } from 'react';
import { CartItem } from '../types';
import { PICKUP_LOCATION } from '../constants';
import OrderFormModal from './OrderFormModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderPlaced: (name: string, phone: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cart, setCart, onOrderPlaced }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const handleConfirmOrder = (name: string, phone: string) => {
    onOrderPlaced(name, phone);
    setIsFormOpen(false);
    onClose();
  };

  if (!isOpen && !isFormOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
        <div className={`absolute inset-y-0 right-0 max-w-full flex transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-screen max-w-md bg-slate-900 shadow-2xl flex flex-col">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="font-kampung text-2xl font-black text-gradient-kampung uppercase">Your Basket</h2>
              <button onClick={onClose} className="text-white hover:text-pink-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
               <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                 <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Self Pickup @ Tengah</p>
                    <p className="text-white text-xs font-bold leading-none mt-1">{PICKUP_LOCATION}</p>
                 </div>
               </div>

              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-50">
                  <p className="font-black text-slate-500 uppercase tracking-widest">Empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-5 items-center border-b border-slate-800 pb-8 last:border-0">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover border border-slate-700" />
                    <div className="flex-1">
                      <p className="font-black text-white text-sm uppercase tracking-tight mb-1">{item.name}</p>
                      <p className="text-xs text-pink-400 font-bold mb-3">$2.00 / stick</p>
                      <div className="flex items-center gap-4">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 bg-slate-800 border border-slate-700 text-white rounded-xl font-black hover:bg-slate-700">-</button>
                        <span className="text-sm font-black text-white w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 bg-slate-800 border border-slate-700 text-white rounded-xl font-black hover:bg-slate-700">+</button>
                      </div>
                    </div>
                    <p className="font-black text-white text-lg font-kampung">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Amount</span>
                  <span className="text-4xl font-black text-white font-kampung">${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setIsFormOpen(true)} 
                  className="w-full bg-white text-slate-950 font-black py-5 rounded-3xl shadow-[0_10px_30px_rgba(255,255,255,0.05)] uppercase text-xs tracking-widest hover:bg-emerald-400 transition-colors"
                >
                  Confirm and Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onConfirm={handleConfirmOrder} total={subtotal} />
    </>
  );
};

export default Cart;