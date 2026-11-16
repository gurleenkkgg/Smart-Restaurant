import { useContext, useState } from "react";
import { RestaurantContext } from "../context/RestaurantContext";
import MenuCard from "../components/MenuCard";

export default function MenuPage() {
  const { menuItems, addToCart } = useContext(RestaurantContext);

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState(30);

  const categories = ["All", "Starters", "Mains", "Desserts", "Beverages"];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.ingredients.toLowerCase().includes(search.toLowerCase());
    const matchesDietary =
      dietaryFilter === "All" || item.dietary.includes(dietaryFilter);
    const matchesPrice = item.price <= maxPrice;

    return matchesCategory && matchesSearch && matchesDietary && matchesPrice;
  });

  return (
    <div className="page-container">
      <h2>Our Menu</h2>

      {/* Filters Section */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search dishes or ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={dietaryFilter}
          onChange={(e) => setDietaryFilter(e.target.value)}
        >
          <option value="All">All Diets</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Gluten-Free">Gluten-Free</option>
        </select>

        <label>
          Max Price: ${maxPrice}
          <input
            type="range"
            min="5"
            max="30"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "tab active" : "tab"}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <p>No menu items match your filters.</p>
      ) : (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}