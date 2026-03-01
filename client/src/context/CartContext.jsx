import { createContext, useContext, useMemo, useState } from "react";
import { getStoredCart, setStoredCart } from "../utils/storage";
import { discountedPrice } from "../utils/pricing";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(getStoredCart());

  const sync = (nextItems) => {
    setItems(nextItems);
    setStoredCart(nextItems);
  };

  const addToCart = (product) => {
    const existing = items.find((item) => item._id === product._id);
    const nextItems = existing
      ? items.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...items, { ...product, quantity: 1 }];

    sync(nextItems);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    sync(items.map((item) => (item._id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id) => {
    sync(items.filter((item) => item._id !== id));
  };

  const clearCart = () => sync([]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + discountedPrice(item.price, item.discount) * item.quantity,
        0
      ),
    [items]
  );

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    total
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
