import { createContext, useState } from "react";
import { initialMenu } from "../data/mockMenu";

export const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [menuItems, setMenuItems] = useState(initialMenu);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  const addReservation = (bookingDetails) => {
    const newBooking = {
      id: Date.now(),
      status: "Pending",
      ...bookingDetails,
    };
    setReservations((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelReservation = (id) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: "Canceled" } : res))
    );
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
        reservations,
        setReservations,
        addReservation,
        cancelReservation,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}