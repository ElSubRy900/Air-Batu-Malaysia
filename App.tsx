import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.tsx';
import ProductCard from './components/ProductCard.tsx';
import Cart from './components/Cart.tsx';
import { Product, CartItem } from './types.ts';
import { PRODUCTS, PICKUP_LOCATION, PICKUP_PRIVACY_NOTE, WHATSAPP_NUMBER } from './constants.ts';
import { useShopStore } from './useShopStore.ts';

const App: React.FC = () => {
  const store = useShopStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const hasFetchedRec = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('air-batu-theme') as 'dark' | 'light';
    setTheme(saved || 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    if (!hasFetchedRec.current) {
      hasFetchedRec.current = true;
      const fetchRecommendation = async () => {
        try {
          const hour = new Date().getHours();
          const timeContext = (hour >= 22 || hour < 5) ? "Late at Night" : "Daytime";
          const weatherContext = "Sunny"; // Defaulting to Sunny for now

          const { getFlavorRecommendation } = await import('./services/geminiService.ts');
          const rec = await getFlavorRecommendation('Happy', weatherContext, timeContext);
          setAiRecommendation(rec);
        } catch (err) {
          setAiRecommendation("Panas terik today! Grab a cooling Watermelon stick, just like when we used to lepak after school. Shiok!");
        }
      };
      setTimeout(fetchRecommendation, 1500);
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleWhatsAppOrder = (customerName: string, pickupTime: string) => {
    const itemsList = cart.map(item => `- ${item.quantity}x ${item.name}`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    
    // pickupTime is now directly in 12-hour format (e.g. "07:30 PM") from the Cart component
    const message = `New Order for Air Batu Malaysia!\n\nCustomer Name: ${customerName}\nPickup Time: ${pickupTime}\n\nItems:\n${itemsList}\n\nTotal Price: $${total}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setCart([]); 
    setIsCartOpen(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="theme-container app-container w-full mx-auto flex flex-col transition-colors relative">
      <div className="bg-red-600 text-white text-[10px] font-black py-3 uppercase tracking-widest overflow-hidden relative border-b border-red-500 w-full shrink-0">
        <div className="animate-marquee whitespace-nowrap">
          ✨ NEW FLAVORS JUST LANDED! ✨ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✨ HAND-PACKED WITH LOVE ✨ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✨ STAY COOL WITH KAMPUNG CHILL ✨
        </div>
      </div>

      <Navbar 
        cartCount={cartItemCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenTrack={() => {}}
        currentTheme={theme}
        onToggleTheme={() => {
          const next = theme === 'dark' ? 'light' : 'dark';
          setTheme(next);
          localStorage.setItem('air-batu-theme', next);
        }}
      />

      <main className={`flex-1 px-4 sm:px-8 pt-4 w-full ${cartItemCount > 0 ? 'pb-32' : 'pb-20'} relative`}>
        <header className="mb-8 text-center flex flex-col items-center">
          <h1 className="font-kampung text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-tight font-black text-gradient-primary mb-8 max-w-lg">
            AIR BATU MALAYSIA
          </h1>
          
          <div className="bg-slate-500/5 border border-[var(--border-color)] p-6 rounded-[2.5rem] shadow-lg w-full max-w-xs flex flex-col items-center gap-3">
             <p className="theme-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Self Pickup Point</p>
             <strong className="text-[var(--text-color)] font-black text-xs">{PICKUP_LOCATION}</strong>
             <p className="text-[9px] text-pink-500 font-bold uppercase italic opacity-80">{PICKUP_PRIVACY_NOTE}</p>
          </div>
        </header>

        <section className="mb-8 w-full">
          <div className="relative bg-slate-500/5 border border-[var(--border-color)] rounded-[2.5rem] p-8 shadow-2xl text-center min-h-[120px] flex flex-col justify-center">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-400 mb-3">AI Flavor Guide</h4>
            <p className="text-[var(--text-color)] font-bold text-sm italic opacity-90 leading-relaxed px-4">
              "{aiRecommendation || "The kampung spirits are deciding on your treat..."}"
            </p>
          </div>
        </section>

        <section className="w-full">
          <div className="flex flex-col items-center mb-10">
            <h2 className="font-kampung text-4xl sm:text-5xl text-[var(--text-color)] uppercase tracking-tighter">Our Flavours</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-green-500 mt-3 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full mb-12">
            {PRODUCTS.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                currentStock={store.productStocks[product.id] || 99} 
                isShopOpen={true} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        </section>
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
          <div className="max-w-[500px] mx-auto w-full px-4">
            <div className="pointer-events-auto theme-nav backdrop-blur-xl border-t px-6 py-6 flex items-center justify-between shadow-2xl rounded-t-[2.5rem] border-x border-t border-[var(--border-color)]">
              <div className="flex flex-col">
                <span className="text-[9px] font-black theme-text-muted uppercase tracking-widest">Cart Total</span>
                <span className="font-kampung text-3xl text-[var(--text-color)] tracking-tighter">${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => setIsCartOpen(true)} className="bg-pink-600 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl active:scale-95 transition-all">
                <span className="uppercase text-[11px] tracking-widest">Order ({cartItemCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        setCart={setCart} 
        onOrderConfirmed={handleWhatsAppOrder} 
      />
    </div>
  );
};

export default App;