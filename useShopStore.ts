import { useState } from 'react';
import { ALL_PRODUCT_IDS } from './constants.ts';

export const useShopStore = () => {
  // Pure local state, no persistence needed for a menu-only app
  const [isShopOpen] = useState<boolean>(true);
  const [productStocks] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ALL_PRODUCT_IDS.forEach(id => initial[id] = 99); 
    return initial;
  });

  return {
    productStocks,
    isShopOpen
  };
};