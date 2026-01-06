import { Product } from './types';

export const WHATSAPP_NUMBER = "6588684732"; 
export const BUSINESS_NAME = "AIR BATU MALAYSIA";
export const PICKUP_LOCATION = "131B Tengah Garden Avenue";
export const PICKUP_PRIVACY_NOTE = "Unit number provided upon order confirmation.";

export const PRODUCTS: Product[] = [
  {
    id: 'watermelon',
    name: 'Watermelon',
    description: 'Sweet, juicy, and incredibly refreshing. The perfect summer cooler.',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/GmbZXz7J/Watermelon.jpg', 
    color: 'bg-red-50'
  },
  {
    id: 'brown-sugar-milk-tea',
    name: 'Brown Sugar Milk Tea',
    description: 'Creamy milk tea with rich caramel-like brown sugar swirls.',
    price: 2.00,
    category: 'Premium',
    image: 'https://i.postimg.cc/fLbz1D8j/Brownsugarmilktea.jpg', 
    color: 'bg-stone-50'
  },
  {
    id: 'hazelnut-coffee',
    name: 'Hazelnut Coffee',
    description: 'A smooth blend of aromatic coffee with a nutty hazelnut finish.',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/CLbRGMXZ/Hazelnutcoffee.jpg', 
    color: 'bg-amber-50'
  },
  {
    id: 'vanilla-blue',
    name: 'Vanilla Blue',
    description: 'A magical blue treat with a sweet and creamy vanilla flavor.',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/52NfXxVJ/Vanillablue.jpg', 
    color: 'bg-blue-50'
  },
  {
    id: 'bubblegum',
    name: 'Bubblegum',
    description: 'Fun, sweet, and nostalgic. A favorite for the young and young at heart.',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/7ZYq5xkr/Bubblegum.jpg', 
    color: 'bg-pink-50'
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    description: 'Rich, velvety cocoa goodness. A timeless classic for chocolate lovers.',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/dVtJhqYq/Chocolate.jpg', 
    color: 'bg-orange-50'
  },
  {
    id: 'honeydew',
    name: 'Honeydew',
    description: 'Light, sweet, and fragrant melon. Cooling and delightful.',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/pLXPm2HP/Honeydew.jpg', 
    color: 'bg-green-50'
  },
  {
    id: 'durian',
    name: 'Durian',
    description: 'The King of Fruits. Rich, creamy, and undeniably bold.',
    price: 2.00,
    category: 'Premium',
    image: 'https://i.postimg.cc/Gmhb4cCp/Durian.jpg', 
    color: 'bg-yellow-50'
  },
  {
    id: 'sarsi',
    name: 'Sarsi',
    description: 'The classic sarsaparilla root beer flavor. Coming soon!',
    price: 2.00,
    category: 'Limited',
    image: 'https://i.postimg.cc/440NyWbp/Sarsi.jpg',
    color: 'bg-slate-100',
    isComingSoon: true
  },
  {
    id: 'matcha',
    name: 'Matcha',
    description: 'Earthy, rich, and premium green tea goodness. Coming soon!',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/7YTP2Smh/Matcha.jpg',
    color: 'bg-emerald-50',
    isComingSoon: true
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'A sophisticated coffee treat with a creamy foam-like finish. Coming soon!',
    price: 2.00,
    category: 'Premium',
    image: 'https://i.postimg.cc/wTsxmD07/Cappucino.jpg',
    color: 'bg-stone-100',
    isComingSoon: true
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    description: 'Sweet, tart, and bursting with berry flavor. Coming soon!',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/CLfMqbmd/Strawberry.jpg',
    color: 'bg-rose-50',
    isComingSoon: true
  },
  {
    id: 'mango',
    name: 'Mango',
    description: 'Tropical paradise in every bite. Sweet, sun-ripened mango. Coming soon!',
    price: 2.00,
    category: 'Classic',
    image: 'https://i.postimg.cc/CLfMqbm1/Mango.jpg',
    color: 'bg-orange-50',
    isComingSoon: true
  }
];

export const ALL_PRODUCT_IDS = PRODUCTS.map(p => p.id);
export const INITIAL_STOCK_COUNT = 99;