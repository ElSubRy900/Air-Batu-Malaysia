
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
      case 'pending': return { label: 'Waiting', color: 'text-orange-500', bg: 'bg-orange-500/10' };
      case 'accepted': return { label: 'Preparing', color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'ready': return { label: 'Ready!', color: 'text-emerald-500', bg: 'bg-emerald-500/10', pulse: true };
      default: return { label: status.toUpperCase(), color: 'var(--text-muted)', bg: 'var(--bg-nav)' };
    }
  };

  return (
    <section className="w-full px-2 mb-12 animate-in fade-in duration-700">
      <div className="theme-card border rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors">
        <div className="theme-nav px-8 py-4 border-b flex justify-between items-center transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-color)]">Live Order Status</h3>
          </div>
          <span className="text-[9px] theme-text-muted font-bold uppercase">{activeOrders.length} Active</span>
        </div>
        
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {activeOrders.map(order => {
            const display = getStatusDisplay(order.status);
            return (
              <div 
                key={order.id} 
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--border-color)] transition-all ${display.bg} ${display.pulse ? 'animate-pulse' : ''}`}
              >
                <span className="font-kampung text-xl text-[var(--text-color)] mb-1">#{order.id}</span>
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
