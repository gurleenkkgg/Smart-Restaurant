export default function MenuCard({ item, onAdd }) {
  return (
    <div className="menu-card">
      <div className="card-header">
        <h3>{item.name}</h3>
        <span className="price">${item.price.toFixed(2)}</span>
      </div>
      <p className="category-tag">{item.category}</p>
      <p className="description">{item.description}</p>
      <p className="ingredients">
        <strong>Ingredients:</strong> {item.ingredients}
      </p>

      {item.dietary.length > 0 && (
        <div className="badges">
          {item.dietary.map((tag) => (
            <span key={tag} className="badge">
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        disabled={!item.available}
        onClick={() => onAdd(item)}
        className="btn-primary"
      >
        {item.available ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}