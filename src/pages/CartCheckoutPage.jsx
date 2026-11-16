import { useContext, useState } from "react";
import { RestaurantContext } from "../context/RestaurantContext";

export default function CartCheckoutPage() {
  const { cart, updateQuantity, removeFromCart, placeOrder, orders } =
    useContext(RestaurantContext);

  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("Delivery");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (orderType === "Delivery" && !address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    setError("");
    const created = placeOrder({
      customerName,
      orderType,
      address: orderType === "Delivery" ? address : "Store Pickup",
    });
    setConfirmedOrder(created);
    setCustomerName("");
    setAddress("");
  };

  return (
    <div className="page-container">
      <h2>Your Cart & Checkout</h2>

      {confirmedOrder && (
        <div className="success-banner">
          Order #{confirmedOrder.id} confirmed for {confirmedOrder.customerName}! Status:{" "}
          <strong>{confirmedOrder.status}</strong>
        </div>
      )}

      {cart.length === 0 ? (
        <p>Your cart is currently empty. Add items from the menu to get started.</p>
      ) : (
        <div className="checkout-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)} each</p>
                </div>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <button onClick={() => removeFromCart(item.id)} className="btn-danger">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <h3>Total: ${subtotal.toFixed(2)}</h3>
          </div>

          <form onSubmit={handleCheckout} className="checkout-form">
            <h3>Order Details</h3>
            {error && <p className="error-text">{error}</p>}

            <input
              type="text"
              placeholder="Your Full Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="Delivery"
                  checked={orderType === "Delivery"}
                  onChange={(e) => setOrderType(e.target.value)}
                />
                Delivery
              </label>
              <label>
                <input
                  type="radio"
                  value="Pickup"
                  checked={orderType === "Pickup"}
                  onChange={(e) => setOrderType(e.target.value)}
                />
                Pickup
              </label>
            </div>

            {orderType === "Delivery" && (
              <input
                type="text"
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            )}

            <button type="submit" className="btn-primary">
              Place Order (${subtotal.toFixed(2)})
            </button>
          </form>
        </div>
      )}

      {/* Order Status Tracker */}
      <div className="orders-history">
        <h3>Recent Orders & Live Status</h3>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          orders.map((ord) => (
            <div key={ord.id} className="order-card">
              <p>
                <strong>Order #{ord.id}</strong> ({ord.orderType}) — Total: $
                {ord.total.toFixed(2)}
              </p>
              <p>
                Status: <span className="status-badge">{ord.status}</span> (Placed at{" "}
                {ord.createdAt})
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
