import { CartLine } from '../types';

const CART_STORAGE_KEY = 'reservationCart';

const storeCartLines = (lines: CartLine[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
};

const getCartLines = (): CartLine[] => {
  const lines = localStorage.getItem(CART_STORAGE_KEY);

  if (!lines) return [];

  try {
    return JSON.parse(lines) as CartLine[];
  } catch {
    return [];
  }
};

const clearCartLines = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

export { storeCartLines, getCartLines, clearCartLines };