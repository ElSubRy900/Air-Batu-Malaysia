
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currentStock: number;
  isShopOpen: boolean;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currentStock, onAddToCart }) => {
  const isSoldOut = currentStock <= 0 && !product.isComingSoon;
  const isComingSoon = product.isComingSoon;
  const isDisabled = isSoldOut || isComingSoon;

  return (
    <div className={`rounded-[1.5rem] overflow-hidden theme-card border hover:border-pink-500/30 transition-all duration-300 relative group flex flex-col h-full shadow-lg w-full`}>
      {/* status overlays - scaled for smaller cards */}
      {isSoldOut && (
        <div className="absolute inset-0 z-10 bg-[var(--bg-color)]/80 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
          <div className="bg-red-600 text-white font-black px-3 py-1 rounded-full rotate-[-5deg] shadow-lg text-[8px] uppercase tracking-widest border border-red-400">Sold Out</div>
        </div>
      )}
      
      {isComingSoon && (
        <div className="absolute inset-0 z-10 bg-[var(--bg-color)]/60 backdrop-blur-[1px] flex items-center justify-center p-2 text-center">
          <div className="bg-emerald-600 text-white font-black px-3 py-1 rounded-full rotate-[-5deg] shadow-lg text-[8px] uppercase tracking-widest border border-emerald-400">COMING SOON</div>
        </div>
      )}
      
      <div className="relative h-32 sm:h-64 overflow-hidden w-full">
        <img 
          src={product.image} 
          className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${isDisabled ? 'grayscale opacity-50' : 'opacity-80 group-hover:opacity-100'}`} 
          alt={product.name} 
        />
        <div className="absolute top-1.5 right-1.5 bg-[var(--bg-card)]/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-[var(--border-color)]">
           <span className="text-[var(--text-color)] font-black text-[8px] sm:text-xs">$2.00</span>
        </div>
      </div>
      
      <div className="p-3 sm:p-6 flex flex-col flex-1 text-center w-full">
        <h3 className="font-kampung text-xs sm:text-xl text-[var(--text-color)] mb-1 sm:mb-2 uppercase tracking-tighter leading-tight break-words">{product.name}</h3>
        <p className="theme-text-muted text-[7px] sm:text-[10px] font-bold mb-3 sm:mb-6 flex-1 leading-tight sm:leading-relaxed max-w-full mx-auto opacity-70 break-words overflow-hidden">
          {product.description}
        </p>
        
        <button 
          onClick={() => !isDisabled && onAddToCart(product)}
          disabled={isDisabled}
          className={`w-full font-black py-2 sm:py-3.5 rounded-lg sm:rounded-xl transition-all active:scale-95 text-[7px] sm:text-[9px] uppercase tracking-widest sm:tracking-[0.1em] shadow-xl ${
            isDisabled 
              ? 'bg-slate-500/10 text-slate-500 cursor-not-allowed border border-[var(--border-color)]' 
              : 'bg-pink-600 text-white hover:bg-pink-500'
          }`}
        >
          {isSoldOut ? 'Sold Out' : isComingSoon ? 'SOON' : 'Add to Basket'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
