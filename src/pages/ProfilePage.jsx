import { useContext, useState } from "react";
import { RestaurantContext } from "../context/RestaurantContext";

export default function ProfilePage() {
  const { currentUser, setCurrentUser, orders, reservations } =
    useContext(RestaurantContext);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [dietPref, setDietPref] = useState("None");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;
    setCurrentUser({
      name: nameInput,
      email: emailInput,
      preference: dietPref,
    });
  };

  if (!currentUser) {
    return (
      <div className="page-container">
        <h2>Customer Account</h2>
        <form onSubmit={handleLogin} className="checkout-form" style={{ maxWidth: "450px" }}>
          <h3>Sign In / Create Account</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          <label>
            Saved Dietary Preference:
            <select value={dietPref} onChange={(e) => setDietPref(e.target.value)}>
              <option value="None">No Preference</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </label>
          <button type="submit" className="btn-primary">
            Save & Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="order-card">
        <div>
          <h2>Welcome, {currentUser.name}</h2>
          <p>Email: {currentUser.email}</p>
          <p>Saved Dietary Preference: <strong>{currentUser.preference}</strong></p>
        </div>
        <button onClick={() => setCurrentUser(null)} className="btn-danger">
          Sign Out
        </button>
      </div>

      <h3>Order History ({orders.length})</h3>
      {orders.length === 0 ? (
        <p>No past orders yet.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="order-card">
            <p>Order #{o.id} — ${o.total.toFixed(2)}</p>
            <span className="status-badge">{o.status}</span>
          </div>
        ))
      )}

      <h3>Reservation History ({reservations.length})</h3>
      {reservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        reservations.map((r) => (
          <div key={r.id} className="order-card">
            <p>{r.bookingType} on {r.date} at {r.time}</p>
            <span className="status-badge">{r.status}</span>
          </div>
        ))
      )}
    </div>
  );
}