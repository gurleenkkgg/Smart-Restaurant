import { createContext, useState } from "react";
import { initialMenu } from "../data/mockMenu";

export const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [menuItems, setMenuItems] = useState(initialMenu);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Add item to cart or increase quantity
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Update quantity or remove if 0
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Submit order
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "Preparing",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      ...orderDetails,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        setMenuItems,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        orders,
        setOrders,
        placeOrder,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}