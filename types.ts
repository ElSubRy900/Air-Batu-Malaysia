
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Classic' | 'Premium' | 'Limited';
  image: string;
  color: string;
  stock?: number;
  isComingSoon?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
}

export interface UserMood {
  mood: string;
  weather: string;
}
