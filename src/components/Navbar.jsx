import { CURRENCIES } from '../hooks/useExchangeRates'

// Barra superior: marca, navegación, moneda y acceso al carrito.
function Navbar({
  view,
  onNavigate,
  cartCount,
  ticketCount,
  onOpenCart,
  currency,
  onChangeCurrency,
  rates,
  ratesLoading,
}) {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <button className="brand" onClick={() => onNavigate('cartelera')} aria-label="Ir a la cartelera">
          taquilla<span>sv</span>
        </button>

        <nav className="topnav" aria-label="Principal">
          <button
            className={view === 'cartelera' || view === 'evento' ? 'is-current' : ''}
            onClick={() => onNavigate('cartelera')}
          >
            Cartelera
          </button>
          <button className={view === 'boletos' ? 'is-current' : ''} onClick={() => onNavigate('boletos')}>
            <span className="hide-sm">Mis </span>boletos{ticketCount > 0 && <span className="count">{ticketCount}</span>}
          </button>
        </nav>

        <div className="topbar-tools">
          <label className="currency">
            <span className="sr-only">Moneda</span>
            <select value={currency} onChange={(e) => onChangeCurrency(e.target.value)} disabled={ratesLoading}>
              {CURRENCIES.map((code) => (
                <option key={code} value={code} disabled={!rates[code]}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <button className="cart-toggle" onClick={onOpenCart} aria-label={`Carrito, ${cartCount} boletos`}>
            <span className="cart-word">Carrito</span>
            <span className={`cart-num ${cartCount > 0 ? 'has-items' : ''}`}>{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
