import { CATEGORIES } from '../data/events'

// Pestañas para filtrar por categoría, con la cantidad de eventos de cada una.
function CategoryFilter({ selected, onSelect, counts }) {
  return (
    <div className="tabs" role="tablist" aria-label="Categorías">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={selected === cat.id}
          className={selected === cat.id ? 'is-current' : ''}
          onClick={() => onSelect(cat.id)}
        >
          {cat.label}
          <span className="tab-count">{counts[cat.id] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
