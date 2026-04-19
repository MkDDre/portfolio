import { createContext, ReactNode, useMemo, useState } from 'react';
import { CartContextType, CartLine, ServiceDto } from '../types';
import { clearCartLines, getCartLines, storeCartLines } from '../utils/cartSession';

const defaultCartContext: CartContextType = {
  lines: [],
  totalPrice: 0,
  addLine: () => {},
  removeLine: () => {},
  clearCart: () => {},
};

const CartContext = createContext<CartContextType>(defaultCartContext);

const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>(getCartLines());

  const addLine = (service: ServiceDto) => {
    setLines((currentLines) => {
      const exists = currentLines.some((line) => line.serviceId === service.id);
      if (exists) return currentLines;

      const nextLines = [
        ...currentLines,
        {
          serviceId: service.id,
          serviceTitle: service.serviceTitle,
          price: service.price,
        },
      ];

      storeCartLines(nextLines);
      return nextLines;
    });
  };

  const removeLine = (serviceId: number) => {
    setLines((currentLines) => {
      const nextLines = currentLines.filter((line) => line.serviceId !== serviceId);
      storeCartLines(nextLines);
      return nextLines;
    });
  };

  const clearCart = () => {
    clearCartLines();
    setLines([]);
  };

  const totalPrice = useMemo(
    () => lines.reduce((acc, line) => acc + line.price, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ lines, totalPrice, addLine, removeLine, clearCart }),
    [lines, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext, CartContextProvider };