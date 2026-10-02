// Campo de búsqueda controlado: el texto vive en el estado del componente padre.
function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <label htmlFor="buscar" className="sr-only">
        Buscar eventos
      </label>
      <input
        id="buscar"
        type="search"
        placeholder="Buscar evento, lugar o ciudad"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>
          Borrar
        </button>
      )}
    </div>
  )
}

export default SearchBar
