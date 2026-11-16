import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { RestaurantProvider, RestaurantContext } from "./context/RestaurantContext";
import MenuPage from "./pages/MenuPage";
import CartCheckoutPage from "./pages/CartCheckoutPage";
import ReservationsPage from "./pages/ReservationsPage";
import ProfilePage from "./pages/ProfilePage";
import AiChatWidget from "./components/AiChatWidget";
import "./App.css";

function Navigation() {
  const { cart, currentUser } = useContext(RestaurantContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <h1>Smart Restaurant</h1>
      <div className="nav-links">
        <Link to="/">Menu</Link>
        <Link to="/reservations">Reservations & Events</Link>
        <Link to="/cart">Cart ({totalItems})</Link>
        <Link to="/profile">{currentUser ? currentUser.name : "Account"}</Link>
        <Link to="/admin">Admin Dashboard</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/cart" element={<CartCheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Routes>
      <AiChatWidget />
      </BrowserRouter>
    </RestaurantProvider>
  );
}