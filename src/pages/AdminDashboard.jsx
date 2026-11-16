import { useContext, useState } from "react";
import { RestaurantContext } from "../context/RestaurantContext";

export default function AdminDashboard() {
  const {
    menuItems,
    setMenuItems,
    orders,
    setOrders,
    reservations,
    setReservations,
  } = useContext(RestaurantContext);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Mains");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [dietary, setDietary] = useState("");

  // Add new dish
  const handleAddDish = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const newDish = {
      id: Date.now(),
      name,
      category,
      description: description || "Freshly prepared house dish.",
      ingredients: ingredients || "Chef's selected ingredients",
      price: parseFloat(price),
      dietary: dietary
        ? dietary.split(",").map((tag) => tag.trim())
        : [],
      available: true,
    };

    setMenuItems((prev) => [...prev, newDish]);
    setName("");
    setDescription("");
    setIngredients("");
    setPrice("");
    setDietary("");
  };

  // Toggle availability in real time
  const toggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  // Delete menu item
  const deleteMenuItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update customer order status
  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status: newStatus } : ord))
    );
  };

  // Approve or cancel reservation
  const updateReservationStatus = (id, newStatus) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res))
    );
  };

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>

      {/* Analytics Summary */}
      <div className="analytics-grid">
        <div className="stat-box">
          <h4>Total Menu Items</h4>
          <p>{menuItems.length}</p>
        </div>
        <div className="stat-box">
          <h4>Total Orders</h4>
          <p>{orders.length}</p>
        </div>
        <div className="stat-box">
          <h4>Total Revenue</h4>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-box">
          <h4>Active Bookings</h4>
          <p>{reservations.length}</p>
        </div>
      </div>

      {/* Add Menu Item Form */}
      <form onSubmit={handleAddDish} className="checkout-form" style={{ marginBottom: "2rem" }}>
        <h3>Add New Menu Item</h3>
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Dish Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Starters">Starters</option>
            <option value="Mains">Mains</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dietary tags (e.g. Vegetarian, Gluten-Free)"
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Add Dish to Menu
        </button>
      </form>

      {/* Manage Menu Items */}
      <h3>Manage Menu Items</h3>
      {menuItems.map((item) => (
        <div key={item.id} className="order-card">
          <div>
            <strong>{item.name}</strong> ({item.category}) — ${item.price.toFixed(2)}
            <p style={{ margin: "0.2rem 0", fontSize: "0.85rem" }}>
              Status: {item.available ? "Available" : "Out of Stock"}
            </p>
          </div>
          <div className="qty-controls">
            <button onClick={() => toggleAvailability(item.id)}>
              {item.available ? "Mark Unavailable" : "Mark Available"}
            </button>
            <button onClick={() => deleteMenuItem(item.id)} className="btn-danger">
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Manage Incoming Orders */}
      <h3 style={{ marginTop: "2rem" }}>Incoming Orders</h3>
      {orders.length === 0 ? (
        <p>No customer orders yet.</p>
      ) : (
        orders.map((ord) => (
          <div key={ord.id} className="order-card">
            <div>
              <strong>Order #{ord.id}</strong> — {ord.customerName} ({ord.orderType})
              <p>Total: ${ord.total.toFixed(2)}</p>
            </div>
            <select
              value={ord.status}
              onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
            >
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))
      )}

      {/* Manage Reservations & Special Events */}
      <h3 style={{ marginTop: "2rem" }}>Reservations & Special Events</h3>
      {reservations.length === 0 ? (
        <p>No reservations to review.</p>
      ) : (
        reservations.map((res) => (
          <div key={res.id} className="order-card">
            <div>
              <strong>{res.bookingType}</strong> — {res.guestName} ({res.guests} guests)
              <p>
                {res.date} at {res.time} | Status: <strong>{res.status}</strong>
              </p>
            </div>
            <div className="qty-controls">
              <button onClick={() => updateReservationStatus(res.id, "Approved")}>
                Approve
              </button>
              <button
                onClick={() => updateReservationStatus(res.id, "Canceled")}
                className="btn-danger"
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}