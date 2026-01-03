
import React, { useState } from 'react';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, phone: string) => void;
  total: number;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, onConfirm, total }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onConfirm(name, phone);
      setName('');
      setPhone('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm theme-card border rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 mb-[300px] sm:mb-0 transition-colors">
          <div className="text-center mb-6">
            <h3 className="font-kampung text-2xl text-[var(--text-color)] mb-2">Final Step!</h3>
            <p className="text-xs theme-text-muted font-medium">Please enter your details for pickup</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest theme-text-muted ml-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali"
                className="w-full bg-slate-500/5 border-2 border-[var(--border-color)] rounded-2xl px-5 py-4 font-bold focus:outline-none focus:border-pink-500 transition-all text-[var(--text-color)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest theme-text-muted ml-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 8888 1234"
                className="w-full bg-slate-500/5 border-2 border-[var(--border-color)] rounded-2xl px-5 py-4 font-bold focus:outline-none focus:border-pink-500 transition-all text-[var(--text-color)]"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-pink-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-sm hover:bg-pink-500 transition-all shadow-xl shadow-pink-500/20 active:scale-95 flex items-center justify-between px-8"
              >
                <span>Confirm Order</span>
                <span className="font-kampung text-xl">${total.toFixed(2)}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderFormModal;
