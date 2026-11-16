import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { RestaurantProvider, RestaurantContext } from "./context/RestaurantContext";
import MenuPage from "./pages/MenuPage";
import CartCheckoutPage from "./pages/CartCheckoutPage";
import "./App.css";

function Navigation() {
  const { cart } = useContext(RestaurantContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <h1>Smart Restaurant</h1>
      <div className="nav-links">
        <Link to="/">Menu</Link>
        <Link to="/cart">Cart ({totalItems})</Link>
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
          <Route path="/cart" element={<CartCheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </RestaurantProvider>
  );
}