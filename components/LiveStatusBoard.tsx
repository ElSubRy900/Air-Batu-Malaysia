
import React from 'react';
import { Order, OrderStatus } from '../types';

interface LiveStatusBoardProps {
  orders: Order[];
}

const LiveStatusBoard: React.FC<LiveStatusBoardProps> = ({ orders }) => {
  const activeOrders = orders.filter(o => ['pending', 'accepted', 'ready'].includes(o.status));

  if (activeOrders.length === 0) return null;

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return { label: 'Waiting', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
      case 'accepted': return { label: 'Preparing', color: 'text-blue-400', bg: 'bg-blue-400/10' };
      case 'ready': return { label: 'Ready!', color: 'text-emerald-400', bg: 'bg-emerald-400/10', pulse: true };
      default: return { label: status.toUpperCase(), color: 'text-slate-400', bg: 'bg-slate-800' };
    }
  };

  return (
    <section className="w-full px-2 mb-12 animate-in fade-in duration-700">
      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-slate-900/50 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Live Order Status</h3>
          </div>
          <span className="text-[9px] text-slate-500 font-bold uppercase">{activeOrders.length} Active</span>
        </div>
        
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {activeOrders.map(order => {
            const display = getStatusDisplay(order.status);
            return (
              <div 
                key={order.id} 
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-800/50 transition-all ${display.bg} ${display.pulse ? 'animate-pulse' : ''}`}
              >
                <span className="font-kampung text-xl text-white mb-1">#{order.id}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${display.color}`}>
                  {display.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LiveStatusBoard;
