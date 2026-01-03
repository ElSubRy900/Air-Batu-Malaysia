
import React from 'react';
import { Order, OrderStatus } from '../types';
import { PICKUP_LOCATION, PICKUP_UNIT } from '../constants';

interface OrderReceiptProps {
  order: Order;
  onClose: () => void;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({ order, onClose }) => {
  const handlePrint = () => window.print();

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'PENDING';
      case 'accepted': return 'PREPARING';
      case 'ready': return 'READY FOR PICKUP';
      case 'completed': return 'PICKED UP';
      case 'cancelled': return 'CANCELLED';
      // Fix: Cast 'status' to string to avoid 'never' type error in exhaustive switch
      default: return (status as string).toUpperCase();
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400 text-slate-950 border-yellow-300';
      case 'accepted': return 'bg-blue-500 text-white border-blue-400';
      case 'ready': return 'bg-green-500 text-white border-green-400 animate-pulse';
      case 'completed': return 'bg-slate-700 text-slate-300 border-slate-600';
      case 'cancelled': return 'bg-red-500 text-white border-red-400';
      default: return 'bg-slate-800 text-white';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-950">
      <div className="max-w-sm w-full bg-slate-900 rounded-[3rem] p-10 text-center shadow-2xl border border-slate-800 print:bg-white print:text-black print:border-0 print:shadow-none print:p-4">
         <div className="flex flex-col items-center mb-6">
           <div className={`px-4 py-1 rounded-full border text-[10px] font-black tracking-widest mb-4 shadow-lg ${getStatusColor(order.status)}`}>
             {getStatusLabel(order.status)}
           </div>
           <h2 className="font-kampung text-4xl text-gradient-primary uppercase tracking-tighter print:text-black">Terima Kasih!</h2>
         </div>
         
         <p className="text-slate-400 font-bold mb-8 text-sm print:text-black">
           {order.status === 'ready' ? 'Your treats are cold and ready!' : 'We are preparing your nostalgic ice pops.'}
         </p>
         
         <div className="bg-slate-800 rounded-3xl p-6 mb-8 border border-slate-700 print:bg-white print:border-black">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 print:text-black">Order ID</p>
           <h1 className="text-7xl font-black text-white font-kampung mb-2 tracking-tighter print:text-black">#{order.id}</h1>
         </div>

         <div className="bg-white text-slate-900 p-6 rounded-[2rem] mb-10 shadow-xl border border-slate-200">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Self Pickup Point</p>
           <p className="text-sm font-bold uppercase">{PICKUP_LOCATION}</p>
           <p className="text-3xl font-black text-pink-600 mt-1">{PICKUP_UNIT}</p>
           <p className="text-[9px] text-slate-400 mt-4 uppercase font-bold">Please show this to collect your lollies</p>
         </div>

         <div className="flex flex-col gap-4 print:hidden">
           <button 
             onClick={handlePrint} 
             className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all shadow-xl"
           >
             Save Receipt / Print
           </button>
           <button 
             onClick={onClose} 
             className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-700 transition-all border border-slate-700"
           >
             Return to Menu
           </button>
         </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
